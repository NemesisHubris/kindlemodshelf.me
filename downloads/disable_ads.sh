#!/bin/sh
# Name: Enable ADs
# Author: MonkeyInPrivite
# Icon:
echo "################################"
echo "#AD-ENABLER BY MONKEYINPRIVITE#"
echo "# BASED OFF OF MAREK'S SCRIPT #"
echo "################################"
sleep 2
echo "Updating Ad-Supported Status to True"
sqlite3 /var/local/appreg.db 'update properties set value = "true" where name = "adunit.viewable";'
echo "Your kindle is now Ad-Supported!"
echo "Restarting in..."
echo "5"
sleep 1
echo "4"
sleep 1
echo "3"
sleep 1
echo "2"
sleep 1
echo "1"
sleep 1
reboot
