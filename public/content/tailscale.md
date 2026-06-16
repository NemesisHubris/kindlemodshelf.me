# Tailscale VPN for Kindle

> **KUAL Tailscale VPN Extension** allows you to connect your jailbroken Kindle to your Tailscale network, enabling secure SSH access and remote management.

## Download

  - [Download Tailscale KUAL Extension](https://github.com/mitanshu7/tailscale_kual/releases)

## Requirements

  - [KUAL (Kindle Unified Application Launcher)](kual.html)
  - [USBNetwork Hack](https://www.mobileread.com/forums/showthread.php?t=225030) installed and enabled
  - Set up SSH keys for ease of use

## Installation

  1. Download the repository from the link above.
  2. Get the latest tailscale binaries for the ARM architecture from [Tailscale's official package repository](https://pkgs.tailscale.com/stable/#static). Or see the releases page for a version that worked for the developer.
  3. Place the `tailscale` and `tailscaled` binaries in the `tailscale/bin/` folder of the downloaded repository.
  4. Fill the empty `auth.key` file in the `tailscale/bin/` folder with your [Tailscale Auth Key](https://tailscale.com/kb/1085/auth-keys) to login.
  5. Place the `tailscale` folder (not the `tailscale_kual` folder) into the `extensions` folder on your Kindle.
  6. In the KUAL menu, start **tailscaled** first, wait for about 10 seconds, then start **tailscale**.
  7. After this, Tailscale should add the Kindle to your [Machines page](https://login.tailscale.com/admin/machines) on [Tailscale admin console](https://login.tailscale.com/welcome).
  8. Now you can see the (fairly static) IP address assigned by Tailscale for your Kindle. You can use this IP to SSH: `ssh root@<kindle-ip>`

**Note:** Make sure the Kindle screen is on, else the Kindle sleeps the WiFi. You also cannot connect to Kindle via SSH when it is connected to PC using the cable.

**To reset:** In case you want to restart fresh, remove Kindle from Tailscale admin console, stop Tailscale and tailscaled in KUAL, and delete the logs and new files created in `/extensions/tailscale/bin`. This will reset the state of Tailscale on your Kindle.

## Links

  - [Full guide on GitHub](https://github.com/mitanshu7/tailscale_kual?tab=readme-ov-file)

## Credits

Developed by **[mitanshu7](https://github.com/mitanshu7)**.
