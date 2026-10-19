# How Pages Work

Use the Page Builder (`public/pagebuilder.html`) for any normal tool, mod, guide, patch, plugin, or utility page — that's the default.

Skip it only for custom pages: things with special JavaScript or layout, or non-standard pages like galleries, builders, or tool apps (e.g. `index.html`, `images.html`, `pagebuilder.html`, `editor.html`).

## Homepage Categories

Every homepage card belongs to exactly one category. Set it with `data-category` on the card, and put the card in that section:

| `data-category` | Section | What goes there |
|---|---|---|
| `essential` | Essentials | The few tools nearly everyone installs |
| `community` | Community Resources | Wikis, Discord, curated lists |
| `koreader` | KOReader | Plugins, patches, themes and KOReader helpers |
| `games` | Games & Emulators | Games, emulators, interactive fiction |
| `media` | Media & Art | Audio players, drawing apps, screensaver resources |
| `productivity` | Reading & Productivity | Flashcards, notes, timers, converters |
| `tools` | System & Utilities | Shortcuts, file managers, ad/tracking tools, networking |
| `dev` | Development | Terminals, editors, package managers, Linux chroots |
| `guides` | Guides | How-to pages |
| `more` | Experimental & Archived | Untested extras and unmaintained projects |

Each card shows one type tag: App, Tool, Plugin, Patch, Theme, Game, Emulator, Media, Drawing, Guide, Resource, Community, Dev, Archive or Experimental. `data-tags` holds extra search keywords (other names, abbreviations, what it does). Search matches the start of any word in the title, type, description and keywords, and every word you type must match.

`Other Cool Stuff` is for anything unusual, experimental, untested, risky, or hard to categorize — not for normal tools that fit a real category.

## Card Buttons

  - **Download** may go straight to a file or to the project's releases page.
  - **Open** goes to the project's home page (its repository or website), never to a releases page or a file.
  - **More** goes to a page on this site. Use it only when the page adds something the project's own page does not. Small projects with a repository link do not get a page of their own.

## Workflow

1. Use the Page Builder
2. Export the page
3. Add the homepage card if it belongs there
4. Hand-edit only if the page is custom or unusual

Every normal page ends with the standard footer: *Educational purposes only. Not affiliated with Amazon. Users responsible for compliance with applicable laws.*
