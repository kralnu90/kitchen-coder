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
- **Fair checking.** Tickets are tested with several inputs, and chef runs hidden taste tests with different data, so typing out the answer won't pass. Technique checks ignore comments and text inside strings.
- **Hints, not answers.** Up to three hints per ticket, one at a time. When you're wrong, you see what chef wanted next to what you printed.
- **Friendly errors.** Python's error messages are translated into plain English with the line number.
- **Practice station.** A free editor with an Inputs box for `input()` and eight recipe cards to play with. Nothing is marked.
- **Cookbook.** A full Python reference, with a **Try it** button on every example that sends it to the practice station.
- **Chef's voice.** Chef Dorran reads orders out loud using your device's text-to-speech. Toggle it off in the nav bar.
- **Office.** Backup codes to move progress between devices, a voice chooser, feedback, and a confirmed Start again.
- **Installable.** Add it to your home screen and it works offline after the first visit.

## How it works

Everything is a single static page with no build step and no server.

- Real CPython 3.12 runs in the browser through [Pyodide](https://pyodide.org) 0.26.4 (about 10MB, downloaded once from jsDelivr).
- Python runs in a Web Worker (`py-worker.js`). If code runs longer than 5 seconds, the worker is replaced with a fresh one, so the page never freezes.
- `harness.py` runs each attempt in a fresh namespace, feeds `input()` from the checker, records output, and reports errors with the learner's line number.
- `tickets.js` holds every ticket and the marking rules (`judge()`), shared by the page and the test suite.
- Progress and practice code are saved in the browser's `localStorage`, so they stay on that device. Backup codes in the Office move them elsewhere.
- `sw.js` caches the page and the Pyodide engine for offline play.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page: chef, rail, editors, practice station, cookbook, office, styles and script |
| `tickets.js` | All 24 tickets, the recipe cards and the marking rules |
| `py-worker.js` | Loads Pyodide in a background worker and runs code |
| `harness.py` | Runs learner code, handles `input()`, records output and errors |
| `tests/check.js`, `tests/solutions.json` | Test suite: good answers must pass, cheats must fail |
| `manifest.webmanifest` | App name, colours and icons for installing on a phone |
| `sw.js` | Service worker for offline play |
| `icon.svg`, `icon-*.png`, `apple-touch-icon.png` | App icons, including a maskable one for Android |
| `NOTES.md` | Handover notes for the next work session |

## Running it locally

Open `index.html` in a browser. For the offline/install features, serve the folder instead:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Tests

```bash
node tests/check.js
```

Runs every ticket with reference answers (must pass), cheats and common mistakes (must fail) and the untouched starter code (must fail), using the same `harness.py` under CPython 3.12. GitHub runs it automatically on every push (free for public repos).

## Adding a ticket

Tickets live in the `LEVELS` array in `tickets.js`. Each one has a `bark` (what chef says), `lesson`, `notes`, `mistakes`, `task`, `expect`, `starter` code, `tests` and `hints`. Tests can supply `inputs`, `append` extra code for hidden checks, `swap` the starter data for different data (helpers `swapList`, `swapNum`, `swapDict`), mark themselves `hidden` with a `note` for chef's taste tests, or set `anyOrder: true` when line order doesn't matter. `requires` holds regex checks that the right technique was used; they run on the code with comments removed (and with string text blanked, unless the regex contains a quote).

Add a reference answer and a cheat or two to `tests/solutions.json`, then run `node tests/check.js`.

Own files load network-first, so updates reach players without changing `sw.js`. Bump `CACHE` in `sw.js` only when the list of cached files changes.

## License

MIT. See [LICENSE](LICENSE).
