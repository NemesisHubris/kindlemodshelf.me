# Kindle Forge

> KindleForge is an on-device app store for jailbroken Kindles. Install apps like KOReader without manual file copying.

## Download

- [Kindle Forge on GitHub](https://github.com/KindleTweaks/KindleForge/releases)

## Video Overview

![video](https://www.youtube.com/watch?v=I29vVhx1e68)

## Main Features

- On-device GUI for discovering and installing packages and scriptlets
- Install/uninstall directly from the app
- Basic version awareness for selecting the correct builds where applicable, so you don't have to worry about downloading the wrong version

::: warning
Kindle Forge requires a jailbroken Kindle. If you haven't jailbroken yet, see the jailbreak guide first.
:::

## Installation

1. Download from [Kindle Forge releases](https://github.com/KindleTweaks/KindleForge/releases)
2. Unzip `KindleForge.zip`
3. Plug your Kindle into your computer
4. Copy `KindleForge` and `KindleForge.sh` into the `documents` folder on your Kindle
5. Safely eject your Kindle
6. On your Kindle home screen, within a few seconds, you should see Kindle Forge appear as a "book"
7. Open the book and install

## Usage & Troubleshooting

- To reload the app store and check for new apps, click the three dots at the top of the page and click reload
- If the UI behaves oddly, try reloading the page (reload several times) and reboot the device
- Some packages install a scriptlet (launcher) by default; others install to KUAL — behavior varies per package

## Questions and Support

- Kindle Forge has its own Discord: [https://discord.gg/aSG3eMsAsW](https://discord.gg/aSG3eMsAsW)

## FAQ

### Q: The KindleForge scriptlet doesn't appear!

A: Ensure you have copied `KindleForge.sh` into your `documents` folder. If the scriptlet still isn't showing, reinstall the latest hotfix:

1. Turn on aeroplane mode
2. Restore OTAs
3. Download the latest hotfix from the wiki, copy to Kindle root
4. Update your Kindle
5. Run the hotfix
6. Rename OTAs
7. You can use WiFi once more

### Q: When I click on the scriptlet, it says "Application Error!"

A: Chances are you've installed KindleForge incorrectly. **Both** the folder AND scriptlet must be in the `documents` folder on your Kindle.

### Q: I keep getting core dumps & crashlogs when using KindleForge/Scriptlets!

A: You must be on the latest hotfix, 2.3.1+. Use these steps to reinstall:

1. Turn on aeroplane mode
2. Restore OTAs
3. Download the latest hotfix from the wiki, copy to Kindle root
4. Update your Kindle
5. Run the hotfix
6. Rename OTAs
7. You can use WiFi once more

### Q: No apps load and I'm getting "Unknown ABI!"

A: This happens commonly after fixing the core dump issue. Use the **Update KForge** functionality in-app to resolve. Also try reboots and refreshes. This requires WiFi.

## Note from the Author

This is an essential tool for new jailbroken Kindles, especially for those who have not jailbroken before! We **highly recommend** you use it. Penguins will continue to add mods as people give permission.

## Credits

- Created and maintained by [Penguins](https://ko-fi.com/penguins186)
