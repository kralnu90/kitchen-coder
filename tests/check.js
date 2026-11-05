// Python Kitchen ticket test suite.
// Runs every ticket's tests and technique checks with the same tickets.js marking
// and the same harness.py the game uses (here under CPython instead of Pyodide).
// Good answers must pass; cheats and common mistakes must fail.
// Usage: node tests/check.js
const path = require("path");
const { spawnSync } = require("child_process");
const PK = require(path.join(__dirname, "..", "tickets.js"));
const SOL = require(path.join(__dirname, "solutions.json"));
const HARNESS = path.join(__dirname, "..", "harness.py");
const PY = process.env.PYTHON || "python3";

function run(code, inputs) {
  const p = spawnSync(PY, [HARNESS], { input: JSON.stringify({ code, inputs }), encoding: "utf8", timeout: 5000 });
  if (p.error && p.error.code === "ETIMEDOUT") return Promise.resolve({ out: "", log: [], error: { type: "TimeLimit", msg: "took too long", line: null } });
  if (p.status !== 0) throw new Error("harness crashed: " + p.stderr);
  return Promise.resolve(JSON.parse(p.stdout));
}

(async () => {
  let failures = 0, checks = 0;
  for (let i = 0; i < PK.LEVELS.length; i++) {
    const level = PK.LEVELS[i], s = SOL[String(i)];
    const name = `#${String(i + 1).padStart(2, "0")} ${level.title}`;
    if (!s || !s.good.length) { console.log(`FAIL ${name}: no reference answer`); failures++; continue; }
    for (const [k, code] of s.good.entries()) {
      checks++;
      const v = await PK.judge(level, code, run);
      if (!v.ok) { failures++; console.log(`FAIL ${name}: good answer ${k + 1} was rejected (${v.type}${v.msg ? ": " + v.msg : ""}${v.r ? " got " + JSON.stringify(v.r.out) + (v.r.error ? " " + JSON.stringify(v.r.error) : "") : ""})`); }
    }
    for (const [k, code] of s.bad.entries()) {
      checks++;
      const v = await PK.judge(level, code, run);
      if (v.ok) { failures++; console.log(`FAIL ${name}: cheat/mistake ${k + 1} was accepted:\n${code}`); }
    }
    // starter code on its own must never pass
    checks++;
    const sv = await PK.judge(level, level.starter, run);
    if (sv.ok) { failures++; console.log(`FAIL ${name}: the untouched starter code passes`); }
  }
  // every service has a recap quiz with sensible answers
  checks++;
  if (!Array.isArray(PK.QUIZZES) || PK.QUIZZES.length < PK.SERVICES.length - 1) { failures++; console.log("FAIL quizzes: one per service needed"); }
  else PK.QUIZZES.forEach((qz, k) => qz.forEach((q, j) => { if (!q.q || !Array.isArray(q.o) || q.o.length < 2 || !(q.a >= 0 && q.a < q.o.length) || !q.why) { failures++; console.log(`FAIL quiz ${k + 1} question ${j + 1}`); } }));
  // the harness reports errors with the learner's line number
  const e = await run("x = 1\nprint(y)", []);
  checks++; if (!e.error || e.error.type !== "NameError" || e.error.line !== 2) { failures++; console.log("FAIL harness: NameError line number", e.error); }
  const s = await run("print('a'\n", []);
  checks++; if (!s.error || s.error.type !== "SyntaxError") { failures++; console.log("FAIL harness: SyntaxError", s.error); }
  const n = await run("x = input()", []);
  checks++; if (!n.error || n.error.type !== "EOFError") { failures++; console.log("FAIL harness: running out of inputs", n.error); }
  const p = await run("for i in range(10**7):\n    print(i)", []);
  checks++; if (!p.error || p.error.type !== "RuntimeError") { failures++; console.log("FAIL harness: output cap", p.error); }
  // harness.py must load cleanly inside Pyodide, where it also runs as __main__ with no stdin
  checks++;
  const emb = spawnSync(PY, ["-c", "import sys; sys.platform='emscripten'; sys.stdin=None; g={'__name__':'__main__'}; exec(open(sys.argv[1]).read(), g); print(g['pk_run']('print(1)','[]'))", HARNESS], { encoding: "utf8", timeout: 5000 });
  if (emb.status !== 0 || !/"out": "1\\n"/.test(emb.stdout)) { failures++; console.log("FAIL harness: loading as __main__ inside Pyodide", emb.stderr || emb.stdout); }
  console.log(`${checks} checks, ${failures} failure${failures === 1 ? "" : "s"}`);
  process.exit(failures ? 1 : 0);
})();
