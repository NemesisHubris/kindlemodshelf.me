#!/bin/sh
# Name: Enable Screensaver
# Author: arancool3000
# DontUseFBInk
#
# Restores normal sleep screen / screensaver behaviour by releasing the powerd
# lock that disable_screensaver.sh takes out. Safe to run at any time - if the
# screensaver was never disabled this simply leaves things as they are.

POWERD="com.lab126.powerd"

if ! which lipc-set-prop >/dev/null 2>&1; then
    echo "lipc-set-prop not found - this must run on a jailbroken Kindle."
    sleep 3
    exit 1
fi

if ! lipc-set-prop "$POWERD" preventScreenSaver 0; then
    echo "Failed to re-enable the screensaver."
    sleep 3
    exit 1
fi

# Read the value back so a silent failure does not look like success.
STATE=$(lipc-get-prop "$POWERD" preventScreenSaver 2>/dev/null)
if [ "$STATE" = "0" ]; then
    echo "Screensaver enabled - the Kindle will sleep normally again."
else
    echo "Command accepted but powerd still reports preventScreenSaver=$STATE."
    sleep 3
    exit 1
fi

sleep 2
