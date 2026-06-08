# Page Header (KOReader Userpatch)

> **KOReader userpatch** that mimics fiction-book page headers at the top of the screen—minimal, elegant, and configurable per book.

## Features

  - Minimal, fiction-style header shown at the top of the screen.
  - Per-book controls: font, size, margin, letter-spacing, and padding.
  - Small-caps friendly; choose any installed font by filename.
  - Chapter-first pages: header hides automatically (like print books).
  - Cover pages: page number hidden (latest update).
  - Optional tweak to hide bottom page number on chapter pages.

## Requirements

  - [KOReader](koreader.html) installed on your Kindle.

## How to Install

  1. Download [2-page-header.lua](../downloads/2-page-header.lua).
  2. On your Kindle, open the KOReader folder. If a folder named `patches` does not exist, create it.
  3. Place `2-page-header.lua` in the `patches` folder.
  4. Restart KOReader.

## Configure

  1. Open the top menu → **Settings (cog)** → **Status Bar** → **Page Header**.
  2. Set **font** (filename only), **font size** , **margin** , **letter-spacing** , and **padding**. These are saved per book.
  3. Prefer a small-caps font for the best look. If body text overlaps, increase the book’s **top margin**.

## Downloads

  - [2-page-header.lua](../downloads/2-page-header.lua)

## Technical Notes

  - **Defaults:** open the Lua file and find `-- Defaults` (around line 20) to set default font, size, margin, and letter-spacing.
  - **Font name:** set the font by filename only (e.g., `EBGaramondSC.ttf`), no paths; some fonts use `.otf`.
  - **Missing font:** if a book references a font you later remove or rename, KOReader will show an error—pick a valid font in settings.
  - **Chapter-first page:** the header intentionally hides and the page number moves to the bottom. To always hide the bottom page number, change `if page_bottom or first_page_of_chapter then` to `if page_bottom then` (around line 677).
  - **Cover page tweak:** ensures the page number no longer shows on cover pages.
  - **Device notes:** reported working well on Kindle Scribe; adjust margins and font size to taste.

## Credits

  - Author: **sandcastles**
  - Based on: `2-reader-header-centered.lua` by **joshuacant** and `2--ui-font.lua` by **sebdelsol**
