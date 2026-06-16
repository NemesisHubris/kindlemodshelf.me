# Telnet for Kindle – Remote Command Line Tool

> **Telnet for Kindle** gives you quick remote CLI access to a jailbroken Kindle over your local network. Opens a Telnet server on your Kindle — tap the screen to close the session.

:::warning
**Security Note:** Telnet is unencrypted. Only use on secure local networks. For encrypted access, use [SSH via USBNet instead](usbnetlite.html).
:::

## Features

  - Remote shell access over your local network
  - Tap the Kindle screen to close the session
  - Extremely lightweight and fast to launch
  - Useful for debugging, recovery, or remote system management

## Requirements

  - [Jailbroken Kindle](jailbreaking.html)
  - [KUAL or KTerm](kterm.html) to run scripts
  - A computer and Kindle on the same Wi-Fi network

## Installation & Usage

  1. Download **Telnet.sh** from the project repository or release page.
  2. Copy `Telnet.sh` to `/mnt/us/extensions/` on your Kindle.
  3. Run it via KUAL or with this KTerm command:
`sh /mnt/us/extensions/Telnet.sh`
  4. From your computer, use any Telnet client to connect to your Kindle's IP address.
  5. To end the session, tap the Kindle screen.

## Technical Notes

  - Touchscreen event detection cleanly terminates the Telnet server
  - No persistent installation — server stops after session ends
  - Low system resource use, ideal for minimal debugging tasks
