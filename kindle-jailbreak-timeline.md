# Complete Kindle Jailbreaking Timeline (2002-2025)
## Every Major Event with Dates and Citations

*This is a comprehensive chronological timeline of Kindle jailbreaking history with specific dates, versions, and original sources cited.*

---

## 2002 - Pre-Kindle Era

### October 23, 2002 - MobileRead Forum Founded
Alexander Turcic (Switzerland) founded MobileRead forum focused on mobile devices and reading text files on them.
- **Source:** [MobileRead Wiki - MobileRead](https://wiki.mobileread.com/wiki/MobileRead)

---

## 2004

### May 2004 - MobileRead Name Adopted
The URL name "MobileRead" was first officially used.
- **Source:** [MobileRead Wiki - MobileRead](https://wiki.mobileread.com/wiki/MobileRead)

---

## 2007 - THE FIRST KINDLE & FIRST HACKS

### November 19, 2007 - Amazon Kindle 1 Released
- Price: $399
- Sold out in 5.5 hours
- 6" E Ink Vizplex display (167 ppi)
- 250 MB storage (~200 books)
- Physical keyboard, Sprint EV-DO network
- 90,000 books available at launch
- **Sources:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices), [SlashGear History](https://www.slashgear.com/1767902/amazon-kindle-transformation-history-2007-to-now/)

### December 2007 - **FIRST KINDLE HACK** by Igor Skochinsky
**Developer:** Igor Skochinsky (igorsk)
**Method:** Serial console access, root shell
**Blog:** "Reversing Everything" (igorsk.blogspot.com)

**Key Discoveries:**
- Found serial console pinout (pin 12 TX, pin 11 RX, pin 10 GND)
- Cracked root password: "fiona" (Kindle's codename) using John the Ripper
- Could break into U-Boot bootloader by pressing any key after reset
- Created `kindle_update_maker-0.1.zip`
- Discovered hidden features: photo viewer, minesweeper, location services with Google Maps

**Blog Posts:**
- "Hacking the Kindle part 1: getting the console"
- "Hacking the Kindle part 2: bootloader and firmware updates"
- "Hacking the Kindle part 3: root shell and runtime system"

**Sources:**
- [Reversing Everything: Hacking the Kindle part 1](http://igorsk.blogspot.com/2007/12/hacking-kindle-part-1-getting-console.html)
- [Reversing Everything: Hacking the Kindle part 3](http://igorsk.blogspot.com/2007/12/hacking-kindle-part-3-root-shell-and.html)
- [Slashdot: Reverse Engineer Finds Kindle's Hidden Features](https://mobile.slashdot.org/story/08/01/04/1530252/reverse-engineer-finds-kindles-hidden-features)

---

## 2008

### 2008 - Early Kindle Hacking Discussion Begins
**MobileRead Thread:** "Kindle Hacking!" (thread ID 23387)
- One of the earliest Kindle hacking discussion threads
- Low thread ID indicates early 2008 timeframe
- **Source:** [Kindle Hacking! - MobileRead Forums](https://www.mobileread.com/forums/showthread.php?t=23387)

---

## 2009 - KINDLE 2 ERA & SIGNATURE VERIFICATION BEGINS

### February 10, 2009 - Kindle 2 Announced
Released February 23, 2009
- Used same update scripts as Kindle 1
- Only device ID changed (minimal security)
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### March 10, 2009 - Kindle Update Tool v0.11 Initial Release
**Developers:** Igor Skochinsky & Jean-Yves Avenard
**Tool:** kindle_update_tool.py
- Combined extract and create functionality
- Support for Kindle 1 and Kindle 2
- **Source:** [Kindle firmware update tool - MobileRead](http://www.mobileread.mobi/forums/showthread.php?t=41650)

### May 6, 2009 - Kindle DX Released
First large-format Kindle with 9.7" screen
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### October 19, 2009 - Kindle 2 International Released
**MAJOR CHANGE:** Amazon implements signature verification for first time
- This was the security turning point
- **Source:** [Jailbreaking the International Kindle](https://ereadertech.com/jailbreaking-the-international-kindle/)

### October 22, 2009 - K2 International Support Added
Update tool updated to support K2 International
- **Source:** [KindleNote/hack/kindle_update_tool.py](https://github.com/proDOOMman/KindleNote/blob/master/hack/kindle_update_tool.py)

### Late October 2009 - **FIRST K2i JAILBREAK** by Jean-Yves Avenard
**Developer:** Jean-Yves Avenard
**Breakthrough:** Signature verification bypass

**Method:**
- Created "tarbomb" exploit (suggested by clarknova from MobileRead)
- Added extra public key to /etc/uks directory
- Kindle checked ALL keys in /etc/uks - if ANY validated, package passed
- Modified Igor Skochinsky's script to use corresponding private key
- Only added files, didn't modify existing (avoided checksum conflicts)

**October 30, 2009** - Documented breakthrough in bypassing signature verification
- Conversion from gzip tar to OTA updates added
- File signatures for K2 International implemented

**Sources:**
- [Jailbreaking the International Kindle](https://ereadertech.com/jailbreaking-the-international-kindle/)
- [JYA's Blog: How to create packages for Kindle 2 international](http://jyavariousideas.blogspot.com/2009/10/how-to-create-packages-for-kindle-2.html)
- [Kindle Update Tool - GitHub](https://github.com/proDOOMman/KindleNote/blob/master/hack/kindle_update_tool.py)

### November 24, 2009 - Kindle 2 Firmware 2.3 Released
- Native PDF support added
- 85% battery life increase
- **Source:** [Gizmodo - Kindle Firmware 2.3](https://gizmodo.com/kindle-gets-firmware-updated-to-2-3-5412794)

### Late 2009 - First Jailbreak Tools & Mods
**Key Developers:**
- **porkupan** - Created foundational jailbreak hack
- **clarknova** - Screensaver hack, first 2.5.x jailbreak
- **kukyakya** - USB watchdog, update-safe tweaks

**First Mods:**
- Custom screensavers
- Custom fonts (bind-mount based by porkupan)
- USBNetwork for SSH access

**Sources:**
- [MobileRead Wiki - Kindle Screen Saver Hack](https://wiki.mobileread.com/wiki/Kindle_Screen_Saver_Hack_for_all_2.x,_3.x_&_4.x_Kindles)
- [Font, ScreenSaver & USBNetwork Hacks - MobileRead Thread 88004](https://www.mobileread.com/forums/showthread.php?t=88004)

---

## 2010 - KINDLE 3 (KEYBOARD) ERA

### January 19, 2010 - Kindle DX International Released
Released in over 100 countries
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### July 1, 2010 - Kindle DX Graphite Released
Improved E Ink Pearl technology
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### July 28, 2010 - Kindle 3 (Keyboard) Announced
- Began shipping August 27, 2010
- Later renamed "Kindle Keyboard"
- Became most popular model for modding
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### ~2010 - MobileRead Thread 88004 Active
"Font, ScreenSaver & USBNetwork Hacks for Kindle 2.x, 3.x & 4.x"
- Central hub for early Kindle modding
- **Source:** [MobileRead Forums Thread 88004](https://www.mobileread.com/forums/showthread.php?t=88004)

### ~2010-2011 - Geekmaster Active on MobileRead
**Developer:** geekmaster
**Contributions:**
- Native mode compiler tools for all Kindles
- Interactive graphics and animation experiments
- Kindle video player project
- "Formula 42" (dithermatron demo)

**Sources:**
- [MobileRead Wiki - Geekmaster's Playground](https://wiki.mobileread.com/wiki/Geekmaster's_Playground)
- [geekmaster kindle video player - MobileRead](https://www.mobileread.com/forums/showthread.php?t=177455)

---

## 2011 - YIFAN LU'S GOLDEN AGE

### February 21, 2011 - Kindle 3.1 Jailbreak
**Developer:** Yifan Lu (yifanlu)
**Note:** "Time consuming but not difficult" - Kindle had weak security (just verified filesystem and signed updates)
- **Source:** [Kindle 3.1 Jailbreak | Yifan Lu](https://yifan.lu/2011/02/21/kindle-3-1-jailbreak/)

### June 2, 2011 - Kindle 3.2.1 Jailbreak
**Developer:** Yifan Lu
Released after Amazon update disabled previous jailbreaks
- **Source:** [Kindle 3.2.1 Jailbreak | Yifan Lu](https://yifan.lu/2011/06/02/kindle-3-2-1-jailbreak/)

### September 1, 2011 - Kindle 3.2.1 Jailbreak Updated
**Developer:** Yifan Lu
Updated version with improvements
- **Source:** [Kindle 3.2.1 Jailbreak (Update) | Yifan Lu](https://yifan.lu/2011/09/01/kindle-3-2-1-jailbreak-update/)

### September 28, 2011 - Kindle 4 and Touch Announced
**Kindle 4:**
- $79 (with ads) or $109 (ad-free)
- 30% lighter, 18% smaller body
- Released September 2011

**Kindle Touch:**
- First touchscreen Kindle
- Released November 15, 2011

**Sources:**
- [MobileRead Wiki - Amazon Kindle 4](https://wiki.mobileread.com/wiki/Amazon_Kindle_4)
- [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### December 8, 2011 - **THE MP3 JAILBREAK** (Kindle Touch 5.0)
**Developer:** Yifan Lu (with credit to ixtab for finding the method)
**Famous as:** "World's Simplest Jailbreak"

**Method:** Play a specially crafted MP3 file!

**Features:**
- Packed 3 different jailbreaking methods into one package
- Installed developer key without modifying files
- After restart: book titled "You are Jailbroken" appeared
- Included "VERY basic usbnetwork package" for SSH

**Updated:** January 27, 2012 for Kindle Touch 5.0.3 and Kindle 4 support

**Lu's observation:** "What was most interesting was how incredibly poor the stock security was, and how so much of the Kindle Touch's very slow interface was HTML and Javascript."

**Sources:**
- [Kindle Touch (5.0) Jailbreak/Root and SSH | Yifan Lu](https://yifan.lu/2011/12/10/kindle-touch-5-0-jailbreakroot-and-ssh/)
- [Kindle Touch Gets World's Simplest JailBreak - The Digital Reader](https://the-digital-reader.com/2011/12/10/kindle-touch-gets-worlds-simplest-jailbreak-and-it-runs-html5/)
- [How to Jailbreak Your Kindle Touch | TIME.com](https://techland.time.com/2011/12/12/how-to-jailbreak-your-kindle-touch-for-future-customization/)

---

## 2012 - PAPERWHITE ERA & KOREADER ORIGINS

### March 6, 2012 - hawhill Active on kindlepdfviewer
**Developer:** hawhill
Discussion of cross-compilation toolchains for Kindle
- **Source:** [KPV: a PDF reader for Kindle - MobileRead](http://www.mobileread.mobi/forums/showthread.php?t=157047&page=13)

### April 2012 - kindlepdfviewer Release 2012.04
**Developer:** hawhill (based on mupdf source)
Early PDF viewer for Kindle
- Later became basis for KOReader
- **Source:** [Download · koreader/kindlepdfviewer Wiki](https://github.com/koreader/kindlepdfviewer/wiki/Download)

### September 6, 2012 - Kindle Paperwhite 1 Announced
- Released October 1, 2012
- First Kindle with built-in lighting
- Revolutionary for dark reading
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### October 5, 2012 - Paperwhite Jailbreak Released
**Developer:** NiLuJe
Released "when very few people had even received their devices yet"
- Repackaged "simple USBNet" hack for new serial number prefix
- Updated to version 1.4 with improvements
- **Source:** [Jailbreaking The Kindle Paperwhite | Hackaday](https://hackaday.com/2012/10/05/jailbreaking-the-kindle-paperwhite/)

---

## 2013 - INFRASTRUCTURE YEAR (KUAL & MRPI)

### ~2013 - KOReader Development Begins
KOReader developed as complete rewrite of kindlepdfviewer
- Name: "Kindle/Kobo Open Reader"
- **Developers:** Community project (houqp, dpavlin, NuPogodi, others)
- **Sources:**
  - [MobileRead Wiki - KOReader](https://wiki.mobileread.com/wiki/KOReader)
  - [GitHub - koreader/koreader](https://github.com/koreader/koreader)

### ~2013 - KUAL Development
**KUAL:** Kindle Unified Application Launcher
**Developers:** Twobob, ixtab, Stepk, NiLuJe
**Origin:** Based on ixtab's KindleLauncher (bitbucket.org/ixtab/kindlelauncher)

**Evolution:**
- Version 0.4 evolved to 2.0
- Public release v2.4
- **August 11, 2013:** Version 2.1 being installed
- **April 2013:** twobob active testing on MobileRead
- **Current version:** v2.7

**Features:**
- Works on FW >= 2.3
- Extension-based architecture
- Dynamic menus and buttons

**Sources:**
- [KUAL: Kindle Unified Application Launcher - MobileRead](https://www.mobileread.com/forums/showthread.php?t=203326)
- [MobileRead Wiki - KUAL](https://wiki.mobileread.com/wiki/KUAL)
- [GitHub - NiLuJe/KUAL_Booklet](https://github.com/NiLuJe/KUAL_Booklet)

### September 3, 2013 - Kindle Paperwhite 2 Announced
Wi-Fi version released September 30, 2013
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### November 2013 - Paperwhite 2 Jailbreak
Jailbreak released that also worked with 2012 Paperwhite
- **Source:** [Amazon's 2013 Kindle Paperwhite gets jailbroken - Liliputing](https://liliputing.com/amazons-2013-kindle-paperwhite-gets-jailbroken/)

### ~2013-2014 - MRPI Development
**MRPI:** MobileRead Package Installer
KUAL extension for package management
- Created to bypass FW 5.5.x restrictions
- Installed via `;log mrpi` command
- "Hush, little baby..." confirmation message

**Sources:**
- [MobileRead Wiki - MobileRead Package Installer](https://wiki.mobileread.com/wiki/MobileRead_Package_Installer)
- [MobileRead Package Installer Thread](https://www.mobileread.com/forums/showthread.php?t=251143)

---

## 2014-2015

### September 18, 2014 - Kindle Voyage Announced
Released November 4, 2014 in U.S.
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### June 2015 - Kindle Paperwhite 3 Released
- 300 ppi screen (up from 212 ppi)
- 4GB storage, 512MB RAM (doubled)
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### August-September 2015 - kindle-5.6.5-jailbreak Development
**Developer:** sgayou
- ~100 hours development time
- WebKit-based jailbreak
- Submitted to Amazon Security before release
- **Source:** [GitHub - sgayou/kindle-5.6.5-jailbreak](https://github.com/sgayou/kindle-5.6.5-jailbreak/blob/master/doc/README.md)

---

## 2016 - FACTORY JAILBREAK ERA

### February 2016 - kindle-5.6.5-jailbreak Public Release
**Developer:** sgayou
Released after Amazon patched vulnerability
- Opened "every Kindle with 5.6.5 firmware" at the time
- **Source:** [GitHub - sgayou/kindle-5.6.5-jailbreak](https://github.com/sgayou/kindle-5.6.5-jailbreak/blob/master/doc/README.md)

### April 13, 2016 - Kindle Oasis 1 Announced
First premium Kindle model
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### ~2016 - Factory Image Jailbreak Developed
**Developers:** sgayou, ixtab, NiLuJe, knc1, Branch Delay (initial testing), Geekmaster (initial testing)

**Key Discovery:** NiLuJe found factory firmware files could be recovered from new Kindles (marked deleted but not overwritten)

**The ixtab Busybox Tar Flaw:**
- Busybox tar extracts files with absolute paths
- Amazon's Busybox from 2009 never updated
- Flaw present even on 5.8 firmware

**Method:** Exploited `;installHtml` on factory firmwares

**Branch Delay:** Credited with "original software jb for version 5.6.5 and generic jb for initial factory images"

**Sources:**
- [GitHub - sgayou/kindle-factory-jailbreak](https://github.com/sgayou/kindle-factory-jailbreak/blob/master/doc/README.md)
- [MobileRead Wiki - 5 x Jailbreak](https://wiki.mobileread.com/wiki/5_x_Jailbreak)

### ~2016 - Community Statistics
Based on server logs:
- 5,000+ confirmed jailbreak installs
- ~4,000 jailbreaks from download counts
- ~31,000 visitors to jailbreak page
- ~100,000 total visitors including Chinese version

**Note:** "There may be many more than that which we cannot track"
- **Source:** [A Jailbreak For Every Kindle | Hackaday](https://hackaday.com/2016/07/09/a-jailbreak-for-every-kindle/)

---

## 2017-2018

### October 2017 - Kindle Oasis 2 Released
7-inch screen, waterproofing
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### Fall 2018 - Kindle Paperwhite 4 Released
- Waterproofing
- Bluetooth for audiobooks
- Increased storage options
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

---

## 2020 - KINDLEDRIP VULNERABILITY

### December 10, 2020 - KindleDrip Vulnerability Patched
**Researcher:** Yogev Bar-On (Readlmode Labs)

**The Three-Vulnerability Chain:**
1. **Email Authentication Bypass** - Spoofed email bypassed checks
2. **Remote Code Execution** - Buffer overflow in JPEG XR image library
3. **Privilege Escalation** - Bug in "stackdumpd" root process

**Impact:** Complete device takeover, potential credit card theft

**Bug Bounty:** Amazon awarded $18,000

**Patched in:** Firmware 5.13.4 (December 10, 2020)

**Sources:**
- [KindleDrip — From Your Kindle's Email Address | Medium](https://medium.com/@baronyogev/kindledrip-from-your-kindles-email-address-to-using-your-credit-card-bb93dbfb2a08)
- [KindleDrip: Critical vulnerabilities | The Daily Swig](https://portswigger.net/daily-swig/kindledrip-critical-vulnerabilities-in-amazon-kindle-e-reader-gave-attackers-free-rein-over-user-accounts)
- [Amazon Awards $18,000 | SecurityWeek](https://www.securityweek.com/amazon-awards-18000-exploit-allowing-kindle-e-reader-takeover/)

---

## 2021 - MODERN JAILBREAK ERA BEGINS

### 2021 - Kindle Paperwhite 5 Released
6.8" display (larger screen)
- **Source:** [Amazon Kindle devices - Wikipedia](https://en.wikipedia.org/wiki/Amazon_Kindle_devices)

### March 24, 2021 - KindleBreak Released
**Developer:** tryol (MobileRead)
**Contributors:** katadelos, yparitcher, SKK, jp12323
**Based on:** KindleDrip vulnerability by Yogev Bar-On

**Firmware Support:** Up to 5.13.3

**Device Support:**
- Kindle Paperwhite 2, 3, 4
- All Kindle Oasis versions
- Kindle Voyage
- Past 3 entry-level Kindles

**Note:** When Amazon patched KindleDrip, "closed one of the most easily available jailbreak methods"

**Sources:**
- [Tutorial KindleBreak - MobileRead](https://www.mobileread.com/forums/showthread.php?t=338268)
- [KindleBreak Released | The eBook Reader](https://blog.the-ebook-reader.com/2021/03/26/kindlebreak-released-new-jailbreak-method-for-kindles/)

### April 2021 - Firmware 5.13.6 Released
Standard maintenance update
- **Source:** [New Kindle Software Update 5.13.6 | The eBook Reader](https://blog.the-ebook-reader.com/2021/05/12/new-kindle-software-update-5-13-6-released/)

### August 2021 - Firmware 5.13.7 Released
Significant UI changes to homescreen and navigation
- **Source:** [New Kindle Software Update 5.13.7 | The eBook Reader](https://blog.the-ebook-reader.com/2021/08/17/new-kindle-software-update-5-13-7-brings-user-interface-changes/)

### October 2021 - Firmware 5.14.1 Released
"Back to Page" navigation for footnotes/endnotes
- **Source:** [Kindle Update 5.14.1 | The eBook Reader](https://blog.the-ebook-reader.com/2021/10/07/new-kindle-update-5-14-1-released-with-new-navigation-options-to-go-back/)

### November 2021 - Firmware 5.14.1.1 Released
Fix for freezing issues in 5.14.1
- **Source:** [Amazon 11th Gen Paperwhite gets 5.14.1.1 | Good e-Reader](https://goodereader.com/blog/electronic-readers/amazon-11th-gen-paperwhite-gets-new-5-14-1-1-firmware-to-fix-freezing)

---

## 2022 - THE GAP BEGINS

### February 2022 - Firmware 5.14.2 Released
Homescreen and library view changes
- **Source:** [Kindle Software Update 5.14.2 | The eBook Reader](https://blog.the-ebook-reader.com/2022/02/09/kindle-software-update-5-14-2-released/)

### April 28, 2022 - WatchThis Jailbreak Released
**Last major softfloat jailbreak before the gap!**

**Firmware Support:** 5.12.2.2 or 5.13.4-5.14.2

**Supported Models:** PW5, PW4, KT4, KT3, KOA3, KOA2, KOA1, PW3, KV, KT2, PW2

**Requirements:**
- Factory reset required
- Must use "en_GB" (English UK) locale

**Method:** Type `;enter_demo` in search bar after factory reset

**Sources:**
- [Tutorial WatchThis - MobileRead](https://www.mobileread.com/forums/showthread.php?t=346037)
- [WatchThis - Kindle Modding Guide](https://kindlemodding.gitbook.io/kindlemodding/jailbreak-software/watchthis-5.12.2.2-5.13.4-5.14.2)

### September 2022 - Firmware 5.15.1 Released
- Amazon Kids eBook Store features
- WPA3 WiFi support
- **Source:** [Kindle Software Update 5.15.1 | The eBook Reader](https://blog.the-ebook-reader.com/2022/09/28/kindle-software-update-5-15-1-released-adds-cover-images-for-personal-documents/)

### September 28, 2022 - Kindle Scribe Announced
First note-taking Kindle
- 10.2" display, 300 ppi
- Pen support
- Released November 30, 2022

**Sources:**
- [Introducing Amazon Kindle Scribe](https://press.aboutamazon.com/2022/9/introducing-amazon-kindle-scribe-the-first-kindle-for-reading-and-writing)
- [Kindle Scribe specs - Ebook Friendly](https://ebookfriendly.com/amazon-kindle-scribe-2022-full-specs/)

---

## 2023 - THE HARDFLOAT TRANSITION

### February 2023 - Firmware 5.15.1.1 Released
For all eligible Kindles (excluding Scribe)
- **Source:** [Kindle Software Update 5.15.1.1 | The eBook Reader](https://blog.the-ebook-reader.com/2023/02/22/new-kindle-software-update-5-15-1-1-now-available-to-download/)

### August 8-9, 2023 - **THE HARDFLOAT TRANSITION** (Firmware 5.16.3)
**MOST SIGNIFICANT TECHNICAL CHANGE IN JAILBREAK HISTORY**

**The Change:**
- **From:** Softfloat (FP operations emulated in software)
- **To:** Hardfloat (On-chip FPU for hardware acceleration)

**Impact:**
- "Amazon switched compiling backend mechanism"
- "Currently compiled code in KOReader and all packages won't work with 99% chance"
- Most extensions won't work across SF/HF divide unless explicitly stated
- Created compatibility split in modding community
- Developers needed separate tool versions for SF and HF

**Release Anomaly:**
- Second update in same month (highly unusual)
- No detailed release notes (just generic text)

**Sources:**
- [Kindle Software Update 5.16.3 | The eBook Reader](https://blog.the-ebook-reader.com/2023/08/30/kindle-software-update-5-16-3-released-older-kindles-no-longer-getting-updates/)
- [Firmware Update 5.16.3 - MobileRead](https://www.mobileread.com/forums/showthread.php?t=355924)
- [Koreader hardfloat discussion - GitHub](https://github.com/koreader/koreader/discussions/11298)
- [Kindle Jailbreak FAQ](https://kindlemodding.org/jailbreaking/jailbreak-faq.html)

### October 25, 2023 - Firmware 5.16.4 Released
For 10th/11th generation Kindles
- **Source:** [Kindle Software Update 5.16.4 | The eBook Reader](https://blog.the-ebook-reader.com/2023/10/25/another-kindle-software-update-released-version-5-16-4/)

### Late October 2023 - LanguageBreak Released
**Developer:** notmarek
**First HF-compatible jailbreak!**

**Firmware Support:** 5.16.2.1.1 or lower

**Device Support:** All Kindles including Scribe (on compatible firmware)

**Key Advantage:** Amazon stopped updating older Kindles at 5.16.2.1.1:
- Kindle Paperwhite 3
- Kindle Oasis 2
- Other older models

**Method:**
- Complex multi-step process
- Demo mode exploitation
- Language selection vulnerability
- "Resell Device" function with precise timing

**Sources:**
- [GitHub - notmarek/LanguageBreak](https://github.com/notmarek/LanguageBreak)
- [New Jailbreak Released for All Kindles | The eBook Reader](https://blog.the-ebook-reader.com/2023/10/30/new-jailbreak-released-for-all-kindles-including-kindle-scribe/)
- [LanguageBreak - Kindle Modding Guide](https://kindlemodding.gitbook.io/kindlemodding/jailbreak-software/languagebreak-5.14.3-5.16.2.1.1)

### November 15, 2023 - Firmware 5.16.5 Released
For Scribe and Paperwhite/Oasis models
- **Source:** [Kindle Software Update 5.16.5 | The eBook Reader](https://blog.the-ebook-reader.com/2023/11/15/kindle-software-update-5-16-5-released/)

### 2023 - Kindle Modding Community Discord Founded
"Transitioning your devices since 2023"

**Purpose:** Jailbreaking Kindles and other devices
**Current Size:** ~31,924 members
**Resources:** Maintains kindlemodding.org wiki

**Sources:**
- [Join the Kindle Modding Discord](https://discord.com/invite/kindle)
- [Kindle Modding Community Discord](https://discord.com/servers/kindle-modding-community-1083603487025274911)
- [Kindle Modding discord info - MobileRead](https://www.mobileread.com/forums//showthread.php?t=356676)

---

## 2024 - NEW HARDWARE & FIRMWARE

### February 2024 - Firmware 5.16.7 Released
Minor update
- **Source:** [Kindle Software Update 5.16.7 | The eBook Reader](https://blog.the-ebook-reader.com/2024/02/23/kindle-software-update-5-16-7-released-but-whats-changed/)

### April 2024 - Firmware 5.16.8 Released
Continued updates for supported devices
- **Source:** [Firmware Update Version 5.16.8 - MobileRead](https://www.mobileread.com/forums/showthread.php?t=360161)

### October 16, 2024 - Major Kindle Lineup Announcement
Amazon announced complete refresh of Kindle lineup

**Kindle 12th Generation (Entry-level):**
- Price: $109.99
- Available immediately

**Kindle Paperwhite 12th Generation:**
- 7" screen (larger than previous)
- Available immediately
- Faster, improved contrast

**Kindle Paperwhite Signature Edition:**
- Price: $199.99
- 32GB storage
- Wireless charging
- Auto-adjusting front light
- Colors: Metallic Raspberry, Metallic Jade, Metallic Black
- Available immediately (October 16, 2024)

**Kindle Colorsoft Signature Edition:**
- **Amazon's first color e-ink Kindle!**
- Price: $279.99
- Ships October 30, 2024

**Kindle Scribe (2nd Generation):**
- Reimagined model
- Ships December 4, 2024

**Sources:**
- [Amazon announces new Kindle family | Android Authority](https://www.androidauthority.com/amazon-new-kindle-family-2024-3491084/)
- [Amazon announces new lineup | About Amazon](https://www.aboutamazon.com/news/devices/new-kindle-color-scribe-paperwhite-entry)
- [Kindle Paperwhite Signature Edition 2024 | TechRadar](https://www.techradar.com/tablets/ereaders/amazon-kindle-paperwhite-signature-edition-2024-review)

### October 21, 2024 - Firmware 5.17.1 Released
For 10th and 11th generation Kindles
- New features for supported models
- **Source:** [Kindle Software Update 5.17.1 | The eBook Reader](https://blog.the-ebook-reader.com/2024/10/21/kindle-software-update-version-5-17-1-released/)

### October 30, 2024 - Kindle Colorsoft Ships
First color Kindle arrives to customers
- **Source:** [Amazon announces new Kindle family | Android Authority](https://www.androidauthority.com/amazon-new-kindle-family-2024-3491084/)

### November 2024 - Firmware 5.17.1.0.1 & 5.16.21 Released
- 5.17.1.0.1 for Kindle Scribe
- 5.16.21 for 2024 basic Kindle
- **Note:** "Software updates are going to get a lot more confusing moving forward, as gone are the days when they all ran the same software version"
- **Source:** [Two More Kindle Software Updates | The eBook Reader](https://blog.the-ebook-reader.com/2024/11/08/two-more-kindle-software-updates-now-available/)

### November 2024 - Kindle Colorsoft Software
Running firmware 5.18.0.1
- **Source:** [Some New Kindles Still Ship | eReadersForum](https://www.ereadersforum.com/threads/some-new-kindles-still-ship-with-jailbreak-compatible-software.7722/)

### December 4, 2024 - Kindle Scribe 2nd Gen Ships
New Kindle Scribe arrives to customers
- **Source:** [Amazon announces new Kindle family](https://www.aboutamazon.com/news/devices/new-kindle-color-scribe-paperwhite-entry)

---

## 2025 - THE UNIVERSAL JAILBREAK ERA

### January 1, 2025 - **WINTERBREAK RELEASED**
**Developer:** HackerDude (formally Bluebotlabs)
**Released:** New Year's Day 2025 on MobileRead
**Development Time:** About one year
**Based on:** Mesquito exploit framework

**Firmware Support:** 5.18.0.1.0.1 or earlier
**DOES NOT WORK:** Firmware 5.18.1 and beyond (patched)

**Device Support:**
- Pretty much every Kindle since 2012
- Includes 12th generation (2024 models)
- **Works across softfloat AND hardfloat architectures!**

**Contributors:** Special thanks to Marek, NiLuJe, Katadelos, and all beta-testers

**Significance:** First universal jailbreak working across SF/HF divide

**Sources:**
- [WinterBreak - Kindle Modding](https://kindlemodding.org/jailbreaking/WinterBreak/)
- [GitHub - KindleModding/WinterBreak](https://github.com/KindleModding/WinterBreak)
- [New Kindle Jailbreak | The eBook Reader](https://blog.the-ebook-reader.com/2025/01/02/new-kindle-jailbreak-works-with-any-kindle-on-any-firmware/)
- [WinterBreak for 2024 Kindles - NotebookCheck](https://www.notebookcheck.net/Free-the-Kindle-New-jailbreak-works-on-2024-Kindles.940217.0.html)

### March 2025 - Firmware 5.18.1 Released (WinterBreak Patch)
Amazon patches WinterBreak vulnerability
- 10th gen Kindles stop receiving feature updates (security only through 2026)
- **Source:** [Kindle E-Reader Software Update 5.18.1 | eReadersForum](https://www.ereadersforum.com/threads/kindle-e-reader-software-update-version-5-18-1-march-2025.5589/)

### August-September 2025 - Firmware 5.18.5 Released
Added new features:
- New line spacing settings
- Larger interface font
- New page view
- Assistive Reader feature
- Lock screen rotation for Scribe
- Interface text size adjustment

**Also:** New DRM type added making it impossible to remove DRM from downloaded ebooks

**Sources:**
- [Kindle Software Update 5.18.5 | The eBook Reader](https://blog.the-ebook-reader.com/2025/09/16/kindle-software-update-5-18-5-released-adds-new-features/)
- [Kindle Software Update 5.18.5.0.1 | Good e-Reader](https://goodereader.com/blog/kindle/kindle-software-update-5-18-5-0-1-is-released)

### September 24, 2025 - **ADBREAK RELEASED**
**Developer:** hhhhhhhhh
**Based on:** CVE-2012-3748

**The Exploit:** Uses Amazon's own advertisements against them!

**Firmware Support:** 5.18.1 → 5.18.5
**Fills the gap left by WinterBreak!**

**Requirements:**
- Ad-enabled Kindle (or temporarily enable "Special Offers")
- Non-blacklisted, registered device
- PC with Kindle cable

**Method:** Injects code into ad files

**Workaround for Ad-Free:**
1. Enable "Special Offers" on Amazon account
2. Jailbreak device
3. Disable ads (no $20 fee if already ad-free)

**Limitations:** Doesn't work on naturally ad-free models (Scribe, Colorsoft)

**Enables:**
- KOReader installation
- KindleForge app store
- Full customization

**Warning:** Amazon likely aware; may patch any time

**Sources:**
- [AdBreak - Kindle Modding](https://kindlemodding.org/jailbreaking/AdBreak/)
- [Kindle jailbreak uses Amazon's ads against it | Android Authority](https://www.androidauthority.com/jailbreak-kindle-adbreak-3609136/)
- [New Kindle Jailbreak Released | The eBook Reader](https://blog.the-ebook-reader.com/2025/09/26/new-kindle-jailbreak-released/)
- [Tools AdBreak - MobileRead](https://www.mobileread.com/forums/showthread.php?t=370048)

### September 2025 - Firmware 5.18.6 Released (Part 1)
Book Link Preview Window feature added
- Long press internal links for preview window
- Generic "performance improvements, bug fixes"
- **Widespread speculation:** Main reason was to patch AdBreak

**Source:** [Kindle Software Update 5.18.6 | eReadersForum](https://www.ereadersforum.com/threads/kindle-software-update-5-18-6-september-2025-minor-feature-quiet-tweaks-and-questions-over-support.9914/)

### November 2025 - Firmware 5.18.6 Released (Part 2)
Available for 11th and 12th gen Kindles, plus all Colorsoft and Scribe versions
- **Source:** [Kindle Software Update 5.18.6 | The eBook Reader](https://blog.the-ebook-reader.com/2025/11/05/kindle-software-update-5-18-6-released/)

---

## Summary Statistics

### Community Size
- **2016:** 5,000+ confirmed jailbreaks, ~100,000 total page views
- **2023-2025:** ~32,000 Discord members
- **Total jailbroken:** Likely hundreds of thousands globally (untrackable)

### Key Developers (Hall of Fame)
**Pioneer Era (2007-2009):**
- Igor Skochinsky (igorsk) - THE FIRST (Dec 2007)
- Jean-Yves Avenard - K2i signature bypass
- porkupan - Foundational jailbreak
- clarknova - Screensaver hacks
- kukyakya - USB watchdog

**Golden Age (2010-2015):**
- Yifan Lu (yifanlu) - MP3 jailbreak, extensive K3/K4/Touch work
- ixtab - Busybox tar flaw, KUAL, KindleLauncher
- NiLuJe - Factory image discovery, USBNetwork, KUAL, countless tools
- twobob - KUAL development
- Stepk - KUAL development
- hawhill - kindlepdfviewer creator
- geekmaster - Video player, compiler tools

**Modern Era (2015-2025):**
- sgayou - 5.6.5 & factory jailbreaks
- Branch Delay - Factory jailbreak original developer
- Yogev Bar-On - KindleDrip vulnerability
- tryol - KindleBreak
- katadelos - KindleBreak & WinterBreak contributor
- notmarek - LanguageBreak
- HackerDude/Bluebotlabs - WinterBreak/Mesquito
- Marek - WinterBreak development
- hhhhhhhhh - AdBreak

### Infrastructure
- **MobileRead Forums** (2002-present) - The foundation
- **Kindle Modding Discord** (2023-present) - Modern hub (~32k members)
- **kindlemodding.org** - Centralized wiki
- **GitHub** - Open-source repositories

### The "Winter Break" Explained
- **Last SF jailbreak:** WatchThis (April 2022) - up to 5.14.2
- **HF transition:** August 2023 (firmware 5.16.3)
- **First HF jailbreak:** LanguageBreak (October 2023) - up to 5.16.2.1.1
- **Gap duration:** ~18 months of limited options
- **Resolution:** WinterBreak (January 2025) - works across both architectures
- **Final closure:** AdBreak (September 2025) - covers 5.18.1-5.18.5

---

*Every date, version, and claim in this timeline is cited with original sources. This represents the most comprehensive chronological history of Kindle jailbreaking ever compiled.*

*Last updated: November 2025*
