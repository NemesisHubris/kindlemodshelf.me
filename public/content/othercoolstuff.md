<!-- no-action-buttons -->
# Other Cool Stuff

:::danger
**DISCLAIMER:** All of these are fully untested and may brick your Kindle. If your Kindle is already bricked, see the [unbrick guide](https://mip-wiki.pages.dev/database/unbrick/).
:::

## llama.cpp for Kindle

Run small language models on a Kindle. Cross-compiled to a static binary with no runtime dependencies, so it works on stock Kindle OS and in an Alpine Linux chroot. It was first built and tested on the Kindle Paperwhite 3 (ARMv7, 512MB RAM), where only very small models fit in memory.

:::danger
**Note:** Untested on devices other than the Kindle Paperwhite 3.
:::

  - [**LlamaCPP-kindle**](https://github.com/Entersjkhdfkjdhfksjf/LlamaCPP-kindle) \- Source repository

## KinnVM (ScummVM for Kindle)

An early ScummVM port for Kindle, for playing point-and-click adventure games. It needs firmware 5.16.3 or newer, and the author says it only sometimes works.

  - [**KinnVM 1.0**](https://github.com/fuzzyghosty/kinnvm/releases/tag/KinnVM-1.0) \- Download
  - [**kinnvm on GitHub**](https://github.com/fuzzyghosty/kinnvm) \- Project page

## 2048, Sudoku, Connect 4 and Hangman

Simple games built with the Illusion framework. They need a Kindle with Mesquite support.

  - [**2048**](../downloads/2048.zip) \- Download
  - [**Sudoku**](../downloads/sudoku.zip) \- Download
  - [**Connect 4**](../downloads/connect4.zip) \- Download
  - [**Hangman**](../downloads/hangman.zip) \- Download

## Tetris for KTerm (HF)

A terminal Tetris for hard-float Kindles, run from KTerm. It is not a standalone app.

  - [**Kindle Tetris**](../downloads/kindletetris.zip) \- Download

## Nine Men's Morris

The classic board game. There is a KUAL version for soft-float Kindles and a KTerm version for hard-float ones.

  - [**Nine Men's Morris (HF)**](../downloads/morris-kindle.zip) \- Download for hard-float Kindles
  - [**Nine Men's Morris (SF)**](https://www.mobileread.com/forums/showpost.php?p=2524556&postcount=43) \- MobileRead post with the soft-float download

## Universal Paperclips

The incremental game about an AI that makes paperclips, ported to Kindle.

  - [**Universal Paperclips**](../downloads/com.kbarni.paperclips.zip) \- Download

## Kindle Touch Doom

A Doom port for touchscreen Kindles (PW2 and newer hard-float models) built on doomgeneric. It runs as a KUAL extension with on-screen controls, and sound works over a Bluetooth speaker or headphones.

  - [**kindle-touch-doom**](https://github.com/kbarni/kindle-touch-doom) \- Project page
  - [**MobileRead thread**](https://www.mobileread.com/forums/showthread.php?p=4313126) \- Discussion

## Flash Android onto Your Kindle

:::danger
**Warning:** This only works on older Kindles with an unlocked boot loader. This will be incredibly slow, and basically unusable! You will have no battery life! This thing will drain your battery incredibly quickly! It defeats the purpose of an E ink screen being extremely low power! The only reason why you would want to do this is for the clout of having android on your kindle.
:::

  - [**XDA Forums Android installation guide**](https://xdaforums.com/t/guide-installing-android-on-your-aging-kindle-e-reader.4450117/) \- Guide
  - [**Successful attempt**](https://www.reddit.com/r/kindlejailbreak/comments/1oqirrj/i_managed_to_install_android_on_my_kindle/) \- Reddit thread

## Parental Controls for KOReader (Time Block)

KOReader Time Block limits when children can read with customizable reading windows and a PIN lock.

  - [**timeblock.koplugin**](../downloads/timeblock.koplugin.zip) \- Download

## TicTacToe

Classic TicTacToe for Kindle, launchable from KUAL.

  - [**TicTacToe on GitHub**](https://github.com/progzone122/tictactoe-kindle) \- Source repository

## Tower of Hanoi

Classic logic puzzle: move the disk stack to another peg one disk at a time.

  - [**Tower of Hanoi**](../downloads/tower-of-hanoi.zip) \- Download

## KoChess

Chess for your Kindle.

  - [**KoChess GitHub Repository**](https://github.com/bateast/kochess/tree/461fb8969012c7f44285a883f37ccd2021923b28) \- Source repository

## Barna's Interactive Fiction Recommendations

Barna's recommendations from the original MobileRead thread for interactive fictions you can play on [Gargoyle](/gargoyle) or [Frotz](/frotz).

  - [**MobileRead thread**](https://www.mobileread.com/forums/showpost.php?p=4508221&postcount=31) \- Recommendations

## How to Change the Order and Position of Menu Items

Customize your KOReader menu layout.

  - [**Reddit guide**](https://www.reddit.com/r/koreader/comments/1krejjg/how_to_change_to_order_and_position_of_menu_items/?rdt=48083) \- Guide

## Install KOReader on Mac

Run KOReader on macOS for testing or reading on your computer.

  - [**KOReader macOS installation guide**](https://github.com/koreader/koreader/wiki/Installation-on-MacOS) \- Official wiki page

## Gmplay Video Player for Kindle

Experimental video player for Kindle.

  - [**Gmplay MobileRead thread**](https://www.mobileread.com/forums/showthread.php?t=177455&highlight=gmplay) \- Discussion

## Send Books to KOReader via iPhone Shortcuts

SSH books from your iPhone to KOReader on your Kindle using iPhone Shortcuts.

  - [**Send to Kindle shortcut**](https://www.reddit.com/r/koreader/comments/1odp5rs/i_created_a_send_to_kindle_shortcut/?share_id=OgcqimWDicU45KdakpYtc&utm_content=1&utm_medium=ios_app&utm_name=ioscss&utm_source=share&utm_term=1&rdt=56803) \- Reddit thread

## Original KOReader Plugin Page

Original [KOReader plugins](/plugins) page which I added to to make my own version.

  - [**RSS Reader Plugin Repository**](https://github.com/omer-faruq/rssreader.koplugin/tree/7d425c1785685b48799a54d185de1d9f771ece12) \- Source repository

## Fake Registration

:::danger
**Note:** This may not work for all users. Your Kindle may also unregister itself after running — re-running the scriptlet fixes this.
:::

Spoof Kindle registration info locally so you can use your Kindle without an Amazon account and without nagging pop-ups.

  - [**fakereg.sh**](../downloads/fakereg.sh) \- Download

**Requirements:**

  - Jailbroken Kindle

**Installation:**

  1. Download `fakereg.sh` from the link above.
  2. Copy it to the `Documents` folder on your Kindle.
  3. It will appear as a book on your home screen. Tap it to run.
  4. You will see a lot of text output; this is normal and means it is working.
  5. Your Kindle will reboot automatically when done.

**Credits:**

  - Original script by [Hanspeter](https://www.mobileread.com/forums/showpost.php?p=4122357&postcount=125) (MobileRead)
  - Scriptlet adaptation by [GreenCat777](https://www.greencat777.xyz)

## EasyBrick

:::danger
**⚠ CRITICAL WARNING:** The following tool will BRICK your Kindle. DO NOT RUN unless you fully understand what you are doing and want to kill a kindle for no reason. Please just reset it and send it to me instead of running this!
:::

**DO NOT RUN THIS!** This is a scriptlet that WILL brick your Kindle by removing critical system files. It has no other purpose.

Do not run this without understanding that it WILL brick your Kindle.

  - [**EasyBrick**](../downloads/easybrick.txt) \- A simple scriptlet to brick your Kindle

Currently there have been no reports of bricked Kindles; any such report has been debunked as a joke. For more stats look [here](https://greencat-777.github.io/ebstats.html).

**Credit:** [**GreenCat777**](https://github.com/GreenCat-777)

## Calendar Overlay

KOReader patch that shows upcoming ICS calendar events on your Kindle sleep screen.

:::danger
**Note:** Some people say that this doesn't work.
:::

  - [**2-zzz-calendar-overlay.lua**](../downloads/2-zzz-calendar-overlay.lua) \- Download

## Video + Audio Playback (Beta)

Beta gmplay + SoX setup for video and audio playback on HF Kindles.

:::danger
**Note:** Some people say that this doesn't work.
:::

  - [**Google Drive link**](https://drive.google.com/file/d/1633_dfciSHXBJbkhkTucIDFEsM4Z7SLX/view) \- Download. Not checked

## Snake

A version of the classic Snake game for Kindle.

:::danger
**Note:** This is basically impossible to play on an e-ink display due to refresh rates, and it isn't the best looking.
:::

  - [**snake.zip**](../downloads/snake.zip) \- Download

## Calibre Tools and Converters

Calibre plugins need Calibre installed on your computer. Most of them convert or fix files on the computer, not on the Kindle.

  - [**bindery**](https://github.com/jarynclouatre/bindery) \- Drop ebooks and comics into a folder and get Kobo- and Kindle-ready files out (Docker)
  - [**boko**](https://github.com/zacharydenton/boko) \- Fast EPUB converter to KFX, AZW3 and MOBI, written in Rust
  - [**calibre-kindle-asin-fixer**](https://github.com/JediRhymeTrix/calibre-kindle-asin-fixer) \- Sets the correct Kindle ASIN in Calibre metadata so Colorsoft covers display
  - [**calibre-kindle-comics**](https://github.com/pavelzw/calibre-kindle-comics) \- Converts CBZ and CBR comics to MOBI for Kindle (Calibre plugin, 2021)
  - [**Kindle Cover Fixer**](https://github.com/scotjam/calibre_kindle_cover_fixer) \- Embeds covers and ASINs so sideloaded books show covers (unofficial Calibre plugin)
  - [**Calibre X-Ray Plugin**](https://github.com/stoduk/calibre_plugin_xray) \- Generates Kindle X-Ray and About the Book files in Calibre (2016, older)
  - [**epub-converter**](https://github.com/AlekseyFadeev/epub-converter) \- Single-file FB2 to EPUB converter that runs in the browser
  - [**Fix-Kindle-Ebook-Cover**](https://github.com/bookfere/Fix-Kindle-Ebook-Cover) \- Repairs damaged covers of Kindle ebooks (Python, older)
  - [**fixcovers**](https://github.com/mcqweb/fixcovers) \- KUAL extension that fixes missing covers of sideloaded books
  - [**kfxgen**](https://github.com/jloutsch/kfxgen) \- Calibre output plugin that generates Kindle KFX with a working nav pane
  - [**kindle-annotation-import**](https://github.com/brpeterman/kindle-annotation-import) \- Imports Kindle highlights and notes into Calibre (Calibre plugin)
  - [**kindle-calibre-bot**](https://github.com/acamposcar/kindle-calibre-bot) \- Telegram bot that sends or converts e-books for Kindle
  - [**KOReader Calibre Plugin**](https://github.com/kyxap/koreader-calibre-plugin) \- Calibre plugin that syncs metadata from KOReader
  - [**Send to Kindle (Calibre)**](https://github.com/bookfere/Send-to-Kindle-Calibre-Plugin) \- Sends an ebook to Kindle with a chosen title (Calibre plugin)
  - [**Octavo**](https://github.com/artemnovichkov/Octavo) \- Native macOS app that syncs a library to Kindle over MTP and edits metadata
  - [**ExtractCoverThumbs**](https://github.com/quiris11/ExtractCoverThumbs) \- Recovers missing Cover View thumbnails. Does not work on firmware 5.8.5 and newer for some books (older)
  - [**BookFere-Tools**](https://github.com/bookfere/BookFere-Tools) \- KUAL extension with an SDR cleaner and cover fixer (Chinese docs)
  - [**KOReader Page Turner Companion**](https://github.com/TomasDiLeo/koreader_pageturner_companion) \- Android app companion for the KOReader Page Turner plugin
  - [**newsrack**](https://github.com/ping/newsrack) \- Builds a newsrack of periodicals from calibre recipes. News content may be copyrighted, so check what you read
  - [**pinboard-to-kindle**](https://github.com/christianhans/pinboard-to-kindle) \- Calibre recipe that sends unread Pinboard bookmarks to your Kindle

## Sending Books to Kindle

  - [**BooksByMail**](https://github.com/mcastillof/BooksByMail) \- KUAL extension that receives books by email on a Kindle PW1 (older, PW1 only)
  - [**kual-wifi-transfer**](https://github.com/mzlogin/kual-wifi-transfer) \- Wi-Fi book transfer over KUAL (Chinese docs)
  - [**push-to-kindle**](https://github.com/Aneureka/push-to-kindle) \- Web tool for pushing documents to your Kindle (Chinese docs)
  - [**send-to-kindle-telegram-bot**](https://github.com/michaelfmnk/send-to-kindle-telegram-bot) \- Self-hosted Telegram bot that sends documents to your Kindle (Docker)
  - [**sendKindle**](https://github.com/kparal/sendKindle) \- CLI for emailing files to your Kindle (older)
  - [**webkin**](https://github.com/mr-karan/webkin) \- CLI tool that sends web pages to your Kindle
  - [**Full book sync (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1u6fc1j/full_book_sync_between_a_jailbroken_kindle/) \- Syncs books between a jailbroken Kindle, Android and Nextcloud. Described in the Reddit post; not checked yet

## Dashboards, Screensavers and Wallpapers

These are untested unless noted. Some need a server, an API key or a Home Assistant install.

  - [**kindle-eink-panel**](https://github.com/UpLearner/kindle-eink-panel) \- Docker render pipeline and layout editor for an e-ink info panel on a jailbroken Paperwhite (Chinese docs)
  - [**Kindle Paperwhite Clock**](https://github.com/Crucial-hash/kindle-paperwhite-clock) \- Clock website for a Kindle: time, F1 dates and prayer times
  - [**Kindle Side Card**](https://github.com/perduewu-ops/kindle-side-card) \- Local e-ink side display for an old Kindle (experimental)
  - [**Paperwhite Weather**](https://github.com/estcarisimo/paperwhite-weather) \- Always-on e-ink weather display for a jailbroken Paperwhite
  - [**kindle-dashboard**](https://github.com/terminalbytes/kindle-dashboard) \- Weather dashboard for the Paperwhite 7th gen (Environment Canada data)
  - [**kindle4-weather-display**](https://github.com/melihkarakelle/kindle4-weather-display) \- Weather and Todoist display for a Kindle 4 Non-Touch
  - [**Kindle Screensaver Converter GUI**](https://github.com/neura-neura/kindle-screensaver-converter-gui) \- GUI that converts images to Kindle screensavers
  - [**kindle-carousel**](https://github.com/qadzek/kindle-carousel) \- Turns an old Kindle into an interactive dashboard, switched with its buttons
  - [**Home Assistant Kindle Screensaver**](https://github.com/sibbl/hass-lovelace-kindle-screensaver) \- Turns a Home Assistant dashboard into a Kindle screensaver (needs Home Assistant)
  - [**kumanaya/eink-wallpaper**](https://github.com/kumanaya/eink-wallpaper) \- A new Unsplash photo every minute on a Kindle (MIT, POSIX shell)
  - [**EinkWallpaperMaker**](https://github.com/llizylizy/EinkWallpaperMaker) \- Makes screensavers and wallpapers for e-ink devices
  - [**EInkXT Wallpaper Studio**](https://github.com/evoll/EInkXTWallpaperStudio) \- Prepares images for e-ink displays, in the browser or on the desktop
  - [**E-Ink Music Lockscreen Generator**](https://github.com/whitelips/eink-wallpaper-generator) \- Apple Music-style lockscreen generator for e-ink
  - [**kindle-gphotos**](https://github.com/mattzzw/kindle-gphotos) \- Paperwhite picture frame that shows a shared Google Photos album
  - [**PW2 Weather and Train Board (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1wji34a/kindle_pw2_as_a_weather_and_train_board/) \- Described in the Reddit post; not checked yet
  - [**Live Desk Display (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1oude8r/turned_my_old_kindle_into_a_live_desk_display/) \- Described in the Reddit post; not checked yet
  - [**Weather and Commute Lockscreen (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1wsgwht/built_a_weather_commute_lockscreen_dashboard/) \- Experimental. Described in the Reddit post; not checked yet
  - [**ember**](https://github.com/odmrs/ember) \- Local web app to manage books on a jailbroken Kindle running KOReader, over SSH
  - [**Bookshelf Ornament Packs (sponsor)**](https://ko-fi.com/s/400e620ab3) \- Ornament packs for Bookshelf. The Autumn pack is for sponsors only, sold on Ko-fi
  - [**orbitui-addons**](https://github.com/komadorirobin/orbitui-addons) \- Optional ornament packs for OrbitUI (data only, not a plugin)
  - [**Simple UI v1.5 Wallpapers and Icon Packs (Reddit post)**](https://www.reddit.com/r/koreader/comments/1te05y5/update_simple_ui_v15_wallpapers_custom_icon_packs/) \- Wallpapers, icon packs and UI fonts for SimpleUI. Described in the Reddit post; not checked yet
  - [**K-Bridge**](https://github.com/Soshi31/K-Bridge) \- Desktop app: converts PDFs to EPUB and sends screensavers and wallpapers to KOReader over SSH (new project)
  - [**Life Dashboard**](https://github.com/davidhampgonsalves/Life-Dashboard) \- Low-power e-ink dashboard for everyday life, on a hacked Kindle (needs setup on the device)

## Icon Packs, Fonts and Theme Tools

Check each font's licence before you use it.

  - [**Black Cat Supremacy Icon Set (Reddit post)**](https://www.reddit.com/r/koreader/comments/1pft7uv/black_cat_supremacy_icon_updated_more_icons/) \- Icon set for KOReader. Described in the Reddit post; not checked yet
  - [**Colorsoft Icons for Simple UI (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1wfiktr/colorsoft_icons_for_simple_ui/) \- Colour icons for SimpleUI. Described in the Reddit post; not checked yet
  - [**koreader-fonts**](https://github.com/koreader/koreader-fonts) \- Official KOReader fonts. Check each font's licence
  - [**WP-Fonts**](https://github.com/Chairzard/WP-Fonts) \- Free and open-source fonts for KOReader, with fixes. Check each font's licence
  - [**FontsMaker**](https://github.com/linzeyan/FontsMaker) \- Adjusts open-source CJK fonts for e-readers: embolden, pseudo-vertical, Simplified to Traditional (Chinese docs)
  - [**kindlehub-device-pack**](https://github.com/arancool3000/kindlehub-device-pack) \- Fullscreen browser, power-button gestures and redrawn icons. Changes system files; verified on one Paperwhite 11 only
  - [**awesome-koreader**](https://github.com/ruiribeiro04/awesome-koreader) \- Curated list of KOReader plugins, tools, patches and sync servers
  - [**Image-to-Cover Editor (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1tgdot8/tool_to_convert_and_edit_images_into_covers/) \- Converts and edits images into book covers. Described in the Reddit post; not checked yet

## Sync and Library Servers

These run on a server or a computer you control. None of them needs a Kindle jailbreak.

  - [**KOReader Sync Server (official)**](https://github.com/koreader/koreader-sync-server) \- The official self-hostable reading-position sync server
  - [**KOReader Sync (nperez0111)**](https://github.com/nperez0111/koreader-sync) \- Self-hosted sync server that keeps reading progress in sync
  - [**liseur-sync**](https://github.com/chmouel/liseur-sync) \- Self-hosted reading-position sync and statistics server
  - [**BookLore**](https://github.com/booklore-app/booklore) \- Self-hosted multi-user library with smart shelves and Kobo and KOReader sync (BookOrbit is its successor)
  - [**Tome**](https://github.com/bndct-devops/tome) \- Self-hosted ebook library server that tracks how you read. Check the repo for its KOReader sync part
  - [**KOReader Store**](https://github.com/ThePixelPro366/KoStore) \- Desktop app that installs KOReader plugins and patches. Overlaps with appstore.koplugin
  - [**obsidian-kindle-export**](https://github.com/SimeonLukas/obsidian-kindle-export) \- Obsidian plugin that exports notes as an EPUB for Kindle or PocketBook
  - [**readinglog**](https://github.com/huangziwei/readinglog) \- Reading stats from the Kindle's own system logs. Reads logs only and runs nothing in the background
  - [**clippings-dropbox**](https://github.com/matejd/clippings-dropbox) \- Syncs My Clippings.txt to Dropbox over Wi-Fi (older; uses your Dropbox account)
  - [**KoHighlights**](https://github.com/noembryo/KoHighlights) \- Desktop viewer and exporter for KOReader highlights, to text, HTML, CSV or Markdown
  - [**KoShelf**](https://github.com/paviro/KoShelf) \- Web dashboard that combines your KOReader notes, highlights and reading stats. Runs as a server you host

## KUAL and SSH Tools

:::danger
**Caution:** SSH tools open a network service on your Kindle. Read each project's security notes first, and only turn them on when you need them.
:::

  - [**dropbear-ssh**](https://github.com/akshaylahudkar/dropbear-ssh) \- SSH and SFTP over Wi-Fi, started from an on-device app. Packaged for KPM. Opens a network service, so read the notes first
  - [**KindleSSH**](https://github.com/ferib/KindleSSH) \- Dropbear for armhf, launched with KUAL. Repo README returns 404 at the time of checking
  - [**KOSSH**](https://github.com/guo-yong-zhi/KOSSH) \- Kindle SSH server extracted from KOReader, packaged as a KUAL extension
  - [**Kindle SSH Client Guide**](https://github.com/Mounstroya/kindle-ssh-guide) \- Guide to a working outbound SSH client on a jailbroken Kindle over Tailscale
  - [**Kindle Button Handler**](https://github.com/sumdher/kindle_button_handler) \- Physical button remapper for jailbroken Kindles, with app-specific rules (beta, KUAL)
  - [**kindle-pagefix**](https://github.com/Flyn/kindle-pagefix) \- KUAL extension for left-hand page turns (2014)
  - [**kual-fastfetch**](https://github.com/CivNotSiv/kual-fastfetch) \- KUAL extension with fastfetch and figlet binaries
  - [**pytimelit**](https://github.com/largomst/pytimelit) \- KUAL literary clock. Tested only on a Kindle Touch
  - [**fread-kual-extension**](https://github.com/fread-ink/fread-kual-extension) \- KUAL extension for launching fread.ink
  - [**Kindle Scribe Screen Sharing (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1rb34wo/kindle_scribe_screen_sharing_via_ssh/) \- Shares the Scribe screen over SSH. Described in the Reddit post; not checked yet

## Bluetooth Page-Turners and Remotes

Page turners and remotes that connect to the Kindle or to KOReader over Bluetooth or Wi-Fi.

  - [**Kindle HID Passthrough (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1vvousi/bluetooth_remote_alone_is_worth_the_jailbreak/) \- Bluetooth page turners on a Kindle. Described in the Reddit post; not checked yet
  - [**Android Bluetooth Page-Turner App (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1v8m0qk/made_a_free_android_bluetooth_pageturner_app/) \- A free Android app for turning pages over Bluetooth. Described in the Reddit post; not checked yet
  - [**Galaxy Watch Bezel Page-Turner (Reddit post)**](https://www.reddit.com/r/koreader/comments/1v52pmv/i_got_my_galaxy_watch_bezel_working_as_a_koreader/) \- Uses the Galaxy Watch bezel to turn pages in KOReader. Described in the Reddit post; not checked yet
  - [**Wear OS Watch Remote (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1vmc2ta/guide_turn_a_wear_os_watch_into_a_koreader_remote/) \- Turns a Wear OS watch into a KOReader remote. Described in the Reddit post; not checked yet
  - [**KOReader iPhone Remote**](https://github.com/maxoliinyk/koreader-ios-remote) \- Native iPhone and Apple Watch remote for KOReader over Wi-Fi. Experimental
  - [**Keep Bluetooth Headphones Connected (Reddit post)**](https://www.reddit.com/r/kindlejailbreak/comments/1t72464/keep_your_bluetooth_headphones_connected_on_kindle/) \- Keeps Bluetooth headphones connected on a Kindle. Described in the Reddit post; not checked yet

## Developer and Hardware Projects

  - [**qemu-kindle4**](https://github.com/hezi/qemu-kindle4) \- QEMU machine that emulates the Kindle 4, for development
  - [**esp32-s2-eink**](https://github.com/yuiiio/esp32-s2-eink) \- Drives a Paperwhite 7th gen e-ink panel from an ESP32-S2 (hardware)
  - [**FBInk**](https://github.com/NiLuJe/FBInk) \- Framebuffer eInker: prints text and images to an e-ink framebuffer (developer library)

## Reader Apps

  - [**koreader-ios**](https://github.com/hezi/koreader-ios) \- iOS and iPadOS port of KOReader, sideloaded with Xcode
