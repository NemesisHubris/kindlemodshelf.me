local _ = require("gettext")
local T = require("ffi/util").template
local UIManager = require("ui/uimanager")
local ReaderFooter = require("apps/reader/modules/readerfooter")
local ReaderView = require("apps/reader/modules/readerview")
local ReaderUI = require("apps/reader/readerui")
local Font = require("ui/font")
local Screen = require("device").screen
local Blitbuffer = require("ffi/blitbuffer")
local TextWidget = require("ui/widget/textwidget")
local SpinWidget = require("ui/widget/spinwidget")
local util = require("util")
local cre = require("document/credocument"):engineInit()

-- Settings keys
local BOOK_SETTINGS_KEY = "BOOK_SETTINGS"
local HEADER_FONT_SIZE = "header_font_size"
local HEADER_MARGIN = "header_margin"

-- Defaults
local DEFAULT_HEADER_FACE = "NotoSans-Regular.ttf"
local CRE_HEADER_DEFAULT_SIZE = 23
local DEFAULT_LETTER_SPACING = 0
local DEFAULT_HEADER_MARGIN = 40

--------------------------------------------------------------------------
-- Utility: basic string helpers
--------------------------------------------------------------------------
local function trim(s)
    if not s then return "" end
    return s:match("^%s*(.-)%s*$")
end

local function collapse_spaces(s)
    if not s then return "" end
    return s:gsub("%s+", " ")
end

local function normalize_str(s)
    if not s then return "" end
    s = tostring(s)
    s = s:lower()
    s = trim(s)
    s = collapse_spaces(s)
    return s
end

--------------------------------------------------------------------------
-- Deterministic hash (DJB2-like) -> returns 8-char hex string
--------------------------------------------------------------------------
local function hash_string_to_hex(s)
    s = s or ""
    local h = 5381
    for i = 1, #s do
        h = (h * 33 + s:byte(i)) % 4294967296 -- keep 32-bit
    end
    return string.format("%08x", h)
end

--------------------------------------------------------------------------
-- Book identifier: prefer metadata (title + author), fallback to filepath,
-- final fallback to 'unknown_book'. We hash the identifier for compact keys.
--------------------------------------------------------------------------
local function getBookMetaKey(ctx)
    local title, author, filepath

    if ctx and ctx.ui and ctx.ui.doc_props then
        local dp = ctx.ui.doc_props
        title = dp.display_title or dp.title or dp.name
        author = dp.author
        filepath = dp.filepath or dp.path or dp.file
    end

    if (not title or title == "") and ctx and ctx.document and ctx.document.fileinfo then
        title = title or ctx.document.fileinfo.title or ctx.document.fileinfo.filename
        filepath = filepath or ctx.document.fileinfo.path or ctx.document.fileinfo.filepath
    end

    title = normalize_str(title or "")
    author = normalize_str(author or "")

    local id_source
    if title ~= "" or author ~= "" then
        id_source = (title .. "|" .. author)
    elseif filepath and tostring(filepath) ~= "" then
        id_source = normalize_str(tostring(filepath))
    else
        id_source = "unknown_book"
    end

    return hash_string_to_hex(id_source)
end

--------------------------------------------------------------------------
-- BOOK_SETTINGS helpers: read/save single mapping
--------------------------------------------------------------------------
local function readAllBookSettings()
    return G_reader_settings:readSetting(BOOK_SETTINGS_KEY) or {}
end

local function writeAllBookSettings(tbl)
    G_reader_settings:saveSetting(BOOK_SETTINGS_KEY, tbl)
end

local function getBookSettings(book_id)
    local all = readAllBookSettings()
    return all[book_id] or {}
end

local function saveBookSetting(book_id, key, value)
    local all = readAllBookSettings()
    all[book_id] = all[book_id] or {}
    all[book_id][key] = value
    writeAllBookSettings(all)
end

local function setBookSettings(book_id, settings_table)
    local all = readAllBookSettings()
    all[book_id] = settings_table or {}
    writeAllBookSettings(all)
end

