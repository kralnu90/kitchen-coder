# Python Kitchen

Learn Python by working the pass. Chef Dorran calls the orders, you write real Python 3 to clear the tickets, and you climb the brigade from Kitchen Porter to Head Chef, then graduate by building a real program of your own.

**Play it:** https://kralnugames.com/kitchen-coder/

A [Kralnu Games](https://kralnugames.com) project.

## What's in it

- **25 tickets:** 24 across four services, then a graduation project, each with a short lesson, deeper "Chef's notes", common mistakes, and a task checked against real output:
  - **Breakfast:** `print`, variables, maths, f-strings, `input()`, `int()`
  - **Lunch:** string methods, `if`/`else`, `elif`, `and`/`or`/`not`, `in`
  - **Dinner:** lists, `append`, `for`, `range()`, `while`, running totals, filtering
  - **Late service:** functions, `return`, dictionaries, `.items()`, `try`/`except`, and a boss ticket
  - **Graduation:** build a till that takes orders until the server types done, using everything from the course
- **Main menu** with carry on, the practice station, cookbook, recap quizzes, office, settings, a review form, Ko-fi and install.
- **Guided first ticket.** A one-minute tour of ticket 1 for brand-new players: the order, the stove and the pass. Chef can even type the first answer for you.
- **A pass that fills up.** Every ticket you clear adds a piece of kit to the pass: a chopping board, condiments, pots and pans, plates, a service bell. By graduation it's a busy working pass with your certificate on the wall. The stockpot steams while your code runs, the bell rings when a ticket clears and a pan clatters on an error.
- **Recipe binder.** A short page on each new idea pops up before the ticket that first uses it, with an example to try. They're all collected in the binder on the menu.
- **Chef's specials.** Graduates can write their own tickets. The game cooks your answer to work out the exact output, keeps your answer secret, and gives you a link to send a friend. Anyone can cook a special, even before they've finished the course.
- **Recap quizzes.** Four quick questions after each service, with an explanation for every answer. Nothing is locked behind them.
- **Fair checking.** Tickets are tested with several inputs, and chef runs hidden taste tests with different data, so typing out the answer won't pass. Technique checks ignore comments and text inside strings.
- **Hints, not answers.** Up to three hints per ticket, one at a time. When you're wrong, you see what chef wanted next to what you printed.
- **Friendly errors.** Python's error messages are translated into plain English with the line number.
- **Practice station.** A free editor with an Inputs box for `input()` and eight recipe cards to play with. Nothing is marked.
- **Cookbook.** A full Python reference, with a **Try it** button on every example that sends it to the practice station.
- **Chef's voice (optional).** Chef Dorran can read his lines out loud using your device's text-to-speech. It's off by default because device voices can sound robotic, and the ⓘ next to the switch explains it. Turn it on and pick a voice in Settings.
- **Office.** Backup codes to move progress between devices, feedback, and a confirmed Start again.
- **Installable.** Add it to your home screen and it works offline after the first visit.

## Changelog

### 2.2 · 5 November 2026
- **The pass fills up as you learn.** 25 pieces of kit, one per cleared ticket, plus a Chef Patron certificate on the wall when you graduate. The pot steams while your code cooks, the bell rings on a clear and a pan clatters on an error.
- **Recipe binder.** A one-page card before each new idea (22 of them), collected in a binder on the menu, each with a Try it button.
- **Chef's specials.** Write your own tickets after graduating and share them with a link or a PKS1. code. Friends can cook them whether or not they've finished the course.

### 2.1 · 5 November 2026
- **Main menu** on launch, with everything in one place: carry on, practice station, cookbook, recap quizzes, office, settings, leave a review, support on Ko-fi, install and more games.
- **Guided first ticket** for brand-new players.
- **Recap quizzes** after each service.
- **Graduation project:** ticket 25, The Pass Is Yours. Clear it to become Chef Patron.
- **Chef's voice is now off by default**, with a note explaining it's your device's text-to-speech and that we recommend leaving it off. Turn it on in Settings.
- Credits: "Ideas, design and testing by Kris. Built with Claude, an AI by Anthropic."

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

---

Ideas, design and testing by Kris. Built with Claude, an AI by Anthropic.

## Updates

The game checks for a newer version when it opens and when you come back to it. If there is one, players see a small "A new version is ready" notice with an **Update** button, and there's a **Get the latest version** button in the menu at any time.

When pushing an update: change the game's version number and put the same value in `version.json`.
