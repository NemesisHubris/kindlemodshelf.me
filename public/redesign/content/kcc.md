# Kindle Comic Converter

> **Kindle Comic Converter (KCC)** converts comics for e-ink readers with device-sized pages, better contrast, and cleaner fullscreen output.

![video](https://www.youtube.com/watch?v=QQ6zJcMF2Iw)

## Download

[**Download KCC on GitHub**](https://github.com/ciromattia/kcc/releases)

Under "Assets" of the latest release, grab:

  - **Windows:** `KCC_*.*.*.exe`
  - **Mac (Apple Silicon):** `kcc_macos_arm_*.*.*.dmg`
  - **Mac (Intel):** `kcc_macos_i386_*.*.*.dmg`

Legacy Windows 7 and older macOS versions are also available. For Flatpak, Docker, and AppImage, see the [installation wiki](https://github.com/ciromattia/kcc/wiki/Installation).

## Key Features

  - Fullscreen pages without margins on e-ink devices
  - Image processing tuned for e-ink: deeper blacks, better contrast, gamma correction
  - Downscales to your device's exact resolution — smaller files with no visible quality loss
  - Right-to-left manga reading with correct page turn direction
  - Proper two-page spread alignment in landscape mode
  - Built-in profiles for 35+ devices (Kindle, Kobo, ReMarkable)
  - Supports webtoon processing mode
  - GUI (Qt6) with drag-and-drop, plus CLI tools for power users

## Supported Formats

**Input:** JPG, PNG, GIF, WebP (in folders), CBZ, CBR, CB7, ZIP, RAR, 7Z, PDF

**Output:** MOBI/AZW3, EPUB, KEPUB, CBZ, PDF

## What It Fixes

KCC avoids common formatting issues — including ones found in Kindle Store purchases:

  - Faded black levels causing low contrast and eyestrain
  - Unnecessary margins at the bottom of the screen
  - Not utilizing the full resolution of larger devices (e.g. Kindle Scribe)
  - Incorrect page turn direction for right-to-left manga
  - Misaligned two-page spreads shifted by 1 pixel in landscape

## How to Use

  1. Drag and drop your files/folders into the KCC window
  2. Select your device profile and adjust settings (hover for tooltips)
  3. Click Convert (hold Shift to change output directory)
  4. Transfer the output file to your device's documents folder via USB

On macOS with a 2022+ Kindle, you may need [Amazon USB File Manager for Mac](https://amazon.com/sendtokindle/mac).

## Prerequisites

  - **KindleGen:** On Windows/macOS, install [Kindle Previewer](https://www.amazon.com/Kindle-Previewer/b?ie=UTF8&node=21381691011) and KindleGen will be auto-detected. See the [wiki](https://github.com/ciromattia/kcc/wiki/Installation#kindlegen) for Linux/troubleshooting.
  - **7-Zip:** Optional but recommended for faster conversions and required for CBR/RAR/7Z input. KCC will prompt you to install if needed.

## Output Format Guide

  - **Kindle:** MOBI (the .mobi file is actually dual MOBI/AZW3)
  - **Kindle DX:** CBZ
  - **KOReader:** CBZ
  - **Kobo:** KEPUB
  - **ReMarkable:** PDF

## FAQ

  - **Should I use Calibre?** No. Calibre doesn't properly support fixed layout EPUB/MOBI. Even modifying metadata in Calibre can break KCC formatting. Transfer files directly via USB instead.
  - **Blank pages?** May happen with PNG on Kindle Scribe or any format on Kindle Colorsoft. Use JPG output for Kindle Scribe.
  - **Panel view not working?** Virtual panel view is enabled in the Aa menu on your Kindle, not in KCC.
  - **Colors inverted?** Disable Kindle dark mode.
  - **Image too dark?** Gamma defaults to 1.8 (darkens). Set gamma to 1.0 to disable.
  - **Huge margins / slow page turns?** You likely modified the file during transfer with a 3rd party app. Drag and drop the final file directly via USB.
  - **macOS can't see Kindle?** Use the official [Amazon USB File Transfer app](https://amazon.com/sendtokindle/mac).

## Tutorials

  - [Installation Tutorial (YouTube)](https://www.youtube.com/watch?v=IR2Fhcm9658)
  - [KCC Wiki](https://github.com/ciromattia/kcc/wiki)

## Important Notes

  - KCC is **not** Amazon's Kindle Comic Creator and is not endorsed by Amazon
  - No jailbreak required — this is a desktop application (Windows, macOS, Linux)
  - The best source files are print-quality DRM-free PDFs (e.g. from Kodansha/Humble Bundle)

## Credits

[Ciro Mattia Gonano](https://github.com/ciromattia) (founder), Paweł Jastrzębski, Darodi, [Alex Xu](https://github.com/ciromattia/kcc) (active maintainer)
