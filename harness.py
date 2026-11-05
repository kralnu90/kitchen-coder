# Python Kitchen harness.
# Runs a learner's code in a fresh namespace, feeds input() from a list,
# records printed output and inputs in order, and reports errors with the
# line number in the learner's own file. The browser runs this inside
# Pyodide; tests/check.js runs the very same file under CPython.
import builtins
import json
import sys
import traceback

FILENAME = "your_code.py"
MAX_OUTPUT = 100_000


class _Recorder:
    def __init__(self):
        self.log = []
        self.size = 0

    def write(self, s):
        s = str(s)
        self.size += len(s)
        if self.size > MAX_OUTPUT:
            raise RuntimeError("too much printing")
        if self.log and self.log[-1][0] == "out":
            self.log[-1][1] += s
        else:
            self.log.append(["out", s])
        return len(s)

    def flush(self):
        pass

    def isatty(self):
        return False


def pk_run(code, inputs_json="[]"):
    inputs = [str(x) for x in json.loads(inputs_json)]
    rec = _Recorder()

    def fake_input(prompt=""):
        prompt = "" if prompt is None else str(prompt)
        if not inputs:
            raise EOFError("ran out of inputs")
        value = inputs.pop(0)
        rec.log.append(["in", prompt, value])
        return value

    saved = (sys.stdout, sys.stderr, builtins.input)
    sys.stdout = rec
    sys.stderr = rec
    builtins.input = fake_input
    error = None
    try:
        namespace = {"__name__": "__main__", "__builtins__": builtins}
        exec(compile(code, FILENAME, "exec"), namespace)
    except SystemExit:
        pass
    except BaseException as e:  # report everything the learner's code raises
        line = None
        if isinstance(e, SyntaxError):
            line = e.lineno if e.filename == FILENAME else None
            msg = e.msg
        else:
            for frame in traceback.extract_tb(e.__traceback__):
                if frame.filename == FILENAME:
                    line = frame.lineno
            msg = str(e)
        error = {"type": type(e).__name__, "msg": msg, "line": line}
    finally:
        sys.stdout, sys.stderr, builtins.input = saved
    out = "".join(part[1] for part in rec.log if part[0] == "out")
    return json.dumps({"out": out, "log": rec.log, "error": error})


if __name__ == "__main__":
    # Command-line use for the test suite: JSON {"code": ..., "inputs": [...]} on stdin.
    job = json.loads(sys.stdin.read())
    sys.stdout.write(pk_run(job["code"], json.dumps(job.get("inputs") or [])))
