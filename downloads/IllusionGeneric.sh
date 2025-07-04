#!/bin/sh
# Name: Illusion
# Author: You
# DontUseFBInk

#Modify Below!
SOURCE_DIR="/mnt/us/documents/..."
TARGET_DIR="/var/local/mesquite/..."
DB="/var/local/appreg.db" #KEEP THIS!
APP_ID="com.x.x"

#DO NOT MODIFY BELOW

#Copy To VAR/LOCAL/MESQUITE
if [ -d "$SOURCE_DIR" ]; then
    if [ -d "$TARGET_DIR" ]; then
        rm -rf "$TARGET_DIR"
    fi
    cp -r "$SOURCE_DIR" "$TARGET_DIR"
else
    exit 1
fi

#Redeclare To APPREG.DB 
sqlite3 "$DB" <<EOF
INSERT OR IGNORE INTO interfaces(interface) VALUES('application');

INSERT OR IGNORE INTO handlerIds(handlerId) VALUES('$APP_ID');

INSERT OR REPLACE INTO properties(handlerId,name,value) 
  VALUES('$APP_ID','lipcId','$APP_ID');
INSERT OR REPLACE INTO properties(handlerId,name,value) 
  VALUES('$APP_ID','command','/usr/bin/mesquite -l $APP_ID -c file://$TARGET_DIR/');
INSERT OR REPLACE INTO properties(handlerId,name,value) 
  VALUES('$APP_ID','supportedOrientation','U');
EOF

echo Registered $APP_ID, You May Now Launch It With LIPC.
sleep 2

#Launch With LIPC
nohup lipc-set-prop com.lab126.appmgrd start app://$APP_ID >/dev/null 2>&1 &
