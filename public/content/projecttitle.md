# ProjectTitle

> ProjectTitle is a KOReader library plugin with cover-first browsing, progress indicators, and customizable layout controls.

## Overview

ProjectTitle replaces KOReader’s default Cover Browser with a polished interface that emphasises library artwork, reading progress, and quick navigation shortcuts.

## Download

[Releases Page](https://github.com/joshuacant/ProjectTitle/releases) – Download the version matching your KOReader build exactly.

## Features

  - **Enhanced Title Bar** – Quick access to Favorites, History, Open Last Book, and Up Folder.
  - **Visual Book Listing** – Custom fonts, icons for missing covers, and optional progress bars showing book length.
  - **Clean Folders** – Display as cover images, thumbnails, or icons.
  - **Configurable Footer** – Show folder paths or device status (time, Wi-Fi, battery, frontlight).
  - **Updated Status Page** – Stylish screensaver view with book description and completion progress.
  - **Trophy Icons** – Mark finished books at a glance.
  - **Gesture Controls** – Pinch or spread to resize items.
  - **Library Mode** – Long-press the origami bird to view all books sorted by author or series.
  - **Auto-scan** – Detect new books after USB eject.
  - **Filenames Mode** – Optional barebones listing (v2025.08v3.5+).

## Installation

**Kindle Only:**

  1. Navigate to *Menu → Tools → Plugin Management* and disable **Cover Browser**.
  2. Download the release that matches your KOReader version.
  3. Extract the archive and copy the `projecttitle.koplugin` folder to `koreader/plugins/`.
  4. Copy the bundled fonts to `koreader/fonts/`.
  5. Copy the icons to `koreader/icons/`.
  6. Restart KOReader so ProjectTitle becomes the default browser.

If you installed KOReader through Kindleforge you will be on the nightly build; use *Menu → Tools → Update* to downgrade to the tagged release that matches your ProjectTitle download before re-enabling the plugin.

**Uninstall:** Re-enable Cover Browser in Plugin Management, then delete the ProjectTitle plugin folder, fonts, and icons.

## How to Use

Open ProjectTitle settings in KOReader via *Menu → Tools → More Tools → Project: Title*.

Review the full documentation for customization tips: [ProjectTitle Wiki](https://github.com/joshuacant/ProjectTitle/wiki/Documentation).

## Notes

  - Release versions must match KOReader exactly.
  - Works best with libraries that have clean metadata and cover images.
  - Optional Calibre integration powers the reading progress bars.

## Links

  - [GitHub](https://github.com/joshuacant/ProjectTitle)
  - [Installation Guide](https://github.com/joshuacant/ProjectTitle/wiki/Installation)
  - [Calibre Setup](https://github.com/joshuacant/ProjectTitle/wiki/Configure-Calibre-Page-Counts)

## Credits

  - Based on Cover Browser by @poire-z and the KOReader team
  - Modified by @joshuacant and @elfbutt
