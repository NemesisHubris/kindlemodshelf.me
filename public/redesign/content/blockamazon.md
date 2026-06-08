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

## Step 3: Delete Recommended Book Images

:::warning
After the first two steps, you may still see a row of recommended books. This step removes the **images** for those books. The row itself may still show, just blank.

MonkeyInPrivite tested this and reported: *"only got the images for the books to go away — recommended books still there, just no images."*

[See the Discord thread](https://discord.com/channels/1083603487025274911/1360078377964408904/1435028457632563240) for more context.
:::

:::danger
**DISCLAIMER:** This requires modifying rootfs. I am not responsible for bricked Kindles.
:::

1. Open KTerm and run: `mntroot rw`
2. Navigate to `/app/KPPMainApp/res/KPPHome/non-ku-asset/US`
   *(The country code may differ depending on where your Kindle is registered.)*
3. Delete all files in that folder.
4. Run: `mntroot ro`
5. Restart your Kindle.
