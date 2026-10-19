# Kindle AbiWord

> A native port of the **AbiWord 2.8.6** word processor for the Kindle Scribe, by **kaspar**. Type documents on your Kindle with a keyboard, with spell check, tables, custom fonts and PDF export.

:::warning
**This is an alpha.** It has been tested on a 2022 Kindle Scribe. Expect rough edges, and read the keyboard notes before you plug anything in.
:::

## Download

  - [Release thread on MobileRead](https://www.mobileread.com/forums/showthread.php?t=374237) has the download, `Kindle_Abiword_Alpha_1.5.zip` at the time of writing, and the source code. Attachments on MobileRead may need a free account.
  - You also need [KUALA](https://github.com/kasparcode/kuala) or KUAL to launch it from the extensions menu.

## What It Is

AbiWord is a small, open-source word processor first released in 2002. This port runs the real desktop program on the Kindle, using the same old GTK version as the Kindle's own software. It is not a web page or a simplified editor. It is built for armhf Kindles, and it is aimed at the Kindle Scribe.

## What It Can Do

  - Write and edit documents, with import and export of `.rtf` and `.doc`
  - Export to PDF (the PDFs are image-only, so the text cannot be selected or searched)
  - Custom fonts, word count, copy and paste, and tables
  - Several documents open at once, from the Documents menu
  - Spell check with **F7**
  - Network printing through CUPS, which only starts when you open the Print dialog
  - Uses your Kindle's language
  - Screenshots with **F2**

Screen and device shortcuts:

| Key | Action |
|---|---|
| F12 | Refresh the display |
| Ctrl+F12 | Refresh the canvas (fixes artifacts at page breaks) |
| F9 | Rotate the screen |
| F5 / F6 | Brightness down / up |
| Ctrl+F5 / Ctrl+F6 | Warmth down / up |

## Install

  1. Download and unpack the archive.
  2. Copy the `kindle_abiword` folder to `/mnt/us/` on your Kindle.
  3. Copy the `abiword` folder from the archive's `extensions` folder into your KUAL extensions folder.
  4. Optional: copy the scriptlet from the archive's documents folder into your Kindle's `documents` folder.
  5. Launch it from KUAL. Dialogs work best this way.

Your documents are saved to `/mnt/us/abidocs`. Do not put anything in the `abidocs_folder` placeholder. `launch.sh` creates the real folder on the first run.

## Using a Keyboard

You need a keyboard to write anything long. There are two ways.

  - **USB keyboard:** Works on the 2022 Kindle Scribe, and should work on the 2024 Scribe. The Kindle supplies 5V power to the keyboard. Turn it on under **Help, USB Keyboard**. This is experimental. The app checks for two power chips (MAX20342 and BQ25611D) and will not run without both. Other models may not have them, and the Scribe Colorsoft is reported not to.
  - **Bluetooth keyboard:** Use [kindle-hid-passthrough](https://github.com/zampierilucas/kindle-hid-passthrough), a Bluetooth keyboard host for the Kindle.

:::danger
Stop the USB keyboard service (**Help, USB Keyboard**, or **File, Quit**) **before** you unplug the keyboard and plug in a charger.
:::

## Smaller Screens and Older Kindles

  - **Rotate the screen with F9.** On a Kindle with a smaller screen than the Scribe, some menus and dialogs are cut off in portrait mode, and rotating lets you reach all of them. The 10th-generation Oasis is fine in portrait mode.
  - **If it will not launch** on an older Kindle such as the 10th-generation Oasis, open `launch.sh` and change this one line:

        USE_SYSTEM_LIBS="yes"

    to:

        USE_SYSTEM_LIBS="no"

    The author plans to detect this automatically in a later version.

## Dictionaries

Spell check works. Grammar check is not done yet. To add a language, download its Hunspell dictionary files (the `.aff` and `.dic` pair) and copy them into `/mnt/us/kindle_abiword/dicts` on your Kindle. For example, the [Brazilian Portuguese dictionary](https://github.com/elastic/hunspell/tree/master/dicts/pt_BR) is `pt_BR.aff` and `pt_BR.dic`.

## Known Issues

  - Display artifacts can appear when you move between page breaks. Press **Ctrl+F12**.
  - PDF exports are images, not text.
  - Every launch writes a `run.log`. Attach it when you report a bug.
  - Reports from a PW11 on firmware 5.18.5: it aborted at launch when `ABIWORD_DATADIR` was set, dialogs did not work, the Preferences dialog crashed, and some dialogs were too wide for the screen. Treat other models as untested.
  - Dialogs on some models may need window-title changes. See the [Awesome window manager guide](https://kindlemodding.org/kindle-dev/awesome-window-manager/) on the Kindle Modding Wiki.

## Version History

  - **Alpha 0.2:** Pre-built font cache for a faster first launch, and the icon set cut from 2,442 files to 182.
  - **Alpha 1.5:** A text engine that no longer flashes, system libraries used first, locale detection, CUPS printing, rulers that no longer blink, and AbiWord's own icons in place of the GTK icon files.

## Credits

  - Port: **kaspar**
  - Thanks from the author to the AbiWord team, zampierilucas, kbarni, mergen3107, bfabiszewski, coplate, the KOReader team and the Kindle Modding Wiki.
  - More help and a long running discussion are in the project's thread on the Kindle Modding Community Discord.