-- read-and-apply defaults
local function onFirstOpening(book_id, ctx)
    local all = readAllBookSettings()
    if all[book_id] and next(all[book_id]) then
        return -- already have per-book settings
    end

    -- Create candidate settings entirely from defaults
    local candidate = {
        font_size           = CRE_HEADER_DEFAULT_SIZE,
        margin              = DEFAULT_HEADER_MARGIN,
        alternate_page_align = true,
        letter_spacing      = DEFAULT_LETTER_SPACING,
        font_face           = nil,
        hide_title          = false,
        hide_page_number    = false,
        page_bottom_center  = false,
        always_chapter_title = false,
		two_column_mode = false,
    }

    all[book_id] = candidate
    writeAllBookSettings(all)
end

-- Simple UTF-8-aware letter spacing (compact)
-- spacing = integer >= 0 (number of normal spaces inserted between UTF-8 codepoints)
local function utf8_spaced(text, spacing)
    spacing = tonumber(spacing) or 0
    if spacing <= 0 or not text or text == "" then
        return text
    end

    local nbsp = util.unicodeCodepointToUtf8(0x200A)  -- narrow no-break space
    local spacer = string.rep(nbsp, spacing)

    local chars = {}
    for c in text:gmatch("([%z\1-\127\194-\244][\128-\191]*)") do
        chars[#chars + 1] = c
    end

    return table.concat(chars, spacer)
end


--------------------------------------------------------------------------
-- Menu patching: ReaderFooter:addToMainMenu
--------------------------------------------------------------------------
local orig_ReaderFooter_addToMainMenu = ReaderFooter.addToMainMenu
function ReaderFooter:addToMainMenu(menu_items)
    orig_ReaderFooter_addToMainMenu(self, menu_items)

    local statusBar = menu_items.status_bar
    if not statusBar then return end
    statusBar.sub_item_table = statusBar.sub_item_table or {}

    local book_id = getBookMetaKey(self)
	onFirstOpening(book_id, self)
    local book_settings = getBookSettings(book_id)

    local function reload()
        book_settings = getBookSettings(book_id)
    end

    table.insert(statusBar.sub_item_table, {
        text = _("Page header"),
        sub_item_table = {
			-- Two column mode
            {
                text = _("Two column mode"),
                checked_func = function()
                    reload()
                    return book_settings.two_column_mode == true
                end,
                keep_menu_open = true,
                callback = function(touchmenu_instance)
                    reload()
                    book_settings.two_column_mode = not (book_settings.two_column_mode or false)
                    setBookSettings(book_id, book_settings)
                    touchmenu_instance:updateItems()
					self:refreshFooter(true)
                end,
				separator = true,
            },
            -- Hide book/chapter title
            {
                text = _("Hide page title"),
                checked_func = function()
                    reload()
                    return book_settings.hide_title == true
                end,
                keep_menu_open = true,
                callback = function(touchmenu_instance)
                    reload()
                    book_settings.hide_title = not (book_settings.hide_title or false)
                    setBookSettings(book_id, book_settings)
                    touchmenu_instance:updateItems()
					self:refreshFooter(true)
                end,
            },
			-- Hide page number
            {
                text = _("Hide page number"),
                checked_func = function()
                    reload()
                    return book_settings.hide_page_number == true
                end,
                keep_menu_open = true,
                callback = function(touchmenu_instance)
                    reload()
                    book_settings.hide_page_number = not (book_settings.hide_page_number or false)
                    setBookSettings(book_id, book_settings)
                    touchmenu_instance:updateItems()
					self:refreshFooter(true)
                end,
            },
            -- Alternative page position (bottom center)
            {
                text = _("Bottom center page"),
				enabled_func = function()
                    return not (book_settings.two_column_mode or false)
                end,
                checked_func = function()
                    reload()
                    return book_settings.page_bottom_center == true
                end,
                keep_menu_open = true,
                callback = function(touchmenu_instance)
                    reload()
                    book_settings.page_bottom_center = not (book_settings.page_bottom_center or false)
                    setBookSettings(book_id, book_settings)
                    touchmenu_instance:updateItems()
					self:refreshFooter(true)
                end,
            },

            -- Alternative page align
            {
                text = _("Alternate page align"),
				enabled_func = function()
                    return not (book_settings.two_column_mode or false)
                end,
                checked_func = function()
                    reload()
                    return book_settings.alternate_page_align == true
                end,
                keep_menu_open = true,
                callback = function(touchmenu_instance)
                    reload()
                    book_settings.alternate_page_align = not (book_settings.alternate_page_align or false)
                    setBookSettings(book_id, book_settings)
                    touchmenu_instance:updateItems()
					self:refreshFooter(true)
                end,
            },

            -- Always show chapter title (Don't mix titles)
            {
                text = _("Show only chapter title"),
				enabled_func = function()
                    return not (book_settings.two_column_mode or false)
                end,
                checked_func = function()
                    reload()
                    return book_settings.always_chapter_title == true
                end,
                keep_menu_open = true,
                callback = function(touchmenu_instance)
                    reload()
                    book_settings.always_chapter_title = not (book_settings.always_chapter_title or false)
                    setBookSettings(book_id, book_settings)
                    touchmenu_instance:updateItems()
					self:refreshFooter(true)
                end,
				separator = true,
            },
            -- Font size (per-book)
            {
                text_func = function()
				reload()
				local size = book_settings.font_size
				if size == nil then size = CRE_HEADER_DEFAULT_SIZE end
				return T(_("Font size: %1"), size)
			end,
			callback = function(touchmenu_instance)
				reload()
				local current = book_settings.font_size
				if current == nil then current = CRE_HEADER_DEFAULT_SIZE end

                    local spin_widget = SpinWidget:new{
                        title_text = _("Font size"),
                        value = current,
						default_value = CRE_HEADER_DEFAULT_SIZE,
                        value_min = 1,
                        value_max = 48,
                        value_step = 1,
						value_hold_step = 5,
                        keep_shown_on_apply = true,
                        callback = function(spin)
                            if spin.value then
                                book_settings.font_size = spin.value
                                setBookSettings(book_id, book_settings)
                                if self.document and self.document.setFontBaseSize then
                                    self.document:setFontBaseSize(spin.value)
                                end
                                touchmenu_instance:updateItems()
								self:refreshFooter(true)
                            end
                        end,
                    }
                    UIManager:show(spin_widget)
                end,
            },
            -- Margin (per-book) spinner
            {
                text_func = function()
				reload()
				local margin = book_settings.margin
				if margin == nil then margin = DEFAULT_HEADER_MARGIN end
				return T(_("Padding: %1"), margin)
			end,
			callback = function(touchmenu_instance)
				reload()
				local current = book_settings.margin
				if current == nil then current = DEFAULT_HEADER_MARGIN end

                    local spin_widget = SpinWidget:new{
                        title_text = _("Top/Bottom margin"),
                        value = current,
						default_value = DEFAULT_HEADER_MARGIN,
                        value_min = 0,
                        value_max = 5000,
                        value_step = 1,
						value_hold_step = 5,
                        keep_shown_on_apply = true,
                        callback = function(spin)
                            if spin.value then
                                book_settings.margin = spin.value
                                setBookSettings(book_id, book_settings)
                                if self.document and self.document.setPageMargins then
                                    local m = spin.value
                                    self.document:setPageMargins(m, m, m, m)
                                end
                                touchmenu_instance:updateItems()
								self:refreshFooter(true)
                            end
                        end,
                    }
                    UIManager:show(spin_widget)
                end,
            },
			-- Letter spacing for header title (per-book)
            {
                text_func = function()
                    reload()
                    local spacing = book_settings.letter_spacing or 0
                    return T(_("Letter spacing: %1"), spacing)
                end,
                callback = function(touchmenu_instance)
                    reload()
                    local current = book_settings.letter_spacing
					if current == nil then current = DEFAULT_LETTER_SPACING end
                    local spin_widget = SpinWidget:new{
                        title_text = _("Letter Spacing"),
                        value = current,
						default_value = DEFAULT_LETTER_SPACING,
                        value_min = 0,
                        value_max = 100,   
                        value_step = 1,
						value_hold_step = 5,
                        keep_shown_on_apply = true,
                        callback = function(spin)
                            if spin.value ~= nil then
                                book_settings.letter_spacing = spin.value
                                setBookSettings(book_id, book_settings)
                                -- repaint to apply immediately
                                touchmenu_instance:updateItems()
								self:refreshFooter(true)
                            end
                        end,
                    }
                    UIManager:show(spin_widget)
                end,
            },
            -- Font for this book
            {
                text_func = function()
                    reload()
                    local path = book_settings.font_face or nil
                    local font_name
                    if path then
                        for _, name in ipairs(cre.getFontFaces()) do
                            if cre.getFontFaceFilenameAndFaceIndex(name) == path then
                                font_name = name
                                break
                            end
                        end
                    end
                    font_name = font_name or _("Default (Noto Sans)")
                    return T(_("Font for this book: %1"), font_name)
                end,
                keep_menu_open = true,
                sub_item_table_func = function()
                    local items = {}
                    reload()
                    for _, name in ipairs(cre.getFontFaces()) do
                        local path = cre.getFontFaceFilenameAndFaceIndex(name)
                        if path then
                            table.insert(items, {
                                text = name,
                                enabled_func = function()
                                    reload()
                                    return book_settings.font_face ~= path
                                end,
                                font_func = function(size)
                                    return Font:getFace(path, size)
                                end,
                                callback = function()
                                    reload()
                                    book_settings.font_face = path
                                    setBookSettings(book_id, book_settings)

                                    -- Apply immediately, respecting stored font_size
                                    local size = book_settings.font_size or CRE_HEADER_DEFAULT_SIZE
                                    local face = Font:getFace(path, size)
                                    if face and self.document and self.document.setFont then
                                        self.document:setFont(face)
                                    end
									UIManager:_repaint()
                                    if touchmenu_instance then touchmenu_instance:updateItems() end
                                end,
                            })
                        end
                    end

                    -- Reset to default (clear per-book font_face)
                    table.insert(items, {
                        text = _("Reset book font to default"),
                        enabled_func = function()
                            reload()
                            return book_settings.font_face ~= nil
                        end,
                        callback = function()
                            reload()
                            book_settings.font_face = nil
                            setBookSettings(book_id, book_settings)

                            -- Reapply fallback font (if any)
                            local size = book_settings.font_size or CRE_HEADER_DEFAULT_SIZE
                            local fallback_path = DEFAULT_HEADER_FACE
                            local face = Font:getFace(fallback_path, size)
                            if face and self.document and self.document.setFont then
                                self.document:setFont(face)
                            end
							touchmenu_instance:updateItems()
							self:refreshFooter(true)
                        end,
                    })

                    return items
                end,
				separator = true,
            },
			-- Reset all per-book settings
				{
					text = _("Reset book settings"),
					enabled_func = function()
						reload()
						return next(book_settings) ~= nil
					end,
					keep_menu_open = true,
					callback = function(touchmenu_instance)
						reload()

						-- Reset per-book settings to defaults
						book_settings = {
							alternate_page_align = true,
							font_size           = CRE_HEADER_DEFAULT_SIZE,
							margin              = DEFAULT_HEADER_MARGIN,
							letter_spacing      = DEFAULT_LETTER_SPACING,
							font_face           = nil,
						}
						setBookSettings(book_id, book_settings)

						-- Apply the defaults to the document
						local fallback_face = Font:getFace(book_settings.font_face or DEFAULT_HEADER_FACE, book_settings.font_size)
						if fallback_face and self.document and self.document.setFont then
							self.document:setFont(fallback_face)
						end
						if self.document and self.document.setFontBaseSize then
							self.document:setFontBaseSize(book_settings.font_size)
						end
						if self.document and self.document.setPageMargins then
							local m = book_settings.margin
							self.document:setPageMargins(m, m, m, m)
						end

						UIManager:_repaint()
						if touchmenu_instance then touchmenu_instance:updateItems() end
					end,
				},

        },
    })
end

--------------------------------------------------------------------------
-- render header
--------------------------------------------------------------------------

local _ReaderView_paintTo_orig = ReaderView.paintTo
ReaderView.paintTo = function(self, bb, x, y)
    _ReaderView_paintTo_orig(self, bb, x, y)
    if self.render_mode ~= nil then return end

    -- page / doc info
    local pageno = self.state.page or 1
    local pages  = (self.ui.doc_settings and self.ui.doc_settings.data and self.ui.doc_settings.data.doc_pages) or 1
    local book_chapter = (self.ui.toc and self.ui.toc.getTocTitleByPage) and self.ui.toc:getTocTitleByPage(pageno) or ""
    local pages_done   = (self.ui.toc and (self.ui.toc.getChapterPagesDone and (self.ui.toc:getChapterPagesDone(pageno) or 0))) or 0
    pages_done = pages_done + 1
	
    -- Determine book id and its settings
    local book_id = getBookMetaKey(self)
    local book_settings = getBookSettings(book_id)

    -- Font face selection: prefer per-book, else fallback to default
    local header_font_face = book_settings.font_face or DEFAULT_HEADER_FACE

    -- Font size & margin (per-book or fallback)
    local header_font_size = book_settings.font_size or CRE_HEADER_DEFAULT_SIZE
    local header_margin = book_settings.margin or DEFAULT_HEADER_MARGIN

    local header_font_bold   = false
    local header_font_color  = Blitbuffer.COLOR_BLACK

    local screen_width = Screen:getWidth()
    local book_title = (self.ui and self.ui.doc_props and self.ui.doc_props.display_title) or ""

    -- Per-book show/hide flags
    local hide_title = book_settings.hide_title
    local hide_page  = book_settings.hide_page_number
    local page_bottom = book_settings.page_bottom_center
    local alternate_page_align = book_settings.alternate_page_align
	local two_column_mode = book_settings.two_column_mode

    -- Determine if first page of chapter
    local first_page_of_chapter = false
    if self.ui and self.ui.toc and self.ui.toc.getChapterPagesDone then
        first_page_of_chapter = (self.ui.toc:getChapterPagesDone(pageno) or 0) == 0
    end
	
	-- Absolute first pages (numeric) or reference page "i", "ii", etc.
	local cover_page = false
	if pageno == 1 or pageno == 2 then
		cover_page = true
	end

    -- Decide what to show for the header text (only if not hiding and not first page of chapter)
    local centered_header = ""
    if not hide_title and not first_page_of_chapter then
        local always_chapter = book_settings.always_chapter_title
        if always_chapter then
            centered_header = book_chapter
        else
            if pageno % 2 == 1 then
                centered_header = (book_title ~= "" and book_title) or book_chapter
            else
                centered_header = (book_chapter ~= "" and book_chapter) or book_title
            end
        end
    end

    -- Apply letter spacing to centered_header only (page number left untouched)
	local letter_spacing = tonumber(book_settings.letter_spacing) or DEFAULT_LETTER_SPACING
	local header_for_fitting = centered_header
	if header_for_fitting ~= "" and letter_spacing > 0 then
		header_for_fitting = utf8_spaced(header_for_fitting, letter_spacing)
	end
	local spaced_book_title = book_title
	if spaced_book_title ~= "" and letter_spacing > 0 then
		spaced_book_title = utf8_spaced(spaced_book_title, letter_spacing)
	end

	local spaced_book_chapter = book_chapter
	if spaced_book_chapter ~= "" and letter_spacing > 0 then
		spaced_book_chapter = utf8_spaced(spaced_book_chapter, letter_spacing)
	end
    -- Fit text (respect page margins)
    local page_margins = (self.document and self.document.getPageMargins) and self.document:getPageMargins() or {}
    local left_margin  = page_margins.left or header_margin
    local right_margin = page_margins.right or header_margin
    local avail_width  = screen_width - (left_margin + right_margin)

	local function getFittedText(text, max_width_px)
    if not text or text == "" then
        return ""
    end

    local clean_text = text:gsub(" ", "\u{0020}")
    local text_widget = TextWidget:new{
        text      = clean_text,
        max_width = max_width_px,
        face      = Font:getFace(header_font_face, header_font_size),
        bold      = header_font_bold,
        padding   = 0,
    }

    local fitted_text, add_ellipsis = text_widget:getFittedText()
    text_widget:free()
    if add_ellipsis then
        fitted_text = fitted_text .. "…"
    end

    return fitted_text
end
		-- column width and positions
    local col_width = math.floor(avail_width / 2)
    local left_start  = left_margin
    local right_start = left_margin + col_width
	
	local fitted_centered = getFittedText(header_for_fitting, avail_width * 0.9)
	local left_fitted  = getFittedText(book_title, col_width)
	local right_fitted = getFittedText(book_chapter, col_width)

    -- Decide what to show for the page indicator (string). Prefer reference labels when enabled.
    local display_page_text = nil

    -- Check per-document setting first
    local use_ref = nil
    if self.ui and self.ui.doc_settings and self.ui.doc_settings.readSetting then
        use_ref = self.ui.doc_settings:readSetting("pagemap_use_page_labels")
    end
    if use_ref == nil then
        use_ref = G_reader_settings:isTrue("pagemap_use_page_labels")
    end

    if use_ref and self.ui and self.ui.document and self.ui.document.getPageMapCurrentPageLabel then
        local label = self.ui.document:getPageMapCurrentPageLabel()
        if type(label) == "string" and label ~= "" then
            display_page_text = label
        elseif type(label) == "table" and label[1] and label[1] ~= "" then
            display_page_text = label[1]
        end
    end

    if not display_page_text then
        display_page_text = tostring(pageno)
    end
	
	-- Also check reference labels
	if display_page_text then
		-- normalize to lowercase string
		local ref = tostring(display_page_text):lower()
		if ref == "1" then
			cover_page = true
		end
	end
	
    -- Page text widget (only create if we will draw it) -- page number unaffected by letter spacing
    if not hide_page and not two_column_mode and not cover_page then
        local page_text = TextWidget:new{
            text    = display_page_text,
            face    = Font:getFace(header_font_face, header_font_size),
            bold    = header_font_bold,
            fgcolor = header_font_color,
            padding = 0,
        }

	
        if page_bottom or first_page_of_chapter then
			-- bottom centered
			local bottom_y = Screen:getHeight() - header_margin - page_text:getSize().h
			local bottom_x = (screen_width - page_text:getSize().w) / 2
			page_text:paintTo(bb, bottom_x, bottom_y)
		else
			if not alternate_page_align then
				-- classic: always top right
				local page_x = screen_width - right_margin - page_text:getSize().w
				page_text:paintTo(bb, page_x, header_margin)
			else
				-- default: alternate align
				local show_book = (pageno % 2 == 1 and book_title ~= "") or (pageno % 2 == 0 and book_chapter == "")
				local page_x = show_book and left_margin or (screen_width - right_margin - page_text:getSize().w)
				page_text:paintTo(bb, page_x, header_margin)
			end
		end

        page_text:free()
    end
	
	if two_column_mode then
    -- Left column
	if not first_page_of_chapter then
		if not hide_page then
			-- Page number flush left
			local left_page = TextWidget:new{
				text = display_page_text,
				face = Font:getFace(header_font_face, header_font_size),
				bold = header_font_bold,
				fgcolor = header_font_color,
			}
			left_page:paintTo(bb, left_start, header_margin)
			left_page:free()
		end
		if not hide_title and book_title ~= "" then
			-- Centered title inside left column
			local left_max_width = col_width * 0.85
			local left_fitted = getFittedText(spaced_book_title, left_max_width)
			local left_text = TextWidget:new{
				text = left_fitted,
				face = Font:getFace(header_font_face, header_font_size),
				bold = header_font_bold,
				fgcolor = header_font_color,
			}
			local text_w = left_text:getSize().w
			local text_x = left_start + math.max((col_width - text_w) / 2, 0)
			left_text:paintTo(bb, text_x, header_margin)
			left_text:free()
		end
	end
    -- Right column
    if not first_page_of_chapter then
		if not hide_page then
			-- Page number flush right
			local right_page = TextWidget:new{
				text = tostring(display_page_text + 1),
				face = Font:getFace(header_font_face, header_font_size),
				bold = header_font_bold,
				fgcolor = header_font_color,
			}
			local page_w = right_page:getSize().w
			local page_x = right_start + col_width - page_w
			right_page:paintTo(bb, page_x, header_margin)
			right_page:free()
		end
		if not hide_title and book_chapter ~= "" then
			-- Centered title inside right column
			local right_max_width = col_width * 0.85
			local right_fitted = getFittedText(spaced_book_chapter, right_max_width)
			local right_text = TextWidget:new{
				text = right_fitted,
				face = Font:getFace(header_font_face, header_font_size),
				bold = header_font_bold,
				fgcolor = header_font_color,
			}
			local text_w = right_text:getSize().w
			local text_x = right_start + math.max((col_width - text_w) / 2, 0)
			right_text:paintTo(bb, text_x, header_margin)
			right_text:free()
		end
	end
else
    -- One column mode (unchanged, uses fitted_centered)
    if fitted_centered ~= "" then
        local header_text = TextWidget:new{
            text    = fitted_centered,
            face    = Font:getFace(header_font_face, header_font_size),
            bold    = header_font_bold,
            fgcolor = header_font_color,
            padding = 0,
        }

        local header_w = header_text:getSize().w
        local header_x = left_margin + math.max((avail_width - header_w) / 2, 0)
        header_text:paintTo(bb, header_x, header_margin)
        header_text:free()
    end
end

end

--------------------------------------------------------------------------
-- Apply per-book settings when opening a book
--------------------------------------------------------------------------
local orig_ReaderUI_doShowReader = ReaderUI.doShowReader
function ReaderUI:doShowReader(...)
    local res = { orig_ReaderUI_doShowReader(self, ...) }

    if self and self.document then
        local book_id = getBookMetaKey(self)
        onFirstOpening(book_id, self)

        -- load settings
        local book_settings = getBookSettings(book_id) or {}

        -- normalize/persist font size (per-book -> default)
        local header_font_size = tonumber(book_settings.font_size) or CRE_HEADER_DEFAULT_SIZE
        book_settings.font_size = header_font_size

        -- normalize/persist margin
        local header_margin = tonumber(book_settings.margin) or DEFAULT_HEADER_MARGIN
        book_settings.margin = header_margin

        -- alternate page align (ensure boolean)
        if book_settings.alternate_page_align == nil then
            book_settings.alternate_page_align = true
        else
            book_settings.alternate_page_align = (book_settings.alternate_page_align == true)
        end
        local alternate_page_align = book_settings.alternate_page_align

        -- letter spacing: normalize, clamp, persist
        local ls = tonumber(book_settings.letter_spacing)
        if ls == nil then
            ls = DEFAULT_LETTER_SPACING
        end

        -- save any normalizations we did
        setBookSettings(book_id, book_settings)

        -- apply font size
        if self.document.setFontBaseSize then
            self.document:setFontBaseSize(header_font_size)
        end

        -- apply margins
        if self.document.setPageMargins then
            self.document:setPageMargins(header_margin, header_margin, header_margin, header_margin)
        end

		-- apply font face safely
		local path = book_settings.font_face
		local face
		if path then
			face = Font:getFace(path, header_font_size)
		end
		if not face then
			-- fallback to default if missing or invalid
			local fallback_path = DEFAULT_HEADER_FACE
			face = Font:getFace(fallback_path, header_font_size)
			book_settings.font_face = nil 
			setBookSettings(book_id, book_settings)
		end

		if face and self.document.setFont then
			self.document:setFont(face)
		end

    end

    UIManager:_repaint()
    return table.unpack(res)
end


-- Optional exports (helpers)
return {
    getBookMetaKey = getBookMetaKey,
    getBookSettings = getBookSettings,
    setBookSettings = setBookSettings,
    saveBookSetting = saveBookSetting,
}
