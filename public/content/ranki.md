# RAnki

> **RAnki** is a minimal flashcard reviewer for Kindle e-readers, powered by the real Anki backend.

:::danger
**Beta warning:** Experimental software. Back up your Anki data before use.
:::

## Download

  - [Download RAnki](https://github.com/crazy-electron/ranki/releases)

## Current Features

  - Login support that stores an auth token only (never your password)
  - Deck sync with Anki backend
  - Media download from synced decks
  - Card review flow on Kindle
  - Bury cards while reviewing

## Installation

  1. Download `ranki.zip` from the releases page and unzip it.
  2. Copy the extracted files to `/mnt/us/extensions` like any other KUAL extension.
  3. Launch RAnki from KUAL.
  4. Optional: copy `shortcut_ranki.sh` to `/mnt/us/documents` so it also shows in your Kindle library.

## Important Warnings

  - Sync downloads all media linked to your decks.
  - If your decks contain large image or audio sets, check media size first.
  - This is experimental software and behavior may change between releases.
  - Always keep external backups of your Anki collection and media.

## Notes

  - Technical details and project notes: [github.com/crazy-electron/ranki](https://github.com/crazy-electron/ranki)
  - Audio support has not been tested yet.
  - Only normal/basic card types were tested.
  - Image Occlusion cards are not supported.
  - Kindle WebKit is old, so advanced CSS/layout-heavy card templates may render incorrectly.

## Credit

  - [crazy-electron](https://github.com/crazy-electron)
