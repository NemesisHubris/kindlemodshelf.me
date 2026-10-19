# Set Up USBNetLite (SSH Over USB)

> A step-by-step guide to getting SSH and SFTP access to your Kindle's file system over USB, or over Wi-Fi, using **usbnetlite**.

:::warning
**This gives you full access to the Kindle's file system.** Be very careful about what you change or delete. Only turn on Autostart (Step 10) after you have confirmed usbnetlite works.
:::

## What You Need

  - A **jailbroken Kindle** that runs hard-float (HF) firmware. Most modern Kindles do. If the installer will not run on your model, the model is not supported (see Step 2).
  - A computer with a USB cable.
  - **MRPI for Kindle HF** from [fw.notmarek.com/khf](https://fw.notmarek.com/khf/).
  - Both `.bin` packages from the [usbnetlite releases page](https://github.com/notmarek/kindle-usbnetlite/releases/tag/1.0.M).
  - **PuTTY**, which includes `puttygen`, and an SSH/SFTP client such as **WinSCP**.

## Install

### Step 1: Install MRPI

Download MRPI for Kindle HF, unpack the archive, and copy its contents to the **Kindle USB root**, the first folder you see when you open the connected Kindle. The `extensions` and `mrpackages` folders should end up there.

### Step 2: Install usbnetlite

Download both `.bin` packages from the releases page and put them in `mrpackages` on the Kindle. Safely eject and unplug the Kindle. Then type `;log mrpi` into the Kindle's search bar and run it. You should see an installation progress screen. MRPI only picks up the package that suits your model.

:::danger
If MRPI fails to install the package, **your model is not supported. Stop here** and ask for help in the Kindle Modding Community Discord.
:::

### Step 3: Make an authorization key

  1. Download PuTTY for your computer and run `puttygen`.
  2. Generate a key. It will ask you to move the mouse at random.
  3. Save the `.ppk` private key somewhere safe on your computer.
  4. Copy the public key text into a new file named `authorized_keys`, with no file extension.
  5. Put that file in `usbnetlite/etc/dropbear/` on the Kindle USB root.
  6. Safely eject and unplug the Kindle.

### Step 4: Windows only: RNDIS driver

Windows needs the generic **RNDIS driver** from Microsoft. It is a common driver and easy to find.

### Step 5: Switch usbnetlite on

With the Kindle **unplugged**, type `;un` into the search bar. The Kindle returns quietly to the home screen.

### Step 6: Connect to the computer

Plug the Kindle in. You should **no longer** see the Kindle USB drive.

:::info
While usbnetlite is switched on, mass storage and MTP are disabled. You cannot copy files the normal way until you switch it off (see "Turning It Off").
:::

### Step 7: Set the computer's IP address

Open the settings for the new Ethernet adapter and set:

  - **IP address:** `192.168.15.100`
  - **Subnet mask:** `255.255.255.0`
  - Leave everything else on the default.

### Step 8: Add the connection in WinSCP (or similar)

Create a new connection, for example `Kindle USB`, with:

  - **Host:** `192.168.15.244` (usbnetlite's default)
  - **Port:** `22`
  - **User name:** `root`, with the password field left empty
  - Under **SSH, Authentication**, point it at the `.ppk` file you saved in Step 3.

### Step 9: Connect

Connect and accept the new-key warning. Check that you can open the Kindle's storage and its command line (PuTTY).

### Step 10: Autostart (only if everything works)

Create an empty file named `auto`, with no extension, in `usbnetlite/` on the Kindle USB root. usbnetlite will then start after every restart.

:::warning
Only do this once you know usbnetlite works. This setting can save a Kindle from a boot loop, so do not skip the testing.
:::

### Step 11: Restart the Kindle

Restart it to make sure everything comes back up.

## Turning It Off

To get mass storage and MTP back, **plug the Kindle in** and type `;un` into the search bar again. If you forget, the Kindle kernel panics and restarts, which is not a big deal. If Autostart is on, usbnetlite starts again after the restart.

## Extra Settings

More settings live in `usbnetlite/etc/config` on the Kindle USB root. Add these lines if they are not there:

  - `KINDLE_IP=192.168.15.244` changes the Kindle's address. Use it if you have several usbnetlite Kindles. Pick an address that differs from the one in Step 7, and update the connection on your computer to match.
  - `USE_WIFI="true"` allows SSH over Wi-Fi. The Kindle and computer must be on the same network. To find the Kindle's IP address, type `;711` into the search bar and scroll down. KOReader also shows it under **Network info** in the Network menu.

Changes only apply after a usbnetlite restart. When in doubt, restart the Kindle.

The project's [README](https://github.com/notmarek/kindle-usbnetlite) lists a default login of `root` / `kindle`. Check it for the current password options.

## Credits

  - Guide: [mergen3107](https://github.com/mergen3107)
  - usbnetlite: [notmarek](https://github.com/notmarek/kindle-usbnetlite)
