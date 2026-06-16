# GNU Nano 8.x for Kindle (HF)

> **Nano 8.x** is a simple terminal editor for HF Kindles. Download `nano.zip`, run `./nano`, set `TERM=linux` over SSH, and use `-f nanorc` for syntax highlighting.

## Download

  - [Download nano.zip](../downloads/nano.zip)

## Features

  - Familiar terminal editing with standard Nano shortcuts (save, exit, search, cut/paste)
  - Small, fast binary suitable for quick on-device edits
  - Optional syntax highlighting via a `nanorc` rules file (use `-f nanorc`)
  - Runs in KTerm or over SSH

## Requirements

  - **Hardfloat (HF) Kindle build only.** The provided binary targets armhf/HF runtime.
  - [KTerm](kterm.html) (on-device terminal) or SSH shell access.
  - External keyboard (Bluetooth or USB) recommended for comfortable editing.

## How to Install

  1. Download: [nano.zip](../downloads/nano.zip).
  2. Extract the archive on your computer or copy the ZIP to the Kindle and extract it there.
  3. Place the extracted folder on the Kindle (for example under `/mnt/us` or `/mnt/us/documents/nano`).
  4. Make the binary executable if needed:

         chmod +x /path/to/nano

  5. If shared libraries are included, keep them next to the binary or ensure they are discoverable at runtime (rpath or `LD_LIBRARY_PATH`).

## How to Run

  - **Run locally on the Kindle:**

        cd /path/to/extracted/folder
        ./nano filename.txt

  - **Run over SSH:**

When launching from a desktop terminal via SSH, set the terminal type first:

        export TERM=linux
        ./nano filename.txt

Setting `TERM` can help Nano handle control keys correctly in SSH sessions.

  - **Enable syntax highlighting:** Provide a nanorc rules file and pass it with `-f`:

        ./nano -f nanorc filename.txt
        # or
        ./nano -f ./nanorc myfile.c

## Troubleshooting

  - **Permission denied** — possible causes:
    - File not executable (`chmod +x ./nano`).
    - Execution disabled on the mount being used; move the binary to a writable mount that permits exec (e.g., `/mnt/us`).
    - Executable ABI incompatible with the device (verify armhf/HF).
  - **Segfaults or immediate exits** — possible causes and checks:
    - ABI or shared library mismatches (ncurses or other libs).
    - Try running with bundled libraries using `LD_LIBRARY_PATH=./` so the binary finds local libraries.
    - Confirm the binary's architecture where possible.
  - **Key/terminal behavior over SSH** — set `TERM=linux` before launching Nano to normalize control-key handling.
  - **Library search path** — ensure libraries are found via rpath or `LD_LIBRARY_PATH`; host-side tools can adjust rpath before transfer if needed.

## Notes

  - The distributed package targets HF (armhf) devices only; it will not work on non-HF/armel builds.
  - Results may vary across firmware versions; verify compatibility with your device and firmware before use.
  - An external keyboard greatly improves the editing experience.
