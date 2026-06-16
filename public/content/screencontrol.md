# screenControl – Remote Control & Automate Your Kindle

> **screenControl** lets you view and control your Kindle from a browser on your local network.

## Download

  - [screenControl.tar.gz](../downloads/screenControl.tar.gz)

## What Does screenControl Do?

  - **Remote screen viewing:** See your Kindle’s display in real time through your web browser.
  - **Remote control:** Send clicks and interact with the Kindle interface from your computer.
  - Works on both softfloat (SF) and hardfloat (HF) Kindles.
  - No known risk of bricking your Kindle when used as intended.

## Features

  - Connect from any computer or phone using a web browser
  - See live updates of your Kindle screen
  - Click anywhere on the Kindle screen from your browser to interact
  - Automate tasks by sending clicks or scripts
  - Supports both SF and HF Kindle firmwares (tested up to 5.18.x)
  - Perfect for automation, bulk book downloads, or DeDRM workflows

## Installation

  1. **Download:** [screenControl.tar.gz](../downloads/screenControl.tar.gz)
  2. Extract the archive on your computer.
  3. Copy the extracted files to your Kindle’s `/mnt/us/extensions/` directory.
  4. **Optional:** To use from KUAL, make a KUAL-compatible folder/script, or run the .sh script directly in KTerm.
  5. Start the script from KUAL or by running it in your terminal emulator.

## How to Use

  1. **Find your Kindle’s IP address:**
Open KTerm and run `ip a` to display your Kindle’s IP address.
  2. **Connect from your browser:**
On any device on the same network, go to:
`http://[your-kindle-ip]:6789`
(Example: `http://192.168.0.69:6789`)
  3. **Interact with your Kindle:**
The Kindle screen displays in your browser. Click anywhere to control—tap buttons, turn pages, automate actions, or test scripts.

## Tips & Troubleshooting

  - **Not showing up in KUAL?** Make sure the folder/script is placed in `/mnt/us/extensions/`.
  - **Script not appearing as a book?** Only .sh scripts appear as books—make a KUAL wrapper for easier access if needed.
  - **To stop screenControl:** Restart your Kindle, or run `killall screenControlHF` or `killall screenControl` in KTerm.
  - **Lag or slow updates?** Display speed depends on your network and Kindle model.
  - **Safe to use:** There are no known risks of bricking your Kindle when using screenControl as intended.

## Advanced Uses

Developers can use screenControl to test Kindle apps, debug layouts, or automate repetitive tasks.
The tool supports sending click events programmatically, so you can automate actions or integrate it into scripts.

## Notes

  - Compatible with both softfloat (SF) and hardfloat (HF) Kindle firmware.
  - Use screenControl for automated workflows: Automate the downloading of multiple books, DeDRM, or complex interactions without manual taps.

**screenControl** is a unique way to interact with and automate your Kindle wirelessly—control it remotely, automate tasks, and streamline your e-reader workflow.
