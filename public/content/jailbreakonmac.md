# Jailbreaking on Mac

> Jailbreaking from macOS depends on a reliable USB connection. Determine whether your Kindle needs extra drivers before you begin so the jailbreak scripts can access the device.

## USB Connection Requirements

macOS communicates with Kindles over USB in two distinct ways depending on the device generation. Confirm which workflow applies to you before starting the jailbreak.

## Modern Kindle Devices (USB-C)

Recent Kindle models with USB-C ports expose their storage over MTP (Media Transfer Protocol). macOS does not ship with native MTP support, so you must install an additional utility.

**Required Software:** [Amazon USB File Transfer](https://www.amazon.com/sendtokindle/mac)

  - Installs Amazon’s Send to Kindle application, which bundles the MTP driver.
  - Once installed, your Kindle will appear in Finder and is accessible to jailbreak scripts.
  - Restart both the app and Finder if the Kindle does not mount immediately after installation.

## Legacy Kindle Devices

Older Kindles with micro-USB ports expose their storage as classic USB Mass Storage. macOS supports this natively, so no additional software is required.

  - Connect the Kindle using its micro-USB cable.
  - The Kindle should mount in Finder automatically.
  - If Finder does not display the device, try a different cable or USB port.

## Testing Your Connection

  1. Plug your Kindle into the Mac with a known-good USB cable.
  2. Open Finder and look for the Kindle in the sidebar.
  3. If it appears, you can proceed directly with the jailbreak instructions.
  4. If it does not appear, install the [Amazon USB File Transfer](https://www.amazon.com/sendtokindle/mac) application and reconnect.

Confirming USB access before starting prevents mid-jailbreak interruptions caused by missing MTP support.
