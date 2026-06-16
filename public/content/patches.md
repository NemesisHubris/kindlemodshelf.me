# KOReader Patches

> KOReader patches fine-tune the interface, browser, screensaver, and Project: Title styling. Apply only what you need and restart KOReader after every change.

:::warning
**DISCLAIMER:** These user patches are community-created. Download and use at your own risk. Please read each patch's GitHub instructions and README to understand what it does. See the [KOReader User Patches documentation](https://github.com/koreader/koreader/wiki/User-patches) for installation details.
:::

## Installation

  1. Create a `patches` folder inside your KOReader directory (skip if it already exists).
  2. Download each user patch and copy the `.lua` file into `/koreader/patches/` without renaming it.
  3. Restart KOReader so the new patch loads.

## Core Reading Patches

Essential patches for improving the reading experience.

  - [**2-browser-folder-cover.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-browser-folder-cover.lua) \- Add cover art to mosaic folders with optional custom `.cover` images and layout toggles under *Settings → Mosaic & detailed list*.
  - [**2-browser-hide-underline.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-browser-hide-underline.lua) \- Hide the "last visited" underline; enable the toggle in *Settings → Mosaic & detailed list*.
  - [**2-browser-up-folder.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-browser-up-folder.lua) \- Move the "up folder" control into the title bar and optionally hide empty folders.
  - [**2-filemanager-titlebar.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-filemanager-titlebar.lua) \- Add rearrangeable metadata widgets to the file manager title bar.
  - [**Book Receipt**](https://github.com/omer-faruq/koreader-user-patches) \- Display detailed book statistics and reading metadata on-screen

## UI Customization

Patches for customizing the KOReader interface and menus.

  - [**2--ui-font.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2--ui-font.lua) \- Switch the KOReader UI font via *Settings → UI font*.
  - [**2-menu-size.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-menu-size.lua) \- Reflow menu dimensions to match your device DPI for nicer touch targets.
  - [**2-disable-top-menu-zones.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-disable-top-menu-zones.lua) \- Disable the swipe/tap hotzones so the top menu always reopens on its last tab.
  - [**Info Message when Opening File Manager**](https://gist.github.com/noxhirsch/47d0cb4ee35980ec3c5bc4fc6f2afd2a) \- Display helpful notifications when accessing files
  - [**2-BrowseByMetadata.lua**](https://github.com/koreader/koreader/issues/8472) \- Adds author, title, series, and keyword browser views.
  - [**2-browser-double-tap.lua**](https://github.com/sparklerfish/KOReader.patches?tab=readme-ov-file#-2-browser-double-tap) \- Require double-tap to open books in the file browser, preventing accidental single-tap opens.
  - [**2-browser-frontlight-update.lua**](https://github.com/sparklerfish/KOReader.patches?tab=readme-ov-file#-2-browser-frontlight-update) \- Update Project: Title/Cover Browser frontlight widget in real time when frontlight is adjusted.
  - [**2-automatic-book-series.lua**](https://github.com/xusoo/KOReader.patches) \- Automatically group books in the same series into virtual folders within the File Browser.

## Status Bar & Visual Tweaks

Patches for customizing the status bar, colors, and visual appearance.

  - [**2-statusbar-better-compact.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-statusbar-better-compact.lua) \- Improve compact mode icons, separators, and title/author labels.
  - [**2-statusbar-cycle-presets.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-statusbar-cycle-presets.lua) \- Tap the status bar to cycle through saved preset layouts (requires KOReader v2025.04.52+).
  - [**2-statusbar-thin-chapter.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-statusbar-thin-chapter.lua) \- Add level-1 TOC chapter markers to the thin progress bar.
  - [**2-reference-page-count.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-reference-page-count.lua) \- Fix reference page fallback logic so page counts stay accurate.
  - [**2-change-status-bar-color.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-change-status-bar-color.lua) \- Change status bar read/unread colors under *Status bar → Progress bar → Thickness, height & colors*.
  - [**Change Status Bar Color**](https://gist.github.com/IntrovertedMage/d759ff214f799cfb5e1f8c85daab6cae) \- Customize status bar colors for color e-reader displays
  - [**Justify Status Bar**](https://github.com/prashanthglen/kojustifystatusbar) \- Align status bar content with proper spacing and justification
  - [**2-reader-header-print-edition.lua**](https://github.com/joshuacant/KOReader.patches/blob/main/2-reader-header-print-edition.lua) \- Impacts the page header / footer layout when reading a book.

## Screen & Sleep Customization

Patches for screensaver behavior and sleep screen messages.

  - [**2-screensaver-chapter.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-screensaver-chapter.lua) \- Add `%C` chapter title and `%P` percent tokens to the sleep screen message.
  - [**2-screensaver-cover.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-screensaver-cover.lua) \- Center images, refresh before sleep, and tweak night mode behavior for sleep screens.
  - [**Redesigned Banner Sleep Screen**](https://www.reddit.com/r/koreader/comments/1qxjle6/release_i_redesigned_the_default_sleep_screen/) \- Visual refresh of the default banner-style sleep screen with enhanced layout and additional data field.
  - [**2-redacted-screensaver.lua**](https://github.com/sparklerfish/KOReader.patches?tab=readme-ov-file#-2-redacted-screensaver) \- Show the current page with random words covered by black redaction bars as a sleep screen.

## Advanced Features

Standalone patches for extending functionality.

  - [**Increase Font List**](https://github.com/koreader/koreader/issues/13839) \- Expand available fonts by adding custom typeface options. *Note: Read through the entire issue thread to locate the code snippet, copy it into a text editor, save the file with a`.lua` extension (e.g., `2-increase-font-list.lua`), then place it in your patches folder.*
  - [**Unified Auto Sync**](https://gist.github.com/mallomar/67349ac3c88e1950754ba39a4913c029) \- Enable automatic synchronization of reading progress across devices
  - [**2-update-patches.lua**](https://github.com/sebdelsol/KOReader.patches/blob/main/2-update-patches.lua) \- In-app updater for the sebdelsol patch collection (requires KOReader v2025.04.107+).
  - [**KinAMP KOReader Integration**](https://github.com/kbarni/KinAMP) \- Launch KinAMP music player from KOReader's Tools menu with basic integration.

## Community Patch Collections

Curated patch collections from community developers. Each repository contains multiple patches organized by function—explore the full collection on GitHub for patches matching your setup.

  - [**sebdelsol**](https://github.com/sebdelsol/KOReader.patches) – Curated the patch library and original documentation
  - [**angelsangita Assorted User Patches**](https://github.com/angelsangita/Koreader-Patches) \- Community collection with browser and UI enhancements
  - [**medinauta Patches**](https://github.com/medinauta/Koreader-Patches) \- UI enhancements including Book Spine Effect and Rounded Corners
  - [**joshuacant Assorted User Patches**](https://github.com/joshuacant/KOReader.patches) \- Comprehensive collection including Project: Title patches
  - [**Djeymisson Assorted User Patches**](https://github.com/Djeymisson/KOReader.patches) \- Focused patches for cover browser customization
  - [**zenixlabs Frankenpatches**](https://github.com/zenixlabs/koreader-frankenpatches-public) \- Experimental and advanced patches for power users
  - [**VeeBui's Detailed Header Footer Patches**](https://github.com/VeeBui/KOReader-patches) \- Enhanced header and footer customization options
  - [**clarainna Download Buttons**](https://github.com/clarainna/KOReader-Patches) \- Add download indicators and management buttons to your browser
  - [**Minimal Book Stats**](https://github.com/Litaliaa/koreader-user-patches) \- Lightweight version of book receipt showing essential statistics
  - [**Reader Header Alternative**](https://github.com/oh1apps/koreader_header) \- Streamlined page header design for reading view
  - [**Smart Collections**](https://github.com/advokatb/KOReader-Patches) \- Organize books by custom collections and tags
  - [**timault KOReader Patch**](https://github.com/timault/KOReader-Patch) \- Visual UI overhaul with spine shadows and smart collections
  - [**KukkiiNeko User Patches Collection**](https://github.com/KukkiiNeko/koreader-user-patches-collection) \- Community collection with assorted UI and behavior tweaks
  - [**gennaro-tedesco KOReader.patches**](https://github.com/gennaro-tedesco/KOReader.patches) \- Patch set including font normalizers and weather lockscreen tweaks
  - [**Stacked Top or Bottom Bars**](https://github.com/gilgulgamesh/koreader-patches) \- Reposition and reorganize interface bars for different layouts
  - [**sparklerfish Patches**](https://github.com/sparklerfish/KOReader.patches) \- Browser double-tap, frontlight widget updates, and redacted screensaver
  - [**xusoo Patches**](https://github.com/xusoo/KOReader.patches) \- Automatic book series grouping in virtual folders

## Project: Title — User Patches

User patches crafted specifically for [**Project: Title**](projecttitle.html). Download manually—these are not bundled with the plugin.

  - [**2-disable-unread-progressbars.lua**](https://github.com/joshuacant/KOReader.patches/blob/main/2-disable-unread-progressbars.lua) \- Hide unread progress bars in Cover Grid for cleaner cards.
  - [**2-menutext-overrides.lua**](https://github.com/joshuacant/KOReader.patches/blob/main/2-menutext-overrides.lua) \- Rename folders/files for display by replacing underscores and reordering leading articles.
  - [**2-project-title-jpeg-filter.lua**](https://gist.github.com/mallomar/22176237a7c72b585b802db83d67b38f) \- Filter `.jpg`/`.jpeg` files from Library mode to keep grids focused on books.
  - [**2-progress-bar-colors.lua**](https://gist.github.com/mallomar/147bc13f90fee36df16c6896d0c79e67) \- Recolor progress bars on color displays to match Project: Title palettes.

## Project: Title — Developer Collections

Comprehensive patch repositories from Project: Title enthusiasts with themed customizations and UI variations.

  - [**loeffner Project Title Patches**](https://github.com/loeffner/KOReader.patches) \- Advanced styling patches tailored for Project: Title grid layouts
  - [**crasmoisi PT Assorted Patches**](https://github.com/cramoisi/koreader.patches) \- Thematic customizations and header/footer variations for Project: Title
  - [**Project Title Alternative**](https://github.com/SeriousHornet/KOReader.patches) \- Alternative Project: Title styling with different visual themes

## Project: Title — Grid & Cover Enhancements

  - [**Centered Arrows in Footer**](https://github.com/Leoparodo/Leos-KOReader-Patches-Plugins) \- Center navigation arrows in footer area for balanced layout
  - [**Page Count Instead of Progress Bar When Unopened**](https://github.com/WorkingLemon/KOReader.patches) \- Display page count on unread books in Cover Grid view
  - [**Page Count When New or Finished**](https://github.com/solyytes/koreader-patches) \- Show page totals for unstarted and completed books in Cover List view

## Project: Title — Compatible Extras

General patches verified to cooperate with Project: Title while extending library features. Pair them with the browser tweaks above for a full themed shelf.

  - [**KOReader Page Header**](pageheader.html) \- Fiction-style header bar with per-book configuration that matches Project: Title layouts.
  - [**2-BrowseByMetadata.lua**](https://github.com/koreader/koreader/issues/8472) \- Adds author, title, series, and keyword browser views that slot neatly into Project: Title navigation.
  - **2-browser-folder-cover.lua** \- Pair with Project: Title layouts for folder covers that match the themed grid.

## Make Your Own

Clone the [**2-userpatch-template.lua**](https://github.com/joshuacant/ProjectTitle/blob/master/resources/2-userpatch-template.lua) starter, rename it with the correct execution-order prefix, and customize the Lua hooks for your workflow.

> Missing a favorite patch? Let us know and we’ll add it after verifying compatibility.
