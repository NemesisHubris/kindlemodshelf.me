# Parental Controls for KOReader

> KOReader Time Block limits when children can read in KOReader with customizable reading windows so kids can enjoy ebooks only during the times you approve.

:::danger
**Still in active development:** Time Block may fail to lock KOReader reliably and should not be treated as a guaranteed parental control solution. Expect bugs, missed lockouts, and behavior changes between releases.
:::

## Download

  - [KOReader Time Block Plugin](../downloads/timeblock.koplugin.zip)

## Overview

KOReader Time Block adds parental controls to KOReader, letting you define daily reading hours, set PIN-protected overrides, and keep curious kids from bypassing the rules. It works entirely on-device and is easy to configure after installation.

## Features

  - Define start and end times for when KOReader may be used
  - Lock settings behind a parent PIN with recovery access
  - Enable or disable the schedule without uninstalling
  - Optional manual lock to immediately secure the device

## Requirements

  - KOReader installed on Kindle
  - USB access to copy plugin files

## Installation

  1. Download the plugin archive above and unzip it.
  2. Copy the extracted `timeblock.koplugin` folder into `koreader/plugins/` on your Kindle.
  3. Eject the Kindle safely and launch KOReader.

## Initial Setup

  1. In KOReader, tap the top menu, choose **File Cabinet** , then open **Parental Controls**.
  2. Unlock the settings with the default PIN `0000`; change it immediately via **Change PIN**.
  3. Note the recovery PIN `8642`; use it if the main PIN is forgotten.
  4. Set **Blocking Enabled** to control whether the schedule is active.
  5. Configure the daily **Start Time** and **End Time** that KOReader should allow reading.
  6. Toggle **Enable PIN Override** if you want the parent PIN to temporarily bypass the schedule.
  7. Exit the settings menu to save changes; always lock the settings manually before handing the Kindle back to your child.

## Tips & Best Practices

  - Time Block relocks automatically, but use the lock option after editing to be safe.
  - Enable KOReader’s “launch on boot” option so a reboot does not expose the stock Kindle UI.
  - Store your pin somewhere secure.

## Credits

  - kindlemodshelfguy
  - Plugin authors and maintainers from the KOReader community
