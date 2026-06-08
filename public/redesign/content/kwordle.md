# KWordle

> **KWordle** brings the classic Wordle puzzle game to your Kindle e-reader. Built for e-ink, KWordle is offline, multilingual, and features clean visuals for black-and-white screens.

## Download

  - [KWordle on GitHub](https://github.com/crizmo/KWordle)

## Features

  - Classic Wordle gameplay — guess a 5-letter word in 6 tries
  - Multilingual: English, French, German, customizable word lists
  - Statistics: win percentage and streaks saved locally
  - Simple visuals optimized for e-ink displays
  - Fully offline — no internet required after installation

## Installation

  1. Download the latest release from [KWordle on GitHub](https://github.com/crizmo/KWordle).
  2. Connect your Kindle by USB and copy the `kwordle` folder and `kwordle.sh` script to your `documents` folder.
  3. Disconnect, then open the KWordle booklet to launch the game.

## How to Play

  1. The game picks a random 5-letter word.
  2. Enter guesses using the on-screen or Kindle keyboard.
  3. After each guess:
■ = correct spot,
□ = wrong spot,
× = not in word.
  4. You have 6 tries. See if you can guess the word!

## Customization

**To add a new language:**

  1. Create lists of guess and valid words, then add them to `words.js`.
  2. Update the language selection in `main.js`.
  3. Replace accented with unaccented letters.

## Credits

[Kurizu](https://ko-fi.com/kurizu)
