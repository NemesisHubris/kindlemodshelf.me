# usbnetlite (HF Only) — SSH over USB & Wi-Fi

> SSH into your Kindle via Wi-Fi or a USB cable using the streamlined usbnetlite package for hardfloat devices.

## Download

[**usbnetlite releases on GitHub**](https://github.com/notmarek/kindle-usbnetlite)

## Install via MR Package

  1. **Download** the correct `update_*.bin` file for your firmware version from the usbnetlite project’s Releases page.
  2. **Do not extract or unzip** anything — you need the raw `.bin` file.
  3. **Copy** the `.bin` file into the `mrpackages` folder on your Kindle’s USB storage (create `mrpackages` if it doesn’t exist).
  4. On your Kindle, open **KUAL** → go to *Helper → Install MR Packages*. This will install the `.bin` you placed in `mrpackages`.
  5. Optional: type `;log mrpi` in the Kindle search bar to check MR installer logs if troubleshooting is needed.
  6. Once installed, usbnetlite will appear in the KUAL menu and can be launched from there.

## Connection Info (default config)

Edit the config file if needed (can be done in KOReader). Default login credentials are:

    username: root
    password: kindle

Once usbnetlite is running, you can enable/disable USB networking directly from KUAL.

## Quick Launch

  - Install the MR package as described above.
  - Open KUAL → find **usbnetlite** in the menu → launch.
  - Use the KUAL interface to toggle USB networking.

## Notes

  - This page contains only the minimal, corrected steps — always follow the project’s Releases for firmware-specific builds.

## Credits

[notmarek](https://github.com/notmarek)
