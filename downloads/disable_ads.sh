#!/bin/sh
# Name: Disable ADs
# Author: Marek
# Icon:
echo "Removing adunits folder"
rm -rf /var/local/adunits
echo "Removing ad assets"
rm -rf /mnt/us/.assets
echo "Updating appreg.db"
sqlite3 /var/local/appreg.db 'update properties set value = "false" where name = "adunit.viewable";'
echo "Rebooting in 5 seconds :)"
sleep 5
reboot;
