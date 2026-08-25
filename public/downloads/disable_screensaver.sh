#!/bin/sh
# Name: Disable Screensaver
# Author: arancool3000
# DontUseFBInk
#
# Stops the Kindle from dropping into its sleep screen / screensaver, so the
# display stays on. Handy for dashboards, always-on clocks, slideshows and
# long reads where the device keeps nodding off.
#
# This asks powerd to hold a runtime lock. It does NOT survive a reboot -
# re-run it after restarting. Undo it with enable_screensaver.sh.

POWERD="com.lab126.powerd"

if ! which lipc-set-prop >/dev/null 2>&1; then
    echo "lipc-set-prop not found - this must run on a jailbroken Kindle."
    sleep 3
    exit 1
fi

if ! lipc-set-prop "$POWERD" preventScreenSaver 1; then
    echo "Failed to disable the screensaver."
    sleep 3
    exit 1
fi

# Read the value back so a silent failure does not look like success.
STATE=$(lipc-get-prop "$POWERD" preventScreenSaver 2>/dev/null)
if [ "$STATE" = "1" ]; then
    echo "Screensaver disabled - the screen will stay on."
    echo "Run enable_screensaver.sh to restore normal sleep behaviour."
else
    echo "Command accepted but powerd still reports preventScreenSaver=$STATE."
    sleep 3
    exit 1
fi

sleep 2
