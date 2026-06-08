# Calendar Overlay for KOReader

> **Calendar Overlay** is a KOReader patch that shows upcoming events from an ICS calendar on your Kindle sleep screen.

## Download

  - [2-zzz-calendar-overlay.lua](../downloads/2-zzz-calendar-overlay.lua)

## Main Features

  - Displays upcoming calendar events on sleep screen
  - Multiple display styles: Minimal, Today's Schedule, Tomorrow's Schedule, Full Day
  - Auto-refresh every 30 minutes
  - Works with any ICS calendar feed (Google Calendar, Proton Calendar, iCloud)
  - Configurable through KOReader menu
  - Smart caching prevents excessive network requests

## Installation

  1. Get an ICS link from your calendar provider ([How to get an ICS URL](https://www.onecal.io/blog/how-to-get-an-ics-url-for-your-calendar))
  2. For Proton Calendar users: [Share calendar via link](https://proton.me/support/share-calendar-via-link)
  3. Download `2-zzz-calendar-overlay.lua`
  4. Open the file in a text editor
  5. Paste your ICS link into the `PUT_YOUR_ICS_URL_HERE` spot (line 13)
  6. Plug in your Kindle to your computer
  7. Move the file to `/mnt/us/koreader/patches/` (create the `patches` folder if it doesn't exist)
  8. Safely eject your Kindle
  9. Open KOReader
  10. Go to KOReader and swipe down → Tools → More tools → Calendar Overlay to open menu and enable patch.

## Notes

  - Basically all calendars can be exported as an ICS. Personally tested with Proton Calendar but all others should work.
  - Obviously, you have to have WiFi on to make this work

## Credits

  - [kindlemodshelfguy](https://kindlemodshelf.me)
  - Inspiration from: [WeatherLockscreen](https://github.com/loeffner/WeatherLockscreen)
