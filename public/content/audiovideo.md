# Video + Audio Playback (Experimental)

> **Experimental demo** that pairs **gmplay** video with **SoX** audio on Kindle.
>  Not a polished media player—intended for tinkering and proof-of-concept only.

## Download

  - **HF:** [video-audio-all.zip (Google Drive)](https://drive.google.com/file/d/1633_dfciSHXBJbkhkTucIDFEsM4Z7SLX/view)
  - **SF:** [bad_apple.tar.xz](../downloads/bad_apple.tar.xz)

---

Hardfloat (HF) Demo

## Features

  - Plays `.gmv.gz` video via gmplay with separate audio via SoX.
  - Simple script launcher for quick demos in KTerm.
  - Works when audio and video files match; bundled demo media is not synchronized.

## Requirements

  - Jailbroken Kindle running hardfloat firmware.
  - [KTerm](kterm.html) terminal installed.

## Download & Install (HF)

  1. Download [**video-audio-all.zip (Google Drive)**](https://drive.google.com/file/d/1633_dfciSHXBJbkhkTucIDFEsM4Z7SLX/view).
  2. Unzip on your computer or Kindle.
  3. Place the `videos` folder in your Kindle root (`/mnt/us`).
  4. Place the `vidoe-audio` folder (typo intentional) into `/mnt/us/extensions/`.

## How to Run (HF)

    cd /mnt/us/extensions/vidoe-audio/
    chmod +x playgmvmp3.sh
    ./playgmvmp3.sh

  - The bundled HF demo uses gmplay’s sample video with a separate audio track (not synchronized).
  - To create a synced demo, put matching `.gmv.gz` and `.wav` files in `/mnt/us/videos/` with consistent names, and edit the script if necessary.

Softfloat (SF) Demo

## Requirements

  - Jailbroken Kindle with softfloat firmware.
  - [KUAL](kual.html) (Kindle Unified Application Launcher) installed.

## Download & Install (SF)

  1. Download [bad_apple.tar.xz](../downloads/bad_apple.tar.xz).
  2. Unzip on your computer or Kindle.
  3. Place the `bad_apple` folder into `/mnt/us/extensions/`.

## How to Run (SF)

Open **KUAL** and launch the demo directly from the menu. It plays the included video using gmplay and SoX when supported.

## References

  - gmplay (Geekmaster video): [MobileRead thread](https://www.mobileread.com/forums/showthread.php?t=177455)
  - SoX Media Player: [local page](sox.html) · [MobileRead thread](https://www.mobileread.com/forums/showthread.php?t=336390)

## Credits

  - **[Himbeer](https://www.himbeer.me)** – SF version
  - **kindlemodshelfguy** – HF version
  - **gmplay** by community developers (see thread)
  - **SoX Media Player** by MobileRead community
