/* Python Kitchen engine worker.
   Loads Pyodide (real CPython compiled to WebAssembly) off the main thread, so a
   runaway loop can never freeze the page: the page simply terminates this worker
   and starts a fresh one. harness.py does the actual running and recording. */
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let runFn = null;

const ready = (async () => {
  importScripts(PYODIDE_BASE + "pyodide.js");
  const pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });
  const res = await fetch("harness.py", { cache: "no-cache" });
  if (!res.ok) throw new Error("Couldn't load harness.py (" + res.status + ")");
  pyodide.runPython(await res.text());
  runFn = pyodide.globals.get("pk_run");
  const version = pyodide.runPython("import sys; sys.version.split()[0]");
  postMessage({ type: "ready", version: String(version) });
})().catch((err) => {
  postMessage({ type: "fail", msg: String((err && err.message) || err) });
});

onmessage = async (e) => {
  const { id, code, inputs } = e.data || {};
  try {
    await ready;
    if (!runFn) throw new Error("The Python engine isn't ready.");
    const res = runFn(String(code), JSON.stringify(inputs || []));
    postMessage({ type: "result", id, res: String(res) });
  } catch (err) {
    postMessage({
      type: "result", id,
      res: JSON.stringify({ out: "", log: [], error: { type: "EngineError", msg: String((err && err.message) || err), line: null } }),
    });
  }
};
