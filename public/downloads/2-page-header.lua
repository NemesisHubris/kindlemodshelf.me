-- page header v1.3

local _ = require("gettext")
local T = require("ffi/util").template
local UIManager = require("ui/uimanager")
local ReaderFooter = require("apps/reader/modules/readerfooter")
local ReaderView = require("apps/reader/modules/readerview")
local ReaderUI = require("apps/reader/readerui")
local Font = require("ui/font")
local BD = require("ui/bidi")
local Size = require("ui/size")
local Screen = require("device").screen
local Blitbuffer = require("ffi/blitbuffer")
local TextWidget = require("ui/widget/textwidget")
local SpinWidget = require("ui/widget/spinwidget")
local DoubleSpinWidget = require("ui/widget/doublespinwidget")
local InfoMessage = require("ui/widget/infomessage")
local ConfirmBox = require("ui/widget/confirmbox")
local MultiConfirmBox = require("ui/widget/multiconfirmbox")
local util = require("util")
local cre = require("document/credocument"):engineInit()

-- Settings keys
local BOOK_SETTINGS_KEY = "BOOK_SETTINGS"
local HEADER_FONT_SIZE = "header_font_size"

-- Defaults
local DEFAULT_HEADER_FACE = "NotoSans-Regular.ttf"
local CRE_HEADER_DEFAULT_SIZE = 23
local DEFAULT_LETTER_SPACING = 0
local DEFAULT_TOP_HEADER_MARGIN = 0
local DEFAULT_BOTTOM_HEADER_MARGIN = 0

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
-- final fallback to 'unknown_book'. Hash the identifier for compact keys.
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
        return
    end

    -- Create candidate settings entirely from defaults
	
    if not G_reader_settings:has("default_top_header_margin") then
        G_reader_settings:saveSetting("default_top_header_margin", DEFAULT_TOP_HEADER_MARGIN)
    end
    if not G_reader_settings:has("default_bottom_header_margin") then
        G_reader_settings:saveSetting("default_bottom_header_margin", DEFAULT_BOTTOM_HEADER_MARGIN)
    end
    if not G_reader_settings:has("default_letter_spacing") then
        G_reader_settings:saveSetting("default_letter_spacing", DEFAULT_LETTER_SPACING)
    end
    if not G_reader_settings:has("default_font_face") then
        G_reader_settings:saveSetting("default_font_face", DEFAULT_HEADER_FACE)
    end
    if not G_reader_settings:has("default_font_size") then
        G_reader_settings:saveSetting("default_font_size", CRE_HEADER_DEFAULT_SIZE)
    end
    if not G_reader_settings:has("default_alternate_page_align") then
        G_reader_settings:makeTrue("default_alternate_page_align")
		G_reader_settings:flush()
    end
    if not G_reader_settings:has("default_hide_page_number") then
        G_reader_settings:makeFalse("default_hide_page_number")
    end
    if not G_reader_settings:has("default_hide_title") then
        G_reader_settings:makeFalse("default_hide_title")
    end
    if not G_reader_settings:has("default_two_column") then
        G_reader_settings:makeFalse("default_two_column")
    end
    if not G_reader_settings:has("default_page_bottom_center") then
        G_reader_settings:makeFalse("default_page_bottom_center")
    end
    if not G_reader_settings:has("default_always_chapter_title") then
        G_reader_settings:makeFalse("default_always_chapter_title")
    end

    local candidate = {
        font_size            = G_reader_settings:readSetting("default_font_size") or CRE_HEADER_DEFAULT_SIZE,
        top_header_margin    = G_reader_settings:readSetting("default_top_header_margin") or DEFAULT_TOP_HEADER_MARGIN,
        bottom_header_margin = G_reader_settings:readSetting("default_bottom_header_margin") or DEFAULT_BOTTOM_HEADER_MARGIN,
        letter_spacing       = G_reader_settings:readSetting("default_letter_spacing") or DEFAULT_LETTER_SPACING,
        font_face            = G_reader_settings:readSetting("default_font_face") or nil,
        hide_title           = G_reader_settings:isTrue("default_hide_title"),
        hide_page_number     = G_reader_settings:isTrue("default_hide_page_number"),
        page_bottom_center   = G_reader_settings:isTrue("default_page_bottom_center"),
        alternate_page_align = G_reader_settings:isTrue("default_alternate_page_align"),
        always_chapter_title = G_reader_settings:isTrue("default_always_chapter_title"),
        two_column_mode      = G_reader_settings:isTrue("default_two_column"),
    }

    all[book_id] = candidate
    writeAllBookSettings(all)
