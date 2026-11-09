// Python Kitchen service worker.
// Saves the game and the Pyodide Python engine so everything works offline
// after the first visit. Our own files load network-first, so pushing a new
// version still reaches players straight away. Bump CACHE when the list of
// files below changes.
const CACHE = "python-kitchen-v3";
const PYODIDE_CACHE = "pyodide-0.26.4";
const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const CORE = [
  "./", "index.html", "tickets.js", "py-worker.js", "harness.py", "manifest.webmanifest",
  "icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png",
];
const PYODIDE_FILES = ["pyodide.js", "pyodide.asm.js", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"].map(f => PYODIDE_BASE + f);

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    // The engine is big; if it can't be saved now it is saved the first time it loads.
    try { const p = await caches.open(PYODIDE_CACHE); await p.addAll(PYODIDE_FILES); } catch (err) {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keep = [CACHE, PYODIDE_CACHE];
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !keep.includes(k) && (k.startsWith("python-kitchen") || k.startsWith("pyodide-"))).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // version.json is the update check: always ask the network, never keep a copy.
  if (url.pathname.endsWith('/version.json')) return;

  if (url.href.startsWith(PYODIDE_BASE)) {
    // Versioned engine files never change: saved copy first.
    e.respondWith(caches.open(PYODIDE_CACHE).then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) c.put(req, res.clone());
      return res;
    }))));
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req, req.mode === "navigate" ? { cache: "no-cache" } : undefined).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined))));
    return;
  }

  // Google Fonts and anything else from outside: saved copy first.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
