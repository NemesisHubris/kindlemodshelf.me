# FULLSCREEN WEB BROWSER

> **Fullscreen Web Browser** launches websites in a minimal fullscreen view on HF Kindles.

## Download

  - [Get it from GitHub Releases](https://github.com/mitchellurgero/kindle-shortcut-browser/releases)

## Features

  - Open any website in a clean, fullscreen view
  - Easily set your homepage to any site you want
  - Minimal interface for maximum reading space
  - Includes a script to stop the browser if needed
  - Designed for Kindle firmware 5.16.4 and newer

## How to Install & Use

  1. Download the latest ZIP: [Get it from GitHub Releases](https://github.com/mitchellurgero/kindle-shortcut-browser/releases)
  2. Extract the contents: Unzip and copy everything to the `/` (root) directory of your Kindle.
  3. Set your website:
     - **Method 1:** Edit `index.html` in the `fullscreenbrowser` folder and change the URL to your desired website.
     - **Method 2:** Edit `documents/shortcut_browser.sh` and set the `FULLSCREEN_SITE` variable to your preferred URL.
  4. Launch the browser: Open the shortcut script from your Kindle’s library to launch the fullscreen web browser.
(Tip: Rename the script for multiple website shortcuts!)

## Options

  - **GO_FULLSCREEN:** Set this to `false` in the script if you want to keep the Kindle’s UI visible instead of true full screen.

## Known Issues

  - Some websites may not load with the `index.html` method (iframe limitation). For best results, use the `FULLSCREEN_SITE` variable in the script.
  - If the browser freezes or stops responding, use the Stop Shortcut Browser script or restart your Kindle.

## Credit

Hyper
