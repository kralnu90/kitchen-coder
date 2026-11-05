# Python Kitchen audit (5 Nov 2026)

A full read of the game plus a check of all 24 tickets, as the first step of bringing Python Kitchen up to a professional standard.

## What's already strong

- **All 24 tickets are correct.** Every ticket was solved with a reference answer and run against real CPython 3. All tests and technique checks pass, so nothing is broken or unsolvable.
- The writing is excellent. Each ticket has a lesson, deeper "Chef's notes", common mistakes and three graded hints, all in Chef Dorran's voice.
- Functions are tested with hidden taste tests, so hardcoding the printed answer doesn't pass.
- Errors are translated into plain English with line numbers.
- The cookbook covers the whole course and ends with "Taking it to a real terminal", which is a proper graduation step.
- The practice station, recipe cards and Try it buttons work together well.

## Bugs to fix first

1. **Offline play isn't reliable.** The Python engine (Skulpt) loads from jsDelivr, but the service worker doesn't precache it. On the first visit the worker isn't in control yet, so the engine may never be saved. An installed copy can then fail to run Python offline. Fix: precache the two Skulpt files, or host them in the repo.
2. **iPhone zooms into the editor.** The code box uses a 14.7px font. iOS Safari zooms the page whenever you tap into a box under 16px, which is jarring on every ticket.
3. **"Real Python 3" isn't quite accurate.** The engine is Skulpt 1.2.0, which reimplements Python in JavaScript. It covers everything in the course, but it isn't the real CPython, and some error messages and edge cases differ. The page footer, meta description and the hub card all say "Real Python 3". Either reword it, or switch to Pyodide (real CPython in the browser, about a 10MB first download).
4. **Button contrast is too low.** White text on the orange "Send to the pass" button is about 3.3:1 in light mode and about 2.5:1 in dark mode. Accessibility guidelines ask for 4.5:1.
5. **Screen readers hear "#01" for each ticket.** The rail tabs have no accessible names, so a screen-reader user can't tell tickets apart or hear which are locked or cleared.

## Professional polish

6. **On a phone, the order and the editor are far apart.** The code box starts about 1,350px down, below the whole lesson. Learners have to scroll up to re-read the order and back down to type. Options: a pinned "The order" strip above the editor, a "Jump to the stove" button, or collapsing the lesson once it's been read.
7. **No backup or reset.** Progress lives only in this browser. Clearing site data or changing phones loses it. Add backup codes (export/import) and a confirmed "Start again".
8. **No review button.** The hub says every game has one, and the other games do.
9. **Chef's voice picks the first UK voice it finds** and lowers the pitch a lot, which tends to sound robotic. Use the same natural-voice ranking and chooser that Peekaboo Meadow now has.
10. **Technique checks read comments.** A comment like `# for return` satisfies "use a for loop" and "use return". Comments should be stripped before checking.
11. **Some fixed-output tickets can be passed by typing the answer** (for example #14, #16, #17 and #18 print a known list). Add a hidden second test that swaps in different data.
12. **App icon.** The manifest marks the icons as "any maskable", so Android crops the normal icon. Add a separate maskable icon.
13. **Key bar gaps.** No keys for `.`, `'`, `_`, `+` or `-`, which beginners need often on a phone keyboard.

## Planned stages

1. Safety net: an automated check that runs every ticket's tests against real Python, so later changes can't break a ticket.
2. Fix bugs 1 to 5.
3. Polish 6 to 13, plus a guided first ticket, recap quizzes after each service and a graduation project.
4. Bring over Garage Code's best ideas: manual pages before each new idea, a scene that reacts to your code, and a make-your-own-ticket mode.
