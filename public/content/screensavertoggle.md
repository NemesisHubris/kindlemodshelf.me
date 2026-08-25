# Screensaver Toggle – Keep the Screen On

> **Screensaver Toggle** is a pair of small scripts that stop your Kindle dropping into its sleep screen, and put it back to normal when you're done.

## Download

  - [**Download disable_screensaver.sh**](../downloads/disable_screensaver.sh) – keeps the screen on
  - [**Download enable_screensaver.sh**](../downloads/enable_screensaver.sh) – restores normal sleeping

## Requirements

  - [Jailbroken Kindle](jailbreaking.html)
  - [KUAL](kual.html), or any terminal such as [KTerm](kterm.html)

## What These Do

Both scripts set a single powerd property over LIPC:

  - `disable_screensaver.sh` runs `lipc-set-prop com.lab126.powerd preventScreenSaver 1`, which tells the power daemon to hold off the sleep screen. The display stays on and awake.
  - `enable_screensaver.sh` sets the same property back to `0`, handing control back to the Kindle.

Each script reads the value back afterwards, so a command that quietly fails is reported instead of looking like success.

This is useful for anything you want to sit and watch: a dashboard, a wall clock, a photo slideshow, recipe steps on the kitchen counter, or a long stretch of reading on a device with an aggressive sleep timer.

## Installation

  1. **Download** both scripts.
  2. **Copy** them to your Kindle over USB. For KUAL, put each one in its own folder under `/mnt/us/extensions/`; to run them from a terminal instead, anywhere under `/mnt/us` is fine.
  3. **Make them executable** if your terminal complains: `chmod +x disable_screensaver.sh enable_screensaver.sh`

## How to Use

  1. Run **Disable Screensaver** when you want the screen to stay on.
  2. Run **Enable Screensaver** when you're finished.

From a terminal, run them directly:

```
sh /mnt/us/disable_screensaver.sh
sh /mnt/us/enable_screensaver.sh
```

## Notes

  - **This does not survive a reboot.** `preventScreenSaver` is a runtime property, so restarting the Kindle clears it and the screensaver returns on its own. Re-run the disable script after a restart if you still want the screen held on.
  - **Leaving the screen on costs battery.** E-ink itself draws almost nothing to hold a static image, but keeping the device out of suspend does, so expect a noticeably shorter charge.
  - **This is not the ads/Special Offers screen.** To remove those, see [Remove Amazon Ads & UI](blockamazon.html).
  - **To change what the sleep screen shows** rather than switch it off, see [Custom Screensavers](customscreensavers.html).
  - Nothing here is written to disk or patched into the firmware — it's one property on a running daemon, so a reboot always gets you back to stock behaviour.

## Credit

[**arancool3000**](https://github.com/arancool3000)
