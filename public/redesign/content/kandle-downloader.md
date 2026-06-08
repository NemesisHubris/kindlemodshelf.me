# Kandle Downloader

> **Kandle Downloader** lets you download manga from your own Amazon Kindle library through the Kindle Web Reader.

:::warning
**Initial Alpha Testing Release** — expect rough edges and known issues.
:::

## Download

  - [Download kandle-downloader.js](https://github.com/Alexia/kandle-downloader/releases/latest/download/kandle-downloader.js)

## Features

  - Downloads manga from your Kindle library via `read.amazon.co.jp` and `read.amazon.com`.
  - Extracts high quality images from the Kindle Renderer API.
  - Packages downloads into ZIP, CBZ, and EPUB formats.
  - Works as a Tampermonkey or Greasemonkey userscript.
  - Full book support for text and glyphs is planned for a future release.

## Requirements

  - A Tampermonkey or Greasemonkey browser extension.
  - An Amazon account with owned Kindle books.
  - Access to the Kindle Web Reader at `read.amazon.com` or `read.amazon.co.jp`.
  - You must own the books you wish to download, including titles marked "free to read for a limited time".

## Installation

  1. Install [Tampermonkey](https://www.tampermonkey.net/) or Greasemonkey in your browser.
  2. Download [kandle-downloader.js](https://github.com/Alexia/kandle-downloader/releases/latest/download/kandle-downloader.js).
  3. Open your Tampermonkey or Greasemonkey dashboard and import or drag in the `.js` file.
  4. Navigate to `read.amazon.com` or `read.amazon.co.jp` and open a manga you own.
  5. The downloader interface will appear, then select your desired output format and begin.

## Usage

  1. Open the Kindle Web Reader and navigate to a manga you own.
  2. The script injects a download interface into the page.
  3. Select your preferred format: ZIP, CBZ, or EPUB.
  4. Start the download and let the script extract images and package them automatically.

## Known Issues

  1. If an image fails to download, the process continues and may produce an archive with missing or improperly numbered images.
  2. RTL handling in EPUB may be incorrect and is likely a reader compatibility issue rather than a script bug.
  3. Chapter names are present in the generated EPUB XML, but page indexes are currently incorrect.

## Credits

Developed by **[Alexia](https://github.com/Alexia)**.
