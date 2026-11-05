# Python Kitchen: handover notes

Upload this file at the start of a new session so Claude can pick up where we left off.

## Status (4 Nov 2026)

- v2 live: 24 tickets in 4 services, practice station with 8 recipe cards, cookbook reference, Chef Dorran with speech bubble and text-to-speech voice.
- Made installable (manifest + service worker + icons) and offline-capable.
- Progress is saved in localStorage under the key `python-kitchen-v2`.

## Pro upgrade (started 5 Nov 2026)

- Full audit written up in `AUDIT.md`: all 24 tickets verified against real CPython, plus a prioritised list of bugs and polish.
- Done (5 Nov): switched to Pyodide (CPython 3.12) in a Web Worker with a 5s kill switch; tickets moved to `tickets.js` with shared `judge()`; hidden swapped-data taste tests; comment/string-proof technique checks; test suite (`node tests/check.js`, 90 checks) plus GitHub Action; Office view (backup codes, restore, start again, voice chooser, feedback email); contrast fixes; 16px editors (no iPhone zoom); screen-reader labels on the rail; phone order strip and To the stove button; bigger key bar; maskable icon; offline caching of the engine.
- Done (5 Nov, 2.1): main menu (`openMenu(screen)`: home, settings, review, quizzes, quiz), guided first ticket (`coachGo(n)`, steps 0 to 3, `.spot` spotlight, `state.guided`), recap quizzes (`PK.QUIZZES` in tickets.js, best scores in `state.quiz`), graduation ticket #25 (svc 4, rank Chef Patron at 25), Chef's voice off by default (`state.voiceOff21` migration, ⓘ tip in the nav), voice chooser moved from the Office into Settings, credit line on the menu. Test suite: 98 checks.
- Done (5 Nov, 2.2): the pass fills up (`KIT` list of 25 SVG items in `#counter`, `renderPass()` called from `renderRail()`, reactions via `passReact("cooking" | "ding" | "clatter")`, certificate `#cert` at graduation); recipe binder (`PK.MANUAL`, 22 pages with `at` = first ticket, shown once by `maybePage()` when moving to that ticket, binder screen in the menu); Chef's specials (`state.specials` {mine, got, cleared, code}, `PKS1.` codes = base64url JSON {t, by, o, i, st, ex}, the maker's answer is never stored in the code, `#special=CODE` links open straight to the special, writing needs graduation, cooking doesn't). Tests: 120 checks, including every binder example running.
- Next ideas: more tickets (list comprehensions, classes, files), a daily ticket, clean-ticket scores.
- Feedback currently goes to hello@kralnugames.com by email. Swap in a Google Form link in the Office if preferred.

## Known issues

- Chef's voice didn't play when tested inside the Claude artifact viewer. It may work on GitHub Pages, since the page isn't sandboxed there. If it still doesn't, check whether the device has a text-to-speech voice installed, and look at how `say()` picks a voice.

## Ideas for later

- More tickets: list comprehensions, `while` with `input()`, classes, reading files.
- Achievements or a "clean tickets" score (cleared without hints).
- Daily challenge ticket.
- Unlock-all toggle for revisiting.
- Link from the hub at kralnugames.com.
