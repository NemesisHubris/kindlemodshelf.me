# Boot KOReader Automatically

> A KUAL extension that installs or removes KOReader autolaunch scripts so the reader starts on boot without disabling the standard Kindle interface.

## Download

  - [KOReader Autolaunch Extension (GitHub)](https://github.com/meepcat55/Kindle-KOReader-On-Boot)

## Overview

The KOReader Autolaunch extension toggles a boot script that opens KOReader as soon as the Kindle finishes starting up. The script leaves Amazon’s UI running so the process remains stable, and you can reverse the change at any time from KUAL.

## Features

  - Installs KOReader autostart scripts from KUAL
  - Leaves the Kindle UI running to avoid failed boots
  - Provides removal and recovery options without manual edits

## Requirements

  - KOReader installed
  - KUAL (Kindle Unified Application Launcher)

## Installation

  1. Download the repository archive from GitHub and extract it.
  2. Copy the extracted extension folder into the `extensions/` directory on your Kindle.
  3. Eject the Kindle safely and open KUAL.
  4. Launch **KOReader Autolaunch** from KUAL and choose **Install**.

## Uninstallation

  1. In KUAL, open **KOReader Autolaunch** and select **Remove**.
  2. Or run `bash /mnt/us/KOReader-autolaunch-remove.sh` inside KOReader’s terminal emulator.
  3. Or connect the Kindle over USB, rename `koreader.sh` in the `koreader/` folder, perform option 1, then restore the filename.

## Notes

  - The extension keeps Amazon’s UI alive to maintain reliable startup.
  - Re-run the installer after KOReader updates if the autolaunch script changes.

## Links

  - [Project Repository](https://github.com/meepcat55/Kindle-KOReader-On-Boot)

## Credits

  - Developed by meepcat55
