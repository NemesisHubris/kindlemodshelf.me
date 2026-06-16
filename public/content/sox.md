# SOX Media Player

> **SOX Media Player** adds Bluetooth audio playback to Kindle for music, audiobooks, and streams. Builds are available for SF and HF firmware.

## Download

  - [SOX Media Player on MobileRead](https://www.mobileread.com/forums/showthread.php?t=368945)

## Features

  - Bluetooth audio playback for music, audiobooks, and internet streams
  - Supports WAV, MP3, FLAC, OGG, AIFF, AU, GSM, RAW, CAF, VOC, W64, WVE, XA, XI, and more
  - Playlist support: M3U, PLS
  - Simple KUAL-based interface
  - Custom internet radio/stream support via editable `menu.json`

## Requirements

  - Kindle with Bluetooth support
  - Jailbroken with [KUAL](kual.html) installed
  - Download either SF (softfloat) or HF (hardfloat) version matching your Kindle firmware

## How to Install

**Install through Kindle Forge (recommended):**

  - Click the download button in Kindle Forge for SOX once installed. It will appear in KUAL automatically.

**Manual installation:**

  1. Visit the [official SOX Media Player thread](https://www.mobileread.com/forums/showthread.php?t=368945) and download the correct zip for your firmware (SF or HF).
  2. Unzip the file on your computer.
  3. Copy the `SOX` folder to `/mnt/us/extensions/` on your Kindle.
  4. Place your music or audiobooks in `/mnt/us/music/` on your Kindle.
  5. Safely eject and disconnect your Kindle.

## How to Use

  1. Pair your Bluetooth audio device with your Kindle via Settings.
  2. Open **KUAL** on your Kindle.
  3. Launch **SOX Media Player** from the KUAL menu.
  4. For internet radio, edit `menu.json` to add custom streams (see the README and forum thread for setup details).

## Notes & Troubleshooting

  - All files in a single playlist or call must share the same format, rate, channels, and bit depth.
  - Bluetooth may sometimes disconnect; if playback freezes, reconnect your device or restart the Kindle.
  - **AAC files are not supported** — playback attempts will fail.
  - Ensure your device is properly paired before launching SOX for smoother performance.

## Credits

dhdurgee
