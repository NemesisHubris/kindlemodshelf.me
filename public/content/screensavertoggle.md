# Screensaver Toggle

> A pair of [Kindle Scriptlets](https://mip-wiki.pages.dev/database/scriptlets/) that stop your Kindle dropping into its sleep screen, and put it back to normal when you are done.

## Download

  - [Download disable_screensaver.sh](../downloads/disable_screensaver.sh) – keeps the screen on
  - [Download enable_screensaver.sh](../downloads/enable_screensaver.sh) – restores normal sleeping

## Requirements

  - [Jailbroken Kindle](jailbreaking.html)

## How to Use

  1. Download both scripts.
  2. Copy them to your Kindle's `documents` folder.
  3. Open **Disable Screensaver** from your library when you want the screen to stay on.
  4. Open **Enable Screensaver** from your library when you are finished.

## Notes

  - Both scripts set one power daemon property over LIPC. Disable runs
    `lipc-set-prop com.lab126.powerd preventScreenSaver 1`, and enable sets the same
    property back to `0`. If you already have a terminal open, that one line is all
    this is — the scriptlets exist so you can tap it from your library instead.
  - **This does not survive a reboot.** `preventScreenSaver` is a runtime property, so
    restarting the Kindle clears it and the screensaver comes back on its own.
  - **Leaving the screen on costs battery.** E-ink draws almost nothing to hold a static
    image, but keeping the device out of suspend does.
  - Nothing is written to disk or patched into the firmware, so a reboot always gets you
    back to stock behaviour.
  - **This is not the ads/Special Offers screen.** To remove those, see
    [Remove Amazon Ads & UI](blockamazon.html).
  - **To change what the sleep screen shows** rather than switch it off, see
    [Custom Screensavers](customscreensavers.html).

## Credit

[**arancool3000**](https://github.com/arancool3000)
