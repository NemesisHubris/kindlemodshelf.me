# Kindle Game of Life

> A Kindle Booklet simulating Conway's Game Of Life.

## Download

  - [Download kindle-game-of-life-1.0.0.zip](https://github.com/n0tori/kindle-game-of-life/archive/refs/tags/v1.0.0.zip)

## Requirements

  Kindle is jailbroken
  MRPI installed
  
## Installation

  1. Download the latest release of the repo.
  2. Plug Kindle in PC.
  3. Run `install.sh`
  4. On Kindle enter: `;log mrpi` in search bar.
  5. GameOfLife booklet should appear in library after the Kindle restarts.

## Uninstall

  1. Repeat Install instructions but run `uninstall.sh`

## Build

   1. Clone repo
   2. Install latest version of Maven.
   3. Fetch some jars from your Kindle, either through [SSH](https://wiki.mobileread.com/wiki/USBNetwork) or this [tool](https://cowlark.com/kindle/jarextractor-0.1.zip)
   4. Put them in a folder called lib in the directory.
   5. [Download](https://github.com/NiLuJe/KindleTool) and put *kindletool.exe* in the root of the directory.
   6. Run `mvn install` in the root of the directory.
   7. Enjoy your update packages in the target folder.

## Credit

All credit to this [project](https://github.com/ieb/Signalk_Booklet/tree/master) for their reverse engineering that is used to make this project happen.
