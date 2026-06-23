# Announcements & Updates

> KindleModShelf updates feed with site news, release notes, and major jailbreak or tool announcements.

## Latest Updates Newest entries sit at the top

06/23/2026 — SpringBreak Jailbreak Released

SpringBreak is a new jailbreak for KT5, PW5, PW5SE, KT4, and PW4 on firmware 5.19.2, 5.19.2.0.1, and 5.18.1.1.1. It also brings KPM support, making `;kpm install koreader` a reality. Big thanks to H^9, Hackerdude, and Scamdotnet. Note: this will not work on any models or firmware versions not listed above.

[SpringBreak Guide](https://kindlemodding.org/jailbreaking/SpringBreak/)

---

05/21/2026 — New Fun Recommendations Page

Added a personal recommendations page for favorite projects and apps, including Audiobookshelf, Still, and Calibre-Web.

[Check out the recommendations page here.](recommendations.html)

---

05/02/2026 — Linus Tech Tips Mention

Linus Tech Tips mentioned Kindle jailbreaking as an option for older devices that are reaching their end of life as Amazon begins to phase out legacy cloud features.

Check out the timestamped segment here: [Linus Tech Tips - Kindle Modding Mention](https://youtu.be/WbFGK-tjiEY?t=427)

---

02/03/2026 — Nosebleed has been released.

A new jailbreak by `hhhhhhhhh` has just been released! It targets Kindle firmware **5.16.4 to 5.18.6** and works on blacklisted and registered mass-storage Kindles.

It has been confirmed to work on 5.18.6 with PW5(SE) and KT5. KOA3 was listed as untested in the guide, but community reports indicate it can trigger on KOA3 running 5.18.2.

Unfortunately this will not work on any MTP devices, such as PW6/KT6. Amazon is already patching the exploit via firmware updates, so enable Airplane Mode immediately to avoid silent OTA updates closing the window.

<https://kindlemodding.org/jailbreaking/Nosebleed/>

---

Firmware 5.19.2 Update (11th Gen and Newer) (posts on 2026-02-17)

Initial concerns were that 5.19.2 might carry over hardened security changes seen on KS3/KSC in 5.19.1, which could have broken hotfix preservation behavior and delayed future jailbreak progress.

Follow-up testing later found impacts were limited: hotfix still technically worked in testing, and the specific hardened security concern did not appear to be copied to other models.

Recommendation is still to avoid updating when possible, fill storage if not jailbroken, and verify OTA binaries are renamed correctly if already jailbroken.

**Source:** scam.net, Kindle Modding Discord.

---

Gallery Update — Basic Image Editing

The [Image Gallery](images.html) now supports resizing and basic editing of images before downloading. Customize screensavers directly in your browser to fit your Kindle perfectly.

**Credit:** Idea by [ebookscreensaver.com](https://www.ebookscreensaver.com/).

---

January 2026 - Ladies and Gentlemen, we got em.

5.19.1 for the Kindle Scribe Colorsoft and Kindle Scribe 3rd Generation was exploited by scam.net, approximately one month after these models released.

### Huge shoutouts go to:

  - @hhhhhhhhh for discovering one small part that ended up being the key to this exploit being possible
  - @kluyg for testing the code on their personal Kindle Scribe 3rd Generation, and being willing to help me test the updated version a week after my first attempt failed spectacularly.

Please do not bother any of the above people, or scam.net, for access to the exploit. You will not get it early.

Much work has to be done to turn this into a functional jailbreak, as many things have been changed by amazon so much existing code no longer works, but a jailbreak will probably be made from this at some point.

**Source:** scam.net, Kindle Modding Discord.

---

December 2025 — New Tools, Games & Guides

### New Pages Added

  - [blockamazon.html](blockamazon.html) helps block unwanted Amazon content on your Kindle.
  - [clearadcache.html](clearadcache.html) provides tools to clear ad caches and optimize performance.
  - [kships.html](kships.html) brings the KShips Battleship game to your Kindle.
  - [universalpaperclips.html](universalpaperclips.html) ports the popular Universal Paperclips game to Kindle.
  - [All Kindle Linux Chroots](all-kindle-linux-chroots.html) (credit: GreenCat-777) compiles a complete guide to Linux environments on Kindle devices.

### Improvements

  - Enhanced UI across the entire site for a more polished and consistent experience.
  - Improved [KAnki Editor](editor.html) with better usability and design.
  - Added more informational pages to help you get the most out of your Kindle.

---

December 2025 — Gallery Overhaul & Site Reorganization

### Images Gallery Complete Redesign

  - The [image gallery](images.html) now displays images in a randomized continuous stream for a cleaner browsing experience.
  - Gallery order refreshes daily so you get a fresh selection of images on each visit.
  - Clicking any image opens a full-size viewer with a sidebar showing all other images by the same author.
  - Placeholder backgrounds now adapt to your light or dark mode theme.
  - Search by author name still shows results in the original grouped layout for easy discovery.

### Site Structure & Navigation

  - Added a new Emulators section to organize all emulator tools in one place.
  - Reorganized Tools into development tools and utilities for better clarity.
  - Top navigation menu now includes quick links to [Gallery](images.html), [Updates](announcements.html), and more.
  - Fixed category filtering to show more accurate results across all tools and guides.

### KOReader Patches Page Updates

  - The [patches page](patches.html) now organizes user patches into logical categories for easier browsing.
  - Essential patches are clearly marked so you can find the most useful ones quickly.
  - Added setup guidance for patches that require special installation steps.

### Credits & Attribution

  - Added proper developer credits to Gambatte emulator pages (Gambatte-K by liim, Gambatte-K2 by crazy-electron).

---

Late October 2025 — KOReader Tools & Extras

### New Pages

  - [patches.html](patches.html) collects KOReader user patches with install steps and compatibility notes.
  - [gpt.html](gpt.html) ships KindleModShelfGPT context packs and the exact prompt text.
  - [peki.html](peki.html) and [bootkoreader.html](bootkoreader.html) document MRPI-free KUAL installs plus KOReader autostart toggles.
  - [timeblock.html](timeblock.html) introduces KOReader Time Block parental controls with a downloadable plugin.
  - [icon.html](icon.html) showcases the hand-drawn KOReader interface pack with matching Project Title icons.
  - [debrick.html](debrick.html) (by MonkeyInPrivite) breaks down how to recover a "bricked" Kindle step by step.

### Content Updates

  - [AdBreak guide](adbreak.html) tightened its layout and copy so the video, summary, and checklist line up cleanly.
  - [KAnki page](kanki.html) now includes a personal maintainer note, clearer install guidance, and editor callouts.
  - [plugins.html](plugins.html), [storagetool.html](storagetool.html), and [kindleforge.html](kindleforge.html) were expanded into deep-dive references with fresh screenshots and download callouts.
  - [Homepage](index.html) call-to-actions highlight KindleModShelfGPT, new KOReader utilities, and the announcements feed.

### Downloads & Assets

  - [timeblock.koplugin.zip](../downloads/timeblock.koplugin.zip) hosts the KOReader Time Block build linked from the new guide.
  - [icons.zip](../downloads/icons.zip) and [projecttitleicons.zip](../downloads/projecttitleicons.zip) provide the hand-drawn UI assets in one place.

---

October 2025 — Full Site Refresh

### Major Updates

  - Completely rebuilt the entire UI from the ground up with a cleaner, more responsive design.
  - Fully rewritten and refreshed all site content — every single page has been updated.
  - Improved the [screensaver gallery](images.html) for faster loading and smoother performance.

### New Pages Added

  - [plugins.html](plugins.html)
  - [kindleforge.html](kindleforge.html)
  - [projecttitle.html](projecttitle.html)
  - [gargoyle.html](gargoyle.html)
  - [nethack.html](nethack.html)
  - [tictactoe.html](tictactoe.html)
  - [audiovideo.html](audiovideo.html)
  - [jarlauncher.html](jarlauncher.html)
  - [textadept.html](textadept.html)
  - [storagetool.html](storagetool.html)
  - [screencontrol.html](screencontrol.html)
  - [nano.html](nano.html)

### Informational Section Started

  - [kual.html](kual.html)
  - [jailbreakonmac.html](jailbreakonmac.html)

### Notes

If you'd like your content removed, prefer to stay anonymous, or notice missing credit or incorrect links, please reach out:

  - Discord: **@kindlemodshelfguy** on the Kindle Modding server
  - Email: [admin@kindlemodshelf.me](mailto:admin@kindlemodshelf.me) (responses may be slower)

---

September 2025 — Launching KindleModShelf Announcements

Welcome! This new announcements page gathers every noteworthy change happening across KindleModShelf. We've added it so you can track fresh jailbreak guides, mod updates, and behind-the-scenes improvements without hunting through individual pages.

Here's what to expect from this feed:

  - Spotlights on new or overhauled guides, including jailbreak walkthroughs and KOReader plugins.
  - Heads-up on refreshed downloads, compatibility notes, or breaking firmware news.
  - Reminders about updated screenshots, assets, or navigation tweaks so the site stays easy to browse on Kindle.

Have something you need us to change? DM **kindlemodshelfguy** on the Kindle Modding Discord or email [admin@kindlemodshelf.me](mailto:admin@kindlemodshelf.me).
