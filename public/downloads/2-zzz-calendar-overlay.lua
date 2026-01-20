--[[
    Calendar Overlay Patch for KOReader
    Displays upcoming calendar events on top of any screensaver
--]]

local logger = require("logger")

-- ============================================
-- CONFIGURATION
-- ============================================

local ICS_URL = "https://example.com/calendar.ics"  -- Replace with your ICS feed URL

local CACHE_MAX_AGE = 1800 -- 30 minutes

-- Display style constants
local STYLE_MINIMAL = "minimal"
local STYLE_TODAY = "today"
local STYLE_TOMORROW = "tomorrow"
local STYLE_FULL_TODAY = "full_today"

-- ============================================
-- HTTP & ICS Parsing Functions
-- ============================================

local function httpRequest(url)
    local ltn12 = require("ltn12")
    local sink_table = {}
    local sink = ltn12.sink.table(sink_table)
    
    -- Set a timeout to prevent hanging
    local socket = require("socket")
    
    local success_ssl, https = pcall(require, "ssl.https")
    if success_ssl and https and https.request then
        local _, code = https.request{
            url = url,
            sink = sink,
            timeout = 5,  -- 5 second timeout
        }
        if code == 200 then
            return table.concat(sink_table)
        end
    end
    
    local success_sock, http = pcall(require, "socket.http")
    if success_sock and http and http.request then
        local _, code = http.request{
            url = url,
            sink = sink,
            timeout = 5,  -- 5 second timeout
        }
        if code == 200 then
            return table.concat(sink_table)
        end
    end
    
    return nil
end

local function parseICSDateTime(dt)
    if not dt then return nil end
    dt = dt:gsub("^VALUE=DATE:", ""):gsub("^[^:]+:", "")
    
    local y, m, d = dt:match("^(%d%d%d%d)(%d%d)(%d%d)$")
    if y then
        return os.time({year=tonumber(y), month=tonumber(m), day=tonumber(d), hour=0, min=0, sec=0}), true
    end
    
    y, m, d, h, min, s = dt:match("^(%d%d%d%d)(%d%d)(%d%d)T(%d%d)(%d%d)(%d%d)")
    if y then
        return os.time({year=tonumber(y), month=tonumber(m), day=tonumber(d), hour=tonumber(h), min=tonumber(min), sec=tonumber(s)}), false
    end
    
    return nil
end

local function parseICS(content)
    local events = {}
    local current = nil
    local in_event = false
    
    for line in content:gmatch("[^\r\n]+") do
        if line:match("^BEGIN:VEVENT") then
            in_event = true
            current = {}
        elseif line:match("^END:VEVENT") and in_event then
            if current.DTSTART and current.SUMMARY then
                table.insert(events, current)
            end
            in_event = false
            current = nil
        elseif in_event then
            local prop, val = line:match("^([^:]+):(.*)$")
            if prop and val then
                local p = prop:match("^([^;]+)")
                if p == "DTSTART" or p == "SUMMARY" or p == "LOCATION" then
                    current[p] = val
                end
            end
        end
    end
    
    return events
end

local function formatEvent(event)
    if not event then return nil end
    
    local start_time, is_all_day = parseICSDateTime(event.DTSTART)
    if not start_time then return nil end
    
    local time_str = "All day"
    if not is_all_day then
        if G_reader_settings:isTrue("twelve_hour_clock") then
            time_str = os.date("%I:%M %p", start_time):gsub("^0", "")
        else
            time_str = os.date("%H:%M", start_time)
        end
    end
    
    local title = event.SUMMARY:gsub("\\n", " "):gsub("\\,", ","):gsub("\\;", ";"):gsub("\\\\", "\\")
    local location = event.LOCATION and event.LOCATION:gsub("\\n", " "):gsub("\\,", ","):gsub("\\;", ";"):gsub("\\\\", "\\") or nil
    
    return {
        title = title,
        date = os.date("%A, %B %d, %Y", start_time),
        time = time_str,
        location = location,
        timestamp = start_time,
        is_all_day = is_all_day,
    }
end

-- ============================================
-- Cache Functions
-- ============================================

local function clearCache()
    local DataStorage = require("datastorage")
    local cache_file = DataStorage:getDataDir() .. "/cache/calendar-overlay.json"
    local success = false
    
    local f = io.open(cache_file, "r")
    if f then
        f:close()
        os.remove(cache_file)
        success = true
        logger.info("Calendar: Cache cleared")
    end
    
    return success
end

