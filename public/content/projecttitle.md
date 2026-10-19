# ProjectTitle

> ProjectTitle is a KOReader library plugin with cover-first browsing, progress indicators, and customizable layout controls.

## Overview

ProjectTitle replaces KOReader’s default Cover Browser with a polished interface that emphasises library artwork, reading progress, and quick navigation shortcuts.

## Download

[Latest release](https://github.com/joshuacant/ProjectTitle/releases/latest) – Download the `.zip` for the exact KOReader version it lists.

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

Each release is built for specific KOReader versions. Check which one the release lists, and make sure you are running exactly that version.

  1. **Do this first:** in KOReader, tap the wrench icon, then *More tools*, then *Plugin management*, and turn off **Cover Browser**. Tap *Restart Now*.
  2. Plug the Kindle into your computer.
  3. Open the `.zip` and copy the `projecttitle.koplugin` folder into `koreader/plugins/` on the Kindle. If you end up with a folder inside a folder, move the inner one up.
  4. Eject the Kindle. In KOReader, go to *Plugin management*, turn on **Project: Title**, and tap *Restart Now*.

Your books are scanned again the first time, because Project: Title keeps its own cache. Tap the menu icon on the home screen and choose **Extract and cache book information** to do it all at once, with the Kindle plugged in and charging.

### Nightly KOReader builds

Project: Title will not load on nightly KOReader builds, so it cannot crash KOReader after an update. You have two choices:

  - Switch KOReader to the **Stable** update channel (*Update*, *Settings*, *Update Channel*).
  - Or create an empty file named exactly `pt-skipversioncheck.txt` in `koreader/settings/`. The plugin then loads on any version, which can cause crashes after KOReader updates. [Read the consequences first.](https://github.com/joshuacant/ProjectTitle/wiki/Use-With-Nightly-KOReader-Builds)

If you installed KOReader through KindleForge you may be on a nightly build, so this applies to you.

**Uninstall:** Turn Cover Browser back on in Plugin management, then delete the `projecttitle.koplugin` folder.

## How to Use

Open ProjectTitle settings in KOReader via *Menu → Tools → More Tools → Project: Title*.

Review the full documentation for customization tips: [ProjectTitle Wiki](https://github.com/joshuacant/ProjectTitle/wiki/Documentation).

## Notes

  - Release versions must match KOReader exactly. After updating KOReader, wait for a matching Project: Title release.
  - User patches written before version 3.8 need a one-word change to keep working. See the [wiki](https://github.com/joshuacant/ProjectTitle/wiki/User-Patches-for-Project-Title#updating-user-patches-to-work-with-pt-38-and-above).
  - Works best with libraries that have clean metadata and cover images.
  - Optional Calibre integration powers the reading progress bars.

## Links

  - [GitHub](https://github.com/joshuacant/ProjectTitle)
  - [Installation Guide](https://github.com/joshuacant/ProjectTitle/wiki/Installation)
  - [Calibre Setup](https://github.com/joshuacant/ProjectTitle/wiki/Configure-Calibre-Page-Counts)

## Credits

  - Based on Cover Browser by @poire-z and the KOReader team
  - Modified by @joshuacant and @elfbutt
