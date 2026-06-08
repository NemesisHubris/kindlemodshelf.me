# Frotz: Interactive Fiction for KOReader

> Play classic and modern text adventure games directly on your e-reader. Interactive fiction is text-heavy, redraws rarely, and runs beautifully on e-ink.

## Download

  - [Frotz.koplugin on GitHub](https://github.com/kbarni/frotz.koplugin/releases)

## What is Interactive Fiction?

Interactive fiction was a major game genre at the dawn of the PC era in the late 1970s and early 1980s. It began with *Colossal Cave Adventure* and exploded with the *Zork* trilogy, which offered a richer parser, deeper puzzles, and larger worlds than anything else at the time. By the late 80s, point-and-click adventure games displaced it from the mainstream.

The genre never died. A dedicated community kept developing IF games with increasingly sophisticated parsers and mechanics no other genre can match. *Counterfeit Monkey* lets you manipulate words instead of objects. *Coloratura* shows the world through an alien that perceives emotions and energies rather than light. Almost all of it is completely free.

E-readers are arguably the ideal IF platform: the text-heavy content is easy on e-ink, screen redraws are minimal, and reading enthusiasts already appreciate good prose.

## Features

- Plays Z-machine games (.z3, .z4, .z5, .z6, .z8, .zblorb, .zlb) — the most common IF format
- Per-game save slots with autosave on close
- Game history with auto-restore on reopen
- Hides the on-screen keyboard when an external keyboard is connected
- Adjustable font size
- Word lookup in dictionaries or Wikipedia, just like in KOReader

## Installation

1. Download the plugin from the [GitHub releases page](https://github.com/kbarni/frotz.koplugin/releases)
2. Unzip and copy the contents into your `koreader/plugins/` folder
3. Launch KOReader, go to **Tools > Interactive Fiction**

:::note
You may need to swap in the correct `dfrotz` binary for your device. Check the [readme](https://github.com/kbarni/frotz.koplugin) for which binary matches your architecture.

| Binary | Architecture | Devices |
|--------|--------------|---------|
| armhf/dfrotz | ARM-HF | Most e-readers, recent Kindles and Kobos |
| armel/dfrotz | ARM-EL | Older Kindles (firmware < 5.16.2) |
| x86_64/dfrotz | x86-64 | Linux desktop |
:::

## Finding Games

- [IFDB](https://ifdb.org/search?browse) — searchable database with reviews, recommendation lists, and contest results
- [IFWiki](https://www.ifwiki.org/Special:Drilldown/Games) — encyclopedia and game directory

## Also on Kindle: Gargoyle

If you want graphics, advanced text formatting, and broader format support, [Gargoyle](https://github.com/kbarni/garglk) is a more polished IF interpreter available for Kindle. Frotz is lighter and integrates directly into KOReader; Gargoyle is a standalone app.

## Further Reading

[Barna's Interactive Fiction Recommendations](https://www.mobileread.com/forums/showpost.php?p=4508221&postcount=31) — curated list of IF games worth playing, from the plugin author himself.

## Credits

Plugin by [kbarni](https://github.com/kbarni/) — GPL v3. Underlying interpreter: [Frotz](https://gitlab.com/DavidGriffith/frotz) by David Griffith.