end

-- UTF-8 letter spacing
-- spacing = integer >= 0 (number of normal spaces inserted between UTF-8 codepoints)
local function utf8_spaced(text, spacing)
    spacing = tonumber(spacing) or 0
    if spacing <= 0 or not text or text == "" then
        return text
    end

    local nbsp = util.unicodeCodepointToUtf8(0x200A)  -- unicode hair space glyph
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
local about_text = _([[
	 (\ 
	 \'\ 
	  \'\     __________  
	  / '|   ()_________)
	  \ '/    \ ~~~~~~~~ \
	    \       \ ~~~~~~   \
	    ==).      \__________\
	   (__)       ()__________)
			  
Reading the way grandma intended.

  Page header can be displayed in reflowable documents (epub etc.), many of its features are customizable. Default settings can be set from the menu - simply longpress the checkmark and font option, and tap a button inside a numeric option.

  Page number display respects native "Use reference page numbers" setting. It will center at the bottom on the first page of chapter, except on the cover page where it's hidden along with the title.
You may need to adjust your book margins if your text is very close to the screen edge, as the header at 0 margins will render a line above/below the text. For the best view in two column mode, keep the left and right book margins in sync.

  Letter spacing works by inserting a Unicode space (U+200A hair space) between each character and does not effect page number. If no visible change appears, the glyph is missing in the font or its width is too small. You may check the font by using FontForge.
  
  Important: if you rename/move/delete the font you're using for any of your books, you will recieve an error on opening the book. Simply change the font before proceeding with anything aforementioned. You can replace the font for multiple books with a text editor, by going to the koreader root directory and opening settings.reader.lua. Under "BOOK SETTINGS" you will find hash blocks, each block representing saved settings for one book. Now you can mass replace any instance of a font.
  
  Using a smallcaps font is highly recommended. A tutorial is available for making a SC font with FontForge. It's a semi-automated process that should take just a few minutes.
https://pastebin.com/Rm8PrbEk
]])
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
					self:refreshFooter(true)
                    touchmenu_instance:updateItems()
                end,
				hold_callback = function()
					local default_two_column_mode = G_reader_settings:isTrue("default_two_column")
					UIManager:show(MultiConfirmBox:new{
						text = default_two_column_mode and
							_("Would you like to enable or disable two column mode by default?\n\nThe current default (★) is enabled.")
							or _("Would you like to enable or disable two column mode by default?\n\nThe current default (★) is disabled."),
						choice1_text_func = function()
							return default_two_column_mode and _("Enable (★)") or _("Enable")
						end,
						choice1_callback = function()
							G_reader_settings:makeTrue("default_two_column")
						end,
						choice2_text_func = function()
							return default_two_column_mode and _("Disable") or _("Disable (★)")
						end,
						choice2_callback = function()
							G_reader_settings:makeFalse("default_two_column")
						end,
					})
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
					self:refreshFooter(true)
                    touchmenu_instance:updateItems()
                end,
				hold_callback = function()
					local default_hide_page_title = G_reader_settings:isTrue("default_hide_title")
					UIManager:show(MultiConfirmBox:new{
						text = default_hide_page_title and
							_("Would you like to show or hide the title by default?\n\nThe current default (★) is hidden.")
							or _("Would you like to show or hide the title by default?\n\nThe current default (★) is shown."),
						choice1_text_func = function()
							return default_hide_page_title and _("Show") or _("Show (★)")
						end,
						choice1_callback = function()
							G_reader_settings:makeFalse("default_hide_title")
						end,
						choice2_text_func = function()
							return default_hide_page_title and _("Hide (★)") or _("Hide")
						end,
						choice2_callback = function()
							G_reader_settings:makeTrue("default_hide_title")
						end,
					})
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
					self:refreshFooter(true)
                    touchmenu_instance:updateItems()
                end,
				hold_callback = function()
					local default_hide_page = G_reader_settings:isTrue("default_hide_page_number")
					UIManager:show(MultiConfirmBox:new{
						text = default_hide_page and
							_("Would you like to show or hide page number by default?\n\nThe current default (★) is hidden.")
							or _("Would you like to show or hide page number by default?\n\nThe current default (★) is shown."),
						choice1_text_func = function()
							return default_hide_page and _("Show") or _("Show (★)")
						end,
						choice1_callback = function()
							G_reader_settings:makeFalse("default_hide_page_number")
						end,
						choice2_text_func = function()
							return default_hide_page and _("Hide (★)") or _("Hide")
						end,
						choice2_callback = function()
							G_reader_settings:makeTrue("default_hide_page_number")
						end,
					})
				end,
            },
            -- Alternative page position (bottom center)
            {
                text = _("Bottom center page"),
				enabled_func = function()
                    return not (book_settings.two_column_mode or false)
					and not (book_settings.hide_page_number or false)
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
					self:refreshFooter(true)
                    touchmenu_instance:updateItems()
                end,
				hold_callback = function()
					local default_page_bottom = G_reader_settings:isTrue("default_page_bottom_center")
					UIManager:show(MultiConfirmBox:new{
						text = default_page_bottom and
							_("Would you like to display the page number at the bottom by default?\n\nThe current default (★) is enabled.")
							or _("Would you like to display the page number at the bottom by default?\n\nThe current default (★) is disabled."),
						choice1_text_func = function()
							return default_page_bottom and _("Enable (★)") or _("Enable")
						end,
						choice1_callback = function()
							G_reader_settings:makeFalse("default_page_bottom_center")
						end,
						choice2_text_func = function()
							return default_page_bottom and _("Disable") or _("Disable (★)")
						end,
						choice2_callback = function()
							G_reader_settings:makeTrue("default_page_bottom_center")
						end,
					})
				end,
            },

            -- Alternate page align
            {
                text = _("Alternate pages"),
				enabled_func = function()
                    return not (book_settings.two_column_mode or false)
					and not (book_settings.page_bottom_center or false)
					and not (book_settings.hide_page_number or false)
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
					self:refreshFooter(true)
                    touchmenu_instance:updateItems()
                end,
				hold_callback = function()
					G_reader_settings:flush()
					local default_alternate_page = G_reader_settings:isTrue("default_alternate_page_align")
					UIManager:show(MultiConfirmBox:new{
						text = default_alternate_page and
							_("Would you like to alternate pages by default?\n\nThe current default (★) is enabled.")
							or _("Would you like to alternate pages by default?\n\nThe current default (★) is disabled."),
						choice1_text_func = function()
							return default_alternate_page and _("Enable (★)") or _("Enable")
						end,
						choice1_callback = function()
							G_reader_settings:makeTrue("default_alternate_page_align")
						end,
						choice2_text_func = function()
							return default_alternate_page and _("Disable") or _("Disable (★)")
						end,
						choice2_callback = function()
							G_reader_settings:makeFalse("default_alternate_page_align")
						end,
					})
				end,
            },
            -- Always show chapter title
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
					self:refreshFooter(true)
                    touchmenu_instance:updateItems()
                end,
				hold_callback = function()
					local default_always_chapter = G_reader_settings:isTrue("default_always_chapter_title")
					UIManager:show(MultiConfirmBox:new{
						text = default_always_chapter and
							_("Would you like to display only chapter title by default?\n\nThe current default (★) is enabled.")
							or _("Would you like to display only chapter title by default?\n\nThe current default (★) is disabled."),
						choice1_text_func = function()
							return default_always_chapter and _("Enable (★)") or _("Enable")
						end,
						choice1_callback = function()
							G_reader_settings:makeTrue("default_always_chapter_title")
						end,
						choice2_text_func = function()
							return default_always_chapter and _("Disable") or _("Disable (★)")
						end,
						choice2_callback = function()
							G_reader_settings:makeFalse("default_always_chapter_title")
						end,
					})
				end,
				separator = true,
            },
            -- Font size
            {
                text_func = function()
				reload()
				local size = (book_settings.font_size and book_settings.font_size > 0) and book_settings.font_size or CRE_HEADER_DEFAULT_SIZE
				return T(_("Font size: %1"), size)
			end,
			callback = function(touchmenu_instance)
				reload()
					local current_font_size = (book_settings.font_size and book_settings.font_size > 0 and book_settings.font_size)
                          or G_reader_settings:readSetting("default_font_size")
                          or CRE_HEADER_DEFAULT_SIZE
					local default_size = G_reader_settings:readSetting("default_font_size") or CRE_HEADER_DEFAULT_SIZE
                    local spin_widget 
					spin_widget = SpinWidget:new{
                        title_text = _("Font Size"),
                        value = current_font_size,
						default_value = default_size,
                        value_min = 1,
                        value_max = 96,
                        value_step = 1,
						value_hold_step = 5,
                        keep_shown_on_apply = true,
                        callback = function(fontsize)
                            if fontsize.value then
                                book_settings.font_size = fontsize.value
                                setBookSettings(book_id, book_settings)
                                if self.document and self.document.setFontBaseSize then
                                    self.document:setFontBaseSize(fontsize.value)
                                end
								self:refreshFooter(true)
								touchmenu_instance:updateItems()
                            end
                        end,
						extra_text = _("Set as default"),
						extra_callback = function(fontsize)
							G_reader_settings:saveSetting("default_font_size", fontsize.value)
							self:refreshFooter(true)
                            touchmenu_instance:updateItems()
							spin_widget.default_value  = fontsize.value
							spin_widget:update()
						end,
                    }
                    UIManager:show(spin_widget)
                end,
            },
            -- Margin
            {
                text_func = function()
				reload()
				local top_m = book_settings.top_header_margin or DEFAULT_TOP_HEADER_MARGIN
				local bottom_m = book_settings.bottom_header_margin or DEFAULT_BOTTOM_HEADER_MARGIN
				return T(_("Margins: %1 / %2"), top_m, bottom_m)
			end,
		--	help_text = _("test."),
			callback = function(touchmenu_instance)
				reload()
				local current_top = book_settings.top_header_margin or DEFAULT_TOP_HEADER_MARGIN
				local current_bottom = book_settings.bottom_header_margin or DEFAULT_BOTTOM_HEADER_MARGIN
				local default_top = G_reader_settings:readSetting("default_top_header_margin") or DEFAULT_TOP_HEADER_MARGIN
				local default_bottom = G_reader_settings:readSetting("default_bottom_header_margin") or DEFAULT_BOTTOM_HEADER_MARGIN
                    local margin_widget 
					margin_widget = DoubleSpinWidget:new{
                        title_text = _("Top/Bottom Margin"),
                        left_value = current_top,
						left_min = -5000,
						left_max = 5000,
						left_step = 1,
						left_hold_step = 5,
						left_text = _("Top"),
						right_value = current_bottom,
						right_min = -5000,
						right_max = 5000,
						right_step = 1,
						right_hold_step = 5,
						right_text = _("Bottom"),
						left_default = default_top,
						right_default = default_bottom,
						default_text = T(_("Default values: %1 / %2"), default_top, default_bottom),
						width_factor = 0.6,
						info_text = _([[
Negative values reduce the gap.]]),
                        keep_shown_on_apply = true,
                        callback = function(top_val, bottom_val)
							book_settings.top_header_margin = top_val
							book_settings.bottom_header_margin = bottom_val
							setBookSettings(book_id, book_settings)

							if self.document and self.document.setPageMargins then
								local page_margins = (self.document and self.document.getPageMargins) and self.document:getPageMargins() or {}
								local left  = page_margins.left or top_val
								local right = page_margins.right or top_val
								self.document:setPageMargins(left, top_val, right, bottom_val)
							end
								self:refreshFooter(true)
								touchmenu_instance:updateItems()
						end,
						extra_text = _("Set as default"),
						extra_callback = function(top_val, bottom_val)
							G_reader_settings:saveSetting("default_top_header_margin", top_val)
							G_reader_settings:saveSetting("default_bottom_header_margin", bottom_val)
							self:refreshFooter(true)
                            touchmenu_instance:updateItems()
							margin_widget.left_default  = top_val
							margin_widget.right_default = bottom_val
							margin_widget.default_text  = T(_("Default values: %1 / %2"), top_val, bottom_val)
							margin_widget:update()
						end,
					}
                    UIManager:show(margin_widget)
                end,
            },
			-- Letter spacing for header title
            {
                text_func = function()
                    reload()
                    local spacing = book_settings.letter_spacing or DEFAULT_LETTER_SPACING
                    return T(_("Letter spacing: %1"), spacing)
                end,
                callback = function(touchmenu_instance)
                    reload()
					local current_spacing = book_settings.letter_spacing or DEFAULT_LETTER_SPACING
					local default_spacing = G_reader_settings:readSetting("default_letter_spacing") or DEFAULT_LETTER_SPACING
                    local spin_widget 
					spin_widget = SpinWidget:new{
                        title_text = _("Letter Spacing"),
                        value = current_spacing,
						default_value = default_spacing,
                        value_min = 0,
                        value_max = 100,   
                        value_step = 1,
						value_hold_step = 5,
                        keep_shown_on_apply = true,
                        callback = function(letterspacing)
                            if letterspacing.value ~= nil then
                                book_settings.letter_spacing = letterspacing.value
                                setBookSettings(book_id, book_settings)
								self:refreshFooter(true)
								touchmenu_instance:updateItems()
                            end
                        end,
						extra_text = _("Set as default"),
						extra_callback = function(letterspacing)
							G_reader_settings:saveSetting("default_letter_spacing", letterspacing.value)
							self:refreshFooter(true)
                            touchmenu_instance:updateItems()
							spin_widget.default_value  = letterspacing.value
							spin_widget:update()
						end,
                    }
                    UIManager:show(spin_widget)
                end,
            },
            -- Font face
            {
				text_func = function()
					reload()
					local path = book_settings.font_face
					local default_font_path = G_reader_settings:readSetting("default_font_face")
					local font_name = nil
					if path then
						for i, name in ipairs(cre.getFontFaces()) do
							if cre.getFontFaceFilenameAndFaceIndex(name) == path then
								font_name = name
								break
							end
						end
					end
					if not path then
						if default_font_path then
							for i, name in ipairs(cre.getFontFaces()) do
								if cre.getFontFaceFilenameAndFaceIndex(name) == default_font_path then
									font_name = T(_("Default unset (Noto Sans)"), name)
									break
								end
							end
						end
						font_name = font_name or _("Default (Noto Sans)")
					elseif default_font_path and path == default_font_path then
						font_name = T(_("Default (%1)"), font_name or _("Noto Sans"))
					end
					font_name = font_name or _("Noto Sans")

					return T(_("Font: %1"), font_name)
				end,

				keep_menu_open = true,
				sub_item_table_func = function()
					local items = {}
					reload()
					local default_font_path = G_reader_settings:readSetting("default_font_face")

					for i, name in ipairs(cre.getFontFaces()) do
						local path = cre.getFontFaceFilenameAndFaceIndex(name)
						if path then
							local display_name = name
							if default_font_path and path == default_font_path then
								display_name = name .. " ★"
							end
							table.insert(items, {
								text = display_name,
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
					return items
				end,

				hold_callback = function()
					local current_font_path = book_settings.font_face
					local current_font_name = _("Noto Sans")
					if current_font_path then
						for i, name in ipairs(cre.getFontFaces()) do
							if cre.getFontFaceFilenameAndFaceIndex(name) == current_font_path then
								current_font_name = name
								break
							end
						end
					end

					local default_font_path = G_reader_settings:readSetting("default_font_face")
					local default_font_name = _("Noto Sans")
					if default_font_path then
						for i, name in ipairs(cre.getFontFaces()) do
							if cre.getFontFaceFilenameAndFaceIndex(name) == default_font_path then
								default_font_name = name
								break
							end
						end
					end

					if current_font_path == default_font_path then
						UIManager:show(InfoMessage:new{
							text = T(_("Current font (%1) is already the default."), current_font_name),
							timeout = 2,
						})
						return
					end

					UIManager:show(ConfirmBox:new{
						text = T(_("Set current font (%1) as default?\n\nThe current default is %2."),
							current_font_name, default_font_name),
						ok_text = _("Yes"),
						cancel_text = _("Cancel"),
						ok_callback = function()
							if current_font_path then
								G_reader_settings:saveSetting("default_font_face", current_font_path)
								UIManager:show(InfoMessage:new{
									text = T(_("Default font set to: %1"), current_font_name),
									show_delay = 0.5,
									timeout = 2,
								})
								UIManager:_repaint()
							else
								UIManager:show(InfoMessage:new{
									text = _("No font selected to save as default."),
									timeout = 3,
								})
							end
						end,
					})
				end,
				separator = true,
			},
			-- Reset all per-book settings
				{
					text = _("Reset book settings"),
					enabled_func = function()
						return next(book_settings) ~= nil
					end,
					keep_menu_open = true,
					callback = function(touchmenu_instance)
						UIManager:show(ConfirmBox:new{
							text = _("Reset all book settings to defaults?"),
							ok_text = _("Yes"),
							cancel_text = _("Cancel"),
							ok_callback = function()
								book_settings = {
									font_size            = G_reader_settings:readSetting("default_font_size") or CRE_HEADER_DEFAULT_SIZE,
									top_header_margin    = G_reader_settings:readSetting("default_top_header_margin") or DEFAULT_TOP_HEADER_MARGIN,
									bottom_header_margin = G_reader_settings:readSetting("default_bottom_header_margin") or DEFAULT_BOTTOM_HEADER_MARGIN,
									letter_spacing       = G_reader_settings:readSetting("default_letter_spacing") or DEFAULT_LETTER_SPACING,
									font_face            = G_reader_settings:readSetting("default_font_face") or nil,
									alternate_page_align = G_reader_settings:isTrue("default_alternate_page_align"),
									hide_page_number     = G_reader_settings:isTrue("default_hide_page_number"),
									two_column_mode      = G_reader_settings:isTrue("default_two_column"),
									hide_title           = G_reader_settings:isTrue("default_hide_title"),
									page_bottom_center   = G_reader_settings:isTrue("default_page_bottom_center"),
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
									local page_margins = (self.document.getPageMargins and self.document:getPageMargins()) or {}
									local left  = page_margins.left
									local right = page_margins.right
									local top = book_settings.top_header_margin or DEFAULT_TOP_HEADER_MARGIN
									local bottom = book_settings.bottom_header_margin or DEFAULT_BOTTOM_HEADER_MARGIN
									self.document:setPageMargins(left, top, right, bottom)
								end

								UIManager:_repaint()
								if touchmenu_instance then touchmenu_instance:updateItems() end
							end,
						})
					end,
				},
				{
					text = _("About page header"),
					keep_menu_open = true,
					callback = function()
						local rotation = Screen:getRotationMode()
						local info_height
						local info_width
						if rotation == Screen.DEVICE_ROTATED_CLOCKWISE or rotation == Screen.DEVICE_ROTATED_COUNTERCLOCKWISE then
							info_height = Screen:scaleBySize(450)
							info_width = Screen:scaleBySize(500)
						else
							info_height = Screen:scaleBySize(650)
							info_width = Screen:scaleBySize(450)
						end
						UIManager:show(InfoMessage:new{
							height = info_height,
							width = info_width,
							face = Font:getFace("infont", 16),
							monospace_font = true,
							show_icon = false,
							text = about_text,
						})
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
    local top_header_margin = book_settings.top_header_margin or DEFAULT_TOP_HEADER_MARGIN
	local bottom_header_margin = book_settings.bottom_header_margin or DEFAULT_BOTTOM_HEADER_MARGIN
	
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
    local left_margin  = page_margins.left or top_header_margin
    local right_margin = page_margins.right or top_header_margin
	local top_margin    = page_margins.top or top_header_margin
	local bottom_margin = page_margins.bottom or top_header_margin

    local avail_width  = screen_width - (left_margin + right_margin)

	local function getFittedText(text, max_width_px)
    if not text or text == "" then
        return ""
    end

    local clean_text = text:gsub(" ", "\u{00A0}")
    local text_widget = TextWidget:new{
        text      = clean_text,
        max_width = max_width_px,
        face      = Font:getFace(header_font_face, header_font_size),
        padding   = 0,
    }

    local fitted_text, add_ellipsis = text_widget:getFittedText()
    text_widget:free()
    if add_ellipsis then
        fitted_text = fitted_text .. "…"
    end
	return BD.auto(fitted_text)
end
    local col_width = math.floor(avail_width / 2)
    local left_start  = left_margin
    local right_start = left_margin + col_width
	
	local fitted_centered = getFittedText(header_for_fitting, avail_width)
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
            fgcolor = header_font_color,
            padding = 0,
        }
	
		-- bottom centered
        if page_bottom or first_page_of_chapter then
			local bottom_x = (screen_width - page_text:getSize().w) / 2
			local bottom_y = Screen:getHeight() - bottom_margin + bottom_header_margin
			page_text:paintTo(bb, bottom_x, bottom_y)
		else
			-- always top right
			if not alternate_page_align then
				local page_x = screen_width - right_margin - page_text:getSize().w
				local page_y = top_margin - page_text:getSize().h - top_header_margin
				page_text:paintTo(bb, page_x, page_y)
			else
				-- alternate align
				local show_book = (pageno % 2 == 1 and book_title ~= "") or (pageno % 2 == 0 and book_chapter == "")
				local page_x = show_book and left_margin or (screen_width - right_margin - page_text:getSize().w)
				local page_y = top_margin - page_text:getSize().h - top_header_margin
				page_text:paintTo(bb, page_x, page_y)
			end
		end

        page_text:free()
    end
	
	if two_column_mode then
		local avg_margin = (left_margin + right_margin) / 2
		local column_gap = math.max(Screen:scaleBySize(2), avg_margin * 0.5)
		local col_width = math.floor((avail_width - column_gap) / 2)
		local left_start  = left_margin
		local right_start = left_start + col_width + column_gap
		local balance_factor = 0.35
		local visual_center_offset = 0
		-- Left column
		if not first_page_of_chapter then
			if not hide_page then
				local left_page = TextWidget:new{
					text = display_page_text,
					face = Font:getFace(header_font_face, header_font_size),
					fgcolor = header_font_color,
				}
				local pageleft_y = top_margin - left_page:getSize().h - top_header_margin
				left_page:paintTo(bb, left_start, pageleft_y)
				left_page:free()
			end
			if not hide_title and book_title ~= "" then

				local left_safe_left = left_start
				local left_safe_right = left_start + col_width - (column_gap / 2)
				if not hide_page then
					local tmp_page = TextWidget:new{
						text = tostring(display_page_text),
						face = Font:getFace(header_font_face, header_font_size),
					}
					local left_page_w = tmp_page:getSize().w
					visual_center_offset = -tmp_page:getSize().w * balance_factor
					tmp_page:free()
					
					local gap = math.max(Screen:scaleBySize(16), header_font_size * 0.3)
					left_safe_left = left_safe_left + left_page_w + gap
				end
				local safe_width = math.max(left_safe_right - left_safe_left, 0)

				local left_fitted = getFittedText(spaced_book_title, safe_width)
				local left_text = TextWidget:new{
					text = left_fitted,
					face = Font:getFace(header_font_face, header_font_size),
					fgcolor = header_font_color,
					max_width = safe_width,
					truncate_with_ellipsis = true,
				}
				local text_w = left_text:getSize().w
				local text_x = left_safe_left + math.max((safe_width - text_w) / 2, 0) + visual_center_offset
				local textleft_y = top_margin - left_text:getSize().h - top_header_margin
				left_text:paintTo(bb, text_x, textleft_y)
				left_text:free()

			end
		end
		-- Right column
		if not first_page_of_chapter then
			if not hide_page then
				local right_page = TextWidget:new{
					text = tostring(display_page_text + 1),
					face = Font:getFace(header_font_face, header_font_size),
					fgcolor = header_font_color,
				}
				local page_w = right_page:getSize().w
				local page_x = right_start + col_width - page_w
				local pageright_y = top_margin - right_page:getSize().h - top_header_margin
				right_page:paintTo(bb, page_x, pageright_y)
				right_page:free()
			end
			if not hide_title and book_chapter ~= "" then
				local right_safe_left = right_start + (column_gap / 2)
				local right_safe_right = right_start + col_width
				if not hide_page then
					local tmp_page = TextWidget:new{
					text = tostring(display_page_text + 1),
					face = Font:getFace(header_font_face, header_font_size),
				}
				local right_page_w = tmp_page:getSize().w
				visual_center_offset = tmp_page:getSize().w * balance_factor
				tmp_page:free()
				
				local gap = math.max(Screen:scaleBySize(16), header_font_size * 0.3)
				right_safe_right = right_safe_right - right_page_w - gap
				end
				local safe_width = math.max(right_safe_right - right_safe_left, 0)

				local right_fitted = getFittedText(spaced_book_chapter, safe_width)
				local right_text = TextWidget:new{
					text = right_fitted,
					face = Font:getFace(header_font_face, header_font_size),
					fgcolor = header_font_color,
					max_width = safe_width,
					truncate_with_ellipsis = true,
				}
				local text_w = right_text:getSize().w
				local text_x = right_safe_left + math.max((safe_width - text_w) / 2, 0) + visual_center_offset
				local textright_y = top_margin - right_text:getSize().h - top_header_margin
				right_text:paintTo(bb, text_x, textright_y)
				right_text:free()

			end
		end
	else
				local page_text = TextWidget:new{
					text    = display_page_text,
					face    = Font:getFace(header_font_face, header_font_size),
					fgcolor = header_font_color,
				}
				local page_w = page_text:getSize().w
				page_text:free()

				local gap = math.max(Screen:scaleBySize(16), header_font_size * 0.3)
				local safe_left = left_margin
				local safe_right = screen_width - right_margin
				local balance_factor = 0.5  -- tweak 0..1 (smaller = subtler)
				local visual_center_offset = 0
				if not hide_page and not page_bottom then
					if not alternate_page_align then
						safe_right = safe_right - page_w - gap
						visual_center_offset =  page_w * balance_factor
					else
						local page_on_left = (pageno % 2 == 1)
						if page_on_left then
							safe_left = safe_left + page_w + gap
							visual_center_offset = -page_w * balance_factor
						else
							safe_right = safe_right - page_w - gap
							visual_center_offset =  page_w * balance_factor
						end
					end
				end
				local safe_width = math.max(safe_right - safe_left, 0)

				local header_text = TextWidget:new{
					text      = fitted_centered,
					face      = Font:getFace(header_font_face, header_font_size),
					fgcolor   = header_font_color,
					max_width = safe_width,
					truncate_with_ellipsis = true,
					padding   = 0,
				}

				local header_w = header_text:getSize().w
				local header_x = safe_left + math.max((safe_width - header_w) / 2, 0) + visual_center_offset
				if header_x < safe_left then header_x = safe_left end
				if header_x + header_w > safe_right then header_x = math.max(safe_right - header_w, safe_left) end
				local header_y = top_margin - header_text:getSize().h - top_header_margin
				header_text:paintTo(bb, header_x, header_y)
				header_text:free()
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

        local book_settings = getBookSettings(book_id) or {}

        local header_font_size = tonumber(book_settings.font_size) 
			or G_reader_settings:readSetting("default_font_size")
			or CRE_HEADER_DEFAULT_SIZE
        book_settings.font_size = header_font_size

		local top_header_margin = tonumber(book_settings.top_header_margin)
			or G_reader_settings:readSetting("default_top_header_margin")
			or DEFAULT_TOP_HEADER_MARGIN
		local bottom_header_margin = tonumber(book_settings.bottom_header_margin)
			or G_reader_settings:readSetting("default_bottom_header_margin")
			or DEFAULT_BOTTOM_HEADER_MARGIN
		book_settings.top_header_margin = top_header_margin
		book_settings.bottom_header_margin = bottom_header_margin

        if book_settings.alternate_page_align == nil then
            book_settings.alternate_page_align = true
        else
            book_settings.alternate_page_align = (book_settings.alternate_page_align == true)
        end
        local alternate_page_align = book_settings.alternate_page_align

        local ls = tonumber(book_settings.letter_spacing)
        if ls == nil then
            ls = G_reader_settings:readSetting("default_letter_spacing") or DEFAULT_LETTER_SPACING
        end

        setBookSettings(book_id, book_settings)

        if self.document.setFontBaseSize then
            self.document:setFontBaseSize(header_font_size)
        end

        if self.document.setPageMargins then
            self.document:setPageMargins(top_header_margin, top_header_margin, top_header_margin, bottom_header_margin)
        end

		local path = book_settings.font_face
		local face
		if path then
			face = Font:getFace(path, header_font_size)
		end
		if not face then
			local fallback_path = G_reader_settings:readSetting("default_font_face") or DEFAULT_HEADER_FACE
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

return {
    getBookMetaKey = getBookMetaKey,
    getBookSettings = getBookSettings,
    setBookSettings = setBookSettings,
    saveBookSetting = saveBookSetting,
}

-- How long will tomorrow last?
-- Eternity and a day.