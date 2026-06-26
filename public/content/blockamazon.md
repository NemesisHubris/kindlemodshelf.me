# Remove Amazon Ads & UI

> A three-step guide to fully cleaning Amazon's ads, tracking, and recommended content from your Kindle's home screen.

:::info
**These steps build on each other.** Do them in order: Block Amazon first, then clear the cache, then optionally remove the remaining recommended book images.
:::

## Step 1: Block Amazon

The KUAL extension blocks Amazon tracking, the Kindle Store, and UI ads via `/etc/hosts`.

**Download:** [kindle-kual-blockamazon](https://github.com/mitchellurgero/kindle-kual-blockamazon/releases)

**Installation:**

1. Download and extract the zip above.
2. Copy the `blockamazon` folder into your KUAL Extensions folder (`/mnt/us/extensions/` by default).
3. Open KUAL and run the **Block** function — takes effect immediately.

**Credits:** [mitchellurgero](https://github.com/mitchellurgero)

---

## Step 2: Clear the Ads Cache

Even after blocking Amazon, cached ads can still appear. This script wipes them.

**Download:** [remove_cache.zip](../downloads/remove_cache.zip)

**Installation:**

1. Unzip the file.
2. Move `ClearCache.sh` into the `documents` folder on your Kindle.
3. Move `clear_cache.sh` into the root of your Kindle (`/mnt/us/`).
4. Tap the new "Clear Cache & Thumbnails" book in your library to run it.

To undo, just re-enable the Block Amazon extension.

**Credits:** kindlemodshelfguy, GreenCat777

---
