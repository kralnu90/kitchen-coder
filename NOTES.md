# Python Kitchen: handover notes

Upload this file at the start of a new session so Claude can pick up where we left off.

## Status (4 Nov 2026)

- v2 live: 24 tickets in 4 services, practice station with 8 recipe cards, cookbook reference, Chef Dorran with speech bubble and text-to-speech voice.
- Made installable (manifest + service worker + icons) and offline-capable.
- Progress is saved in localStorage under the key `python-kitchen-v2`.

## Known issues

- Chef's voice didn't play when tested inside the Claude artifact viewer. It may work on GitHub Pages, since the page isn't sandboxed there. If it still doesn't, check whether the device has a text-to-speech voice installed, and look at how `say()` picks a voice.

## Ideas for later

- More tickets: list comprehensions, `while` with `input()`, classes, reading files.
- Achievements or a "clean tickets" score (cleared without hints).
- Daily challenge ticket.
- Unlock-all toggle for revisiting.
- Link from the hub at kralnugames.com.
