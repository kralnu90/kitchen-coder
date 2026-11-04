# Python Kitchen

Learn Python by working the pass. Chef Dorran calls the orders, you write real Python 3 to clear the tickets, and you climb the brigade from Kitchen Porter to Head Chef.

**Play it:** https://kralnu90.github.io/kitchen-coder/

A [Kralnu Games](https://kralnugames.com) project.

## What's in it

- **24 tickets** across four services, each with a short lesson, deeper "Chef's notes", common mistakes, and a task checked against real output:
  - **Breakfast:** `print`, variables, maths, f-strings, `input()`, `int()`
  - **Lunch:** string methods, `if`/`else`, `elif`, `and`/`or`/`not`, `in`
  - **Dinner:** lists, `append`, `for`, `range()`, `while`, running totals, filtering
  - **Late service:** functions, `return`, dictionaries, `.items()`, `try`/`except`, and a boss ticket
- **Fair checking.** Tickets are tested with several inputs, and functions get hidden taste tests, so hardcoding won't pass.
- **Hints, not answers.** Up to three hints per ticket, one at a time. When you're wrong, you see what chef wanted next to what you printed.
- **Friendly errors.** Python's error messages are translated into plain English with the line number.
- **Practice station.** A free editor with an Inputs box for `input()` and eight recipe cards to play with. Nothing is marked.
- **Cookbook.** A full Python reference, with a **Try it** button on every example that sends it to the practice station.
- **Chef's voice.** Chef Dorran reads orders out loud using your device's text-to-speech. Toggle it off in the nav bar.
- **Installable.** Add it to your home screen and it works offline after the first visit.

## How it works

Everything is a single static page with no build step and no server.

- Python runs in the browser through [Skulpt](https://skulpt.org) 1.2.0, loaded from jsDelivr.
- Progress and practice code are saved in the browser's `localStorage`, so they stay on that device.
- `sw.js` caches the page and the Python engine for offline play.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole game: tickets, practice station, cookbook, styles and script |
| `manifest.webmanifest` | App name, colours and icons for installing on a phone |
| `sw.js` | Service worker for offline play |
| `icon.svg`, `icon-192.png`, `icon-512.png` | App icons |
| `NOTES.md` | Handover notes for the next work session |

## Running it locally

Open `index.html` in a browser. For the offline/install features, serve the folder instead:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Adding a ticket

Tickets live in the `LEVELS` array in `index.html`. Each one has a `bark` (what chef says), `lesson`, `notes`, `mistakes`, `task`, `expect`, `starter` code, `tests` and `hints`. Tests can supply `inputs`, `append` extra code for hidden checks, or set `anyOrder: true` when line order doesn't matter. `requires` holds regex checks that the right technique was used.

After changing files, bump `CACHE` in `sw.js` so installed copies pick up the update.

## License

MIT. See [LICENSE](LICENSE).