local function saveCache(data)
    local DataStorage = require("datastorage")
    local util = require("util")
    local cache_dir = DataStorage:getDataDir() .. "/cache/"
    
    -- Ensure directory exists
    local success, err = pcall(util.makePath, cache_dir)
    if not success then
        logger.warn("Calendar: Failed to create cache directory:", err)
        return false
    end
    
    local cache_file = cache_dir .. "calendar-overlay.json"
    local json = require("json")
    
    local f = io.open(cache_file, "w")
    if f then
        local ok, encoded = pcall(json.encode, {timestamp = os.time(), data = data})
        if ok then
            f:write(encoded)
            f:close()
            logger.info("Calendar: Cache saved successfully")
            return true
        else
            f:close()
            logger.warn("Calendar: Failed to encode cache data")
        end
    end
    
    return false
end

local function loadCache()
    local DataStorage = require("datastorage")
    local cache_file = DataStorage:getDataDir() .. "/cache/calendar-overlay.json"
    
    local f = io.open(cache_file, "r")
    if not f then
        logger.dbg("Calendar: No cache file found")
        return nil
    end
    
    local content = f:read("*all")
    f:close()
    
    if not content or content == "" then
        logger.warn("Calendar: Cache file empty")
        return nil
    end
    
    local json = require("json")
    local ok, cache = pcall(json.decode, content)
    if not ok or not cache or not cache.timestamp or not cache.data then
        logger.warn("Calendar: Cache file corrupted")
        return nil
    end
    
    local age = os.time() - cache.timestamp
    if age > CACHE_MAX_AGE then
        logger.dbg("Calendar: Cache too old (", age, "seconds)")
        return nil
    end
    
    logger.info("Calendar: Using cached data (age:", age, "seconds)")
    return cache.data
end

-- ============================================
-- Fetch & Format Calendar Data
-- ============================================

