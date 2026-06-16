# Textadept for Kindle

> **Textadept** is a fast HF Kindle editor with GUI and terminal modes, Lua scripting, and syntax highlighting.

## Download

  - [Download textadept.zip](../downloads/textadept.zip)

## Features

  - Multi-buffer editing and split views (side-by-side)
  - Lexer-based syntax highlighting for many languages
  - Command palette for quick commands and actions
  - Completely scriptable and extensible in **Lua**
  - Graphical GTK UI & a lightweight CLI interface that runs in KTerm
  - Small footprint and fast startup — suited to HF Kindle builds

## Requirements

  - **Hardfloat (HF) Kindle build only** — Textadept requires HF runtime support
  - Mesquite / Illusion environment for GUI integration (if using GTK frontend)
  - [KTerm](kterm.html) (terminal) available for CLI usage
  - External Bluetooth keyboard recommended (see Bugs)

## How to Install

  1. Download [textadept.zip](../downloads/textadept.zip)
  2. Either:
     - Unzip on your computer and copy the resulting folder and any included **.sh** launcher to your Kindle's **documents** folder, or
     - Copy the zip to the Kindle and extract it on-device (if you prefer extracting directly on the Kindle).
  3. If there is a launcher script (**.sh**), make it executable and place it in `/mnt/us/documents` so it appears as a tappable "book" on the Home screen.
  4. To run the terminal interface, open KTerm and launch the included CLI binary or wrapper script from the Textadept folder.
  5. For the GUI, launch the supplied GTK frontend (requires Mesquite / Illusion integration and HF runtime).

## How to Use

  - **CLI (KTerm):** Open KTerm and run the included textadept CLI. Ideal when using the Kindle touchscreen + on-screen keyboard or when GTK is not usable.
  - **GUI (GTK):** Launch the GTK interface for mouse-like menus, split panes, and the command palette. Best with an external keyboard for shortcuts.
  - Use the command palette to quickly open files, switch buffers, or run Lua commands.
  - All editor functionality is scriptable — read the included Lua snippets and the manual to extend behavior and add shortcuts.

## Known Issues

  - **Software keyboard bug:** When using the GTK graphical interface, the Kindle's software keyboard may disappear when a modal dialog opens. This is a known GTK integration issue.
  - Workaround: use a Bluetooth/external keyboard or use the KTerm CLI interface until the dialog/keyboard issue is resolved.
  - If you encounter crashes or missing lexers, check the included log or open the CLI to see error output.

## Documentation

  - Read the included **manual** and **API** files in the Textadept folder for usage, keyboard shortcuts, and Lua extension examples.
  - Command palette and keybindings are configurable via Lua — the docs show sample bindings for common editing tasks.

Textadept brings a desktop-grade editing experience to HF Kindles. If you use an external keyboard or prefer terminal workflows, it's a powerful and lightweight editor worth learning.
