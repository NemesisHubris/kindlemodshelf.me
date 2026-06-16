# Gargoyle Interactive Fiction Interpreter

> Experimental interpreter for playing interactive fiction on Kindle.
>  Supports all major IF formats including Z-Machine, Glulx, TADS, and more.

## Download

  - **HF:** [Gargoyle HF on MobileRead](https://www.mobileread.com/forums/showthread.php?t=366347)
  - **SF:** [Gargoyle SF on fabiszewski.net](https://www.fabiszewski.net/kindle-gargoyle/)

---

Hardfloat (HF) Version

## Features

  - Full interactive fiction player for modern Kindles (PW5, firmware 5.16.3+).
  - Supports multiple IF formats: Z-Machine (.z1-.z8), Glulx (.ulx, .blb), TADS (.gam, .t3), and many more.
  - On-screen keyboard with gesture controls.
  - Configurable fonts and typography via garglk.ini.
  - Available as KUAL extension or booklet launcher; see [here](shortcuts.html).

## Requirements

  - Jailbroken Kindle running hardfloat firmware (5.16.3 or newer).
  - KUAL (Kindle Unified Application Launcher) installed for extension method.
  - Kindle Paperwhite 5 or compatible device.

## Download & Install (HF)

  1. Download [gargoyle.zip from the MobileRead forum thread](https://www.mobileread.com/forums/showthread.php?t=366347).
  2. Unzip on your computer.
  3. For KUAL: Place the extracted folder into `/mnt/us/extensions/`.

## How to Run (HF)

  - Starting Gargoyle: Open KUAL and select Gargoyle from the menu.

Softfloat (SF) Version

## Requirements

  - Jailbroken Kindle with softfloat firmware.
  - KUAL (Kindle Unified Application Launcher) installed.
  - Kindle Touch or Paperwhite (older models).

## Download & Install (SF)

  1. Download gargoyle 0.2 (5.6.5) zip package from the [Kindle Gargoyle page](https://www.fabiszewski.net/kindle-gargoyle/).
  2. Unzip on your computer or Kindle.
  3. Place the extracted folder into `/mnt/us/extensions/`.

## How to Run (SF)

Open KUAL and launch Gargoyle from the menu.

## Playing Games

  1. Copy your IF game files to the games folder or any folder that you select.
  2. Launch Gargoyle.
  3. Use the menu to navigate to the game you want to play.
  4. Click on the game and press OK.
  5. To save your game, type `save` in the menu.
  6. To exit the game, type `quit` and confirm with `Y`.

## Troubleshooting

  - **Gargoyle isn't starting!** Check firmware is 5.16.3 or newer. Verify files are in the extensions folder.
  - **Keyboard disappeared!** Two-finger tap on the top right corner of the screen.
  - **Crashes on .dat files** Rename the file to `.z5` to force the glulxe interpreter instead of advsys.

## References

  - [Gargoyle HF port](https://www.mobileread.com/forums/showthread.php?t=366347)
  - [Original Gargoyle project](https://github.com/garglk/garglk/)
  - [Source code for Kindle port](https://github.com/kbarni/garglk/)

## Credits

  - kbarni – HF version (PW5 port)
  - pete330 – SF version base port
  - baf – Original patches
  - Tor Andersson – Original Gargoyle developer
  - Ben Cressey