local function fetchCalendarData()
    -- Try cache first for speed
    local cached = loadCache()
    if cached then
        return cached
    end
    
    logger.info("Calendar: Fetching from ICS feed")
    
    -- Protected HTTP call with timeout
    local ok, ics_content = pcall(httpRequest, ICS_URL)
    if not ok or not ics_content then
        logger.warn("Calendar: Failed to fetch ICS data")
        return nil
    end
    
    -- Protected parsing
    local ok2, raw_events = pcall(parseICS, ics_content)
    if not ok2 or not raw_events then
        logger.warn("Calendar: Failed to parse ICS data")
        return nil
    end
    
    local formatted_events = {}
    for _, event in ipairs(raw_events) do
        local ok3, formatted = pcall(formatEvent, event)
        if ok3 and formatted then
            table.insert(formatted_events, formatted)
        end
    end
    
    table.sort(formatted_events, function(a, b) return a.timestamp < b.timestamp end)
    
    if #formatted_events > 0 then
        saveCache(formatted_events)
        logger.info("Calendar: Fetched and cached", #formatted_events, "events")
    else
        logger.warn("Calendar: No events found in ICS feed")
    end
    
    return formatted_events
end

-- ============================================
-- Widget Creation Functions
-- ============================================

local function createEventWidget(event, font_size)
    local Font = require("ui/font")
    local TextWidget = require("ui/widget/textwidget")
    local HorizontalGroup = require("ui/widget/horizontalgroup")
    local HorizontalSpan = require("ui/widget/horizontalspan")
    local Blitbuffer = require("ffi/blitbuffer")
    
    local widgets = {}
    
    -- Time
    table.insert(widgets, TextWidget:new{
        text = event.time,
        face = Font:getFace("cfont", font_size),
        fgcolor = Blitbuffer.COLOR_DARK_GRAY,
    })
    
    table.insert(widgets, HorizontalSpan:new{ width = 12 })
    
    -- Title
    local title = event.title
    if #title > 40 then
        title = title:sub(1, 37) .. "..."
    end
    table.insert(widgets, TextWidget:new{
        text = title,
        face = Font:getFace("cfont", font_size),
        fgcolor = Blitbuffer.COLOR_BLACK,
    })
    
    return HorizontalGroup:new{
        align = "center",
        unpack(widgets)
    }
end

local function createCalendarCard()
    -- Check if enabled
    if G_reader_settings:isFalse("calendar_overlay_enabled") then
        logger.dbg("Calendar: Disabled in settings")
        return nil
    end
    
    -- Protected data fetch
    local ok, all_events = pcall(fetchCalendarData)
    if not ok then
        logger.warn("Calendar: Error fetching calendar data:", all_events)
        return nil
    end
    
    if not all_events or #all_events == 0 then
        logger.dbg("Calendar: No events available")
        return nil
    end
    
    local style = G_reader_settings:readSetting("calendar_overlay_style") or STYLE_MINIMAL
    local now = os.time()
    local today_start = os.time(os.date("*t", now))
    local today_end = today_start + 86400
    local tomorrow_start = today_end
    local tomorrow_end = tomorrow_start + 86400
    
    local Screen = require("device").screen
    local Font = require("ui/font")
    local TextWidget = require("ui/widget/textwidget")
    local VerticalGroup = require("ui/widget/verticalgroup")
    local VerticalSpan = require("ui/widget/verticalspan")
    local FrameContainer = require("ui/widget/container/framecontainer")
    local CenterContainer = require("ui/widget/container/centercontainer")
    local BottomContainer = require("ui/widget/container/bottomcontainer")
    local Blitbuffer = require("ffi/blitbuffer")
    local Geom = require("ui/geometry")
    
    local screen_width = Screen:getWidth()
    local widgets = {}
    
    if style == STYLE_MINIMAL then
        -- Show only next event
        local next_event = nil
        for _, event in ipairs(all_events) do
            if event.timestamp >= now then
                next_event = event
                break
            end
        end
        
        if not next_event then
            logger.dbg("Calendar: No upcoming events for minimal view")
            return nil
        end
        
        local title_text = next_event.title
        if #title_text > 60 then
            title_text = title_text:sub(1, 57) .. "..."
        end
        
        table.insert(widgets, TextWidget:new{
            text = title_text,
            face = Font:getFace("cfont", 22),
            bold = true,
            fgcolor = Blitbuffer.COLOR_BLACK,
        })
        table.insert(widgets, VerticalSpan:new{ width = 8 })
        
        table.insert(widgets, TextWidget:new{
            text = next_event.date .. " at " .. next_event.time,
            face = Font:getFace("cfont", 18),
            fgcolor = Blitbuffer.COLOR_DARK_GRAY,
        })
        
        if next_event.location then
            table.insert(widgets, VerticalSpan:new{ width = 4 })
            table.insert(widgets, TextWidget:new{
                text = next_event.location,
                face = Font:getFace("cfont", 16),
                fgcolor = Blitbuffer.COLOR_GRAY_3,
            })
        end
        
    elseif style == STYLE_TODAY or style == STYLE_FULL_TODAY then
        -- Show today's events
        local today_events = {}
        for _, event in ipairs(all_events) do
            if event.timestamp >= today_start and event.timestamp < today_end then
                table.insert(today_events, event)
            end
        end
        
        if #today_events == 0 then
            logger.dbg("Calendar: No events today")
            return nil
        end
        
        -- Header
        table.insert(widgets, TextWidget:new{
            text = "Today",
            face = Font:getFace("cfont", 20),
            bold = true,
            fgcolor = Blitbuffer.COLOR_BLACK,
        })
        table.insert(widgets, VerticalSpan:new{ width = 10 })
        
        -- Events
        local max_events = style == STYLE_FULL_TODAY and #today_events or math.min(4, #today_events)
        for i = 1, max_events do
            if i > 1 then
                table.insert(widgets, VerticalSpan:new{ width = 6 })
            end
            table.insert(widgets, createEventWidget(today_events[i], 16))
        end
        
    elseif style == STYLE_TOMORROW then
        -- Show tomorrow's events
        local tomorrow_events = {}
        for _, event in ipairs(all_events) do
            if event.timestamp >= tomorrow_start and event.timestamp < tomorrow_end then
                table.insert(tomorrow_events, event)
            end
        end
        
        if #tomorrow_events == 0 then
            logger.dbg("Calendar: No events tomorrow")
            return nil
        end
        
        -- Header
        table.insert(widgets, TextWidget:new{
            text = "Tomorrow",
            face = Font:getFace("cfont", 20),
            bold = true,
            fgcolor = Blitbuffer.COLOR_BLACK,
        })
        table.insert(widgets, VerticalSpan:new{ width = 10 })
        
        -- Events (max 4)
        for i = 1, math.min(4, #tomorrow_events) do
            if i > 1 then
                table.insert(widgets, VerticalSpan:new{ width = 6 })
            end
            table.insert(widgets, createEventWidget(tomorrow_events[i], 16))
        end
    end
    
    if #widgets == 0 then
        logger.warn("Calendar: No widgets created")
        return nil
    end
    
    local card = FrameContainer:new{
        padding = 20,
        margin = 0,
        bordersize = 2,
        background = Blitbuffer.COLOR_WHITE,
        radius = 10,
        VerticalGroup:new{
            align = "left",
            unpack(widgets)
        },
    }
    
    logger.info("Calendar: Card created successfully")
    
    return BottomContainer:new{
        dimen = Geom:new{ w = screen_width, h = Screen:getHeight() },
        CenterContainer:new{
            dimen = Geom:new{ w = screen_width, h = card:getSize().h + 25 },
            card,
        }
    }
end

-- ============================================
-- Patch ScreenSaverWidget
-- ============================================

local ScreenSaverWidget = require("ui/widget/screensaverwidget")

if not ScreenSaverWidget._orig_init_calendar then
    ScreenSaverWidget._orig_init_calendar = ScreenSaverWidget.init
end

ScreenSaverWidget.init = function(self)
    logger.info("Calendar: ScreenSaverWidget init called")
    
    -- Call original init
    ScreenSaverWidget._orig_init_calendar(self)
    
    -- Protected calendar card creation
    local ok, calendar_card = pcall(createCalendarCard)
    
    if not ok then
        logger.warn("Calendar: Error creating calendar card:", calendar_card)
        return self
    end
    
    if calendar_card and self[1] then
        logger.info("Calendar: Overlaying calendar card")
        
        local OverlapGroup = require("ui/widget/overlapgroup")
        local Screen = require("device").screen
        
        local original_content = self[1]
        self[1] = OverlapGroup:new{
            dimen = Screen:getSize(),
            original_content,
            calendar_card,
        }
        
        logger.info("Calendar: Overlay complete")
    else
        logger.dbg("Calendar: No calendar card to display")
    end
    
    return self
end

-- ============================================
-- Add Menu
-- ============================================

local ReaderMenu = require("apps/reader/modules/readermenu")
local UIManager = require("ui/uimanager")
local InfoMessage = require("ui/widget/infomessage")

local orig_setUpdateItemTable = ReaderMenu.setUpdateItemTable

ReaderMenu.setUpdateItemTable = function(self)
    orig_setUpdateItemTable(self)
    
    self.menu_items.calendar_overlay = {
        text = "Calendar Overlay",
        sorting_hint = "more_tools",
        sub_item_table = {
            {
                text = "Enable Calendar",
                checked_func = function()
                    return G_reader_settings:nilOrTrue("calendar_overlay_enabled")
                end,
                callback = function()
                    if G_reader_settings:nilOrTrue("calendar_overlay_enabled") then
                        G_reader_settings:makeFalse("calendar_overlay_enabled")
                    else
                        G_reader_settings:makeTrue("calendar_overlay_enabled")
                    end
                    G_reader_settings:flush()
                end,
                separator = true,
            },
            {
                text = "Display Style",
                sub_item_table = {
                    {
                        text = "Minimal (Next Event)",
                        checked_func = function()
                            return (G_reader_settings:readSetting("calendar_overlay_style") or STYLE_MINIMAL) == STYLE_MINIMAL
                        end,
                        radio = true,
                        callback = function()
                            G_reader_settings:saveSetting("calendar_overlay_style", STYLE_MINIMAL)
                            G_reader_settings:flush()
                        end,
                    },
                    {
                        text = "Today's Schedule",
                        checked_func = function()
                            return G_reader_settings:readSetting("calendar_overlay_style") == STYLE_TODAY
                        end,
                        radio = true,
                        callback = function()
                            G_reader_settings:saveSetting("calendar_overlay_style", STYLE_TODAY)
                            G_reader_settings:flush()
                        end,
                    },
                    {
                        text = "Tomorrow's Schedule",
                        checked_func = function()
                            return G_reader_settings:readSetting("calendar_overlay_style") == STYLE_TOMORROW
                        end,
                        radio = true,
                        callback = function()
                            G_reader_settings:saveSetting("calendar_overlay_style", STYLE_TOMORROW)
                            G_reader_settings:flush()
                        end,
                    },
                    {
                        text = "Full Day Today",
                        checked_func = function()
                            return G_reader_settings:readSetting("calendar_overlay_style") == STYLE_FULL_TODAY
                        end,
                        radio = true,
                        callback = function()
                            G_reader_settings:saveSetting("calendar_overlay_style", STYLE_FULL_TODAY)
                            G_reader_settings:flush()
                        end,
                    },
                },
                keep_menu_open = true,
                separator = true,
            },
            {
                text = "Refresh Calendar",
                callback = function()
                    clearCache()
                    UIManager:show(InfoMessage:new{
                        text = "Calendar will refresh on next sleep",
                        timeout = 2,
                    })
                end,
            },
            {
                text = "Clear Cache",
                callback = function()
                    if clearCache() then
                        UIManager:show(InfoMessage:new{
                            text = "Cache cleared",
                            timeout = 2,
                        })
                    else
                        UIManager:show(InfoMessage:new{
                            text = "No cache to clear",
                            timeout = 2,
                        })
                    end
                end,
            },
        },
    }
end

logger.info("Calendar overlay patch with menu loaded successfully")