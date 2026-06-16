# KPomo

> **KPomo** is a lightweight Pomodoro focus timer for Kindle that runs entirely in the browser with no dependencies.

## Download

  - [KPomo GitHub Releases](https://github.com/crizmo/KPomo/releases)

## Features

  - 25-minute work sessions with 5-minute short breaks, configurable in the UI.
  - Start, pause, and reset controls.
  - Simple countdown display tuned for Kindle screen size.
  - No external dependencies, just pure HTML, CSS, and vanilla JavaScript.
  - Installs as a Kindle booklet using the same packaging pattern as KWordle.

## Requirements

  - A Kindle with booklet or KUAL support.
  - A USB connection to your computer.
  - For older Kindles on firmware `5.6.1.1`, use the `-legacy` zip.

## Installation

  1. Download the latest release from the [KPomo GitHub releases page](https://github.com/crizmo/KPomo/releases), or build it yourself.
  2. Connect your Kindle to your computer via USB.
  3. Copy the entire `kpomo` folder and `kpomo.sh` file into the `Documents` folder on your Kindle.
  4. Safely eject your Kindle.
  5. Open the KPomo booklet from your library to launch the timer.

## Usage

  1. Tap **Start** to begin a 25-minute work session.
  2. When the session ends, tap **Start Break** to begin a 5-minute break.
  3. Use **Pause** to pause or **Reset** to restart the current session.
  4. Adjust work and break durations directly in the center of the UI.

## Notes

Optionally disable the screensaver to keep the timer visible:

    lipc-set-prop com.lab126.powerd preventScreenSaver 1

The timer may continue running in the background during screensaver mode, but this is not fully tested.

## Credits

Developed by **[crizmo](https://github.com/crizmo)**.
