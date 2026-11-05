/* Python Kitchen tickets and marking.
   Everything the game teaches and checks lives here, so the test suite
   (tests/check.js) can load exactly the same tickets and marking rules as the page. */
(function (root) {
"use strict";

/* ---------- hidden "taste test" helpers: swap the starter data for different data ---------- */
const reEsc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const item = v => typeof v === "number" ? reEsc(v) : `["']${reEsc(v)}["']`;
const keep = what => `Keep the ${what} from the starter code exactly as it is. Chef swaps in a different one to taste-test your code.`;
function swapList(from, to, what) {
  return { find: `\\[\\s*${from.map(item).join("\\s*,\\s*")}\\s*,?\\s*\\]`, to: "[" + to.map(v => JSON.stringify(v)).join(", ") + "]", missing: keep(what) };
}
function swapNum(name, from, to, what) {
  return { find: `\\b${name}\\s*=\\s*${from}\\b(?![.\\d])`, to: `${name} = ${to}`, missing: keep(what) };
}
function swapDict(from, to, what) {
  const pairs = Object.entries(from).map(([k, v]) => `${item(k)}\\s*:\\s*${item(v)}`).join("\\s*,\\s*");
  return { find: `\\{\\s*${pairs}\\s*,?\\s*\\}`, to: "{" + Object.entries(to).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + "}", missing: keep(what) };
}

const SERVICES = ["Breakfast: the basics", "Lunch: decisions", "Dinner: lists and loops", "Late service: functions and dictionaries", "Graduation: your own pass"];
const LEVELS = [
/* ---------- BREAKFAST ---------- */
{ svc: 0, title: "First Call", concept: "print() and strings",
  bark: "Right, new starter! First thing anyone says on my line is Yes, Chef! Print it!",
  lesson: `<p>Every program talks to you through <code>print()</code>. Whatever goes inside the brackets gets shown on screen.</p>
<p>Text has to sit inside quote marks, single or double. Python calls a piece of text a <b>string</b>.</p>
<pre class="ex">print("Hello, kitchen")
print('Single quotes work too')</pre>`,
  notes: `<p>Python runs your code top to bottom, one line at a time. Each <code>print()</code> starts a new line.</p>
<p>You can print several things at once with commas. Python puts a space between them. An empty <code>print()</code> prints a blank line.</p>
<pre class="ex">print("Soup", "Bread", "Butter")
print()
print("After the gap")</pre>`,
  mistakes: ["Forgetting the quotes: <code>print(Yes)</code> makes Python look for a variable called Yes.", "Capital P: <code>Print()</code> doesn't exist. Python is case-sensitive.", "Mismatched quotes: <code>\"Hello'</code> won't work. Open and close with the same kind."],
  task: `<p>Head chef just called the first order. Answer properly. Print exactly:</p>`,
  expect: "Yes, Chef!",
  starter: `# Lines starting with # are comments. Python ignores them.\n# Write your code under here:\n`,
  tests: [{ expected: "Yes, Chef!" }],
  hints: ["You need print() with your words in quotes inside the brackets.", "Capitals and punctuation count. Yes, Chef! has a comma and an exclamation mark.", "The shape is print(\"...\") with the words where the dots are."] },

{ svc: 0, title: "Mise en Place", concept: "Variables",
  bark: "Mise en place! Label your tubs. Variable called dish, Tomato soup inside, then print it!",
  lesson: `<p>A <b>variable</b> is a labelled tub on your station. Put something in it, then grab it later by name.</p>
<pre class="ex">special = "Beef stew"
print(special)   <span class="cm"># shows: Beef stew</span></pre>
<p><code>print(special)</code> has no quotes. With quotes it would print the word "special" itself.</p>`,
  notes: `<p>The <code>=</code> sign means "put this in the tub". It doesn't mean equals like in maths.</p>
<p>You can swap what's in a tub any time. The newest value wins.</p>
<pre class="ex">dish = "Soup"
print(dish)
dish = "Stew"
print(dish)</pre>
<p><b>Naming rules:</b> letters, numbers and underscores only. No spaces, so write <code>main_course</code>. It can't start with a number. And <code>Dish</code> and <code>dish</code> are different tubs.</p>`,
  mistakes: ["<code>print(\"dish\")</code> prints the word dish, not what's inside.", "Spaces in names: <code>main course = ...</code> breaks. Use an underscore.", "Using a tub before you've made it gives a NameError."],
  task: `<p>Make a variable called <code>dish</code> holding the text <code>Tomato soup</code>, then print the variable (not the text directly).</p>`,
  expect: "Tomato soup",
  starter: `# Make your variable, then print it\n`,
  tests: [{ expected: "Tomato soup" }],
  requires: [[/\bdish\s*=/, "make a variable called dish using ="], [/print\(\s*dish\s*\)/, "print the variable itself: print(dish)"]],
  hints: ["Two lines: one to fill the tub, one to print it.", "Filling a variable looks like name = \"value\".", "If it prints the word dish, you've put quotes around dish inside print()."] },

{ svc: 0, title: "Counting Covers", concept: "Numbers and maths",
  bark: "How many covers tonight? Six tables, four seats each. Let Python work it out, not your fingers!",
  lesson: `<p>Numbers don't need quotes. Python does maths with <code>+ - * /</code>. The star <code>*</code> means times.</p>
<pre class="ex">trays = 3
rolls_per_tray = 12
print(trays * rolls_per_tray)   <span class="cm"># 36</span></pre>`,
  notes: `<table class="ops"><tr><th>Symbol</th><th>Does</th><th>Example</th></tr>
<tr><td><code>/</code></td><td>divide, always gives a decimal</td><td><code>10 / 4</code> → 2.5</td></tr>
<tr><td><code>//</code></td><td>divide, drop the remainder</td><td><code>10 // 4</code> → 2</td></tr>
<tr><td><code>%</code></td><td>the remainder only</td><td><code>10 % 4</code> → 2</td></tr>
<tr><td><code>**</code></td><td>power</td><td><code>2 ** 3</code> → 8</td></tr></table>
<p>Whole numbers are called <b>int</b>, decimals are <b>float</b>. Brackets get worked out first.</p>
<pre class="ex">print(10 / 4)
print(10 // 4)
print(10 % 4)
print((2 + 3) * 4)
print("6" * 4)    <span class="cm"># text repeated, not maths!</span></pre>`,
  mistakes: ["Quotes around numbers: <code>\"6\" * 4</code> gives 6666, not 24.", "Using <code>x</code> for times. Python only understands <code>*</code>."],
  task: `<p>The restaurant has 6 tables with 4 seats each. Make variables <code>tables</code> and <code>seats</code>, then print the total covers by multiplying them.</p>`,
  expect: "24", starter: ``,
  tests: [{ expected: "24" }],
  requires: [[/\btables\s*=/, "make a variable called tables"], [/\bseats\s*=/, "make a variable called seats"], [/\*/, "let Python do the multiplying with *"]],
  hints: ["Make the two variables first, each on its own line.", "No quotes around numbers. tables = 6, not tables = \"6\".", "print() can do maths inside its brackets, using your two variable names."] },

{ svc: 0, title: "Calling the Order", concept: "f-strings",
  bark: "Call it properly! Eight risotto. I want to hear 8 x Risotto. Use an f-string!",
  lesson: `<p>To mix variables into text, put an <code>f</code> before the opening quote and wrap the variables in curly brackets.</p>
<pre class="ex">table = 7
starter = "Pâté"
print(f"Table {table}: {starter}")   <span class="cm"># Table 7: Pâté</span></pre>`,
  notes: `<p>You can do maths right inside the curly brackets.</p>
<pre class="ex">covers = 8
print(f"That's {covers * 2} rolls")
price = 4.5
print(f"£{price:.2f}")   <span class="cm"># :.2f means 2 decimal places</span></pre>
<p>The older way joins strings with <code>+</code>, but every piece must be text, so numbers need <code>str()</code>. f-strings are tidier.</p>
<pre class="ex">print("Table " + str(7))</pre>`,
  mistakes: ["Forgetting the <code>f</code>: Python prints the curly brackets literally.", "Leaving out the closing quote or bracket at the end."],
  task: `<p><code>dish</code> and <code>covers</code> are already set up. Use one f-string to print:</p>`,
  expect: "8 x Risotto",
  starter: `dish = "Risotto"\ncovers = 8\n# Print it with an f-string\n`,
  tests: [{ expected: "8 x Risotto" }, { swap: swapNum("covers", 8, 12, "covers = 8 line"), expected: "12 x Risotto", hidden: true, note: "Chef changed covers to 12 to check you used the variable." }],
  requires: [[/\bf["']/, "use an f-string: f\"...\""]],
  hints: ["Start with print(f\" and close both the quote and the bracket.", "Each variable goes in { } inside the text.", "The little x is just a letter typed in the text, with a space either side."] },

{ svc: 0, title: "Order In", concept: "input()",
  bark: "Orders are coming in! Read the order and call it. Order up, then the dish!",
  lesson: `<p><code>input()</code> waits for someone to type, then hands you what they typed as a string. Save it in a variable to use it.</p>
<pre class="ex">name = input()
print(f"Evening, {name}")</pre>
<p>In this game, the checker does the typing. It tries more than one order, so don't hardcode the answer.</p>`,
  notes: `<p>You can give <code>input()</code> a prompt, a question shown before the answer. Prompts don't count towards the checked output here.</p>
<pre class="ex">name = input("What's your name? ")
print(f"Evening, {name}")</pre>
<p>In a real terminal, the program pauses and waits for the keyboard. In the practice station, you type inputs into the Inputs box, one per line.</p>`,
  mistakes: ["Calling <code>input()</code> but not storing it. The answer gets thrown away.", "Printing a fixed dish name. The checker will send different orders."],
  task: `<p>Read the order with <code>input()</code> and call it to the pass. If the order is <code>Fish and chips</code>, print:</p>`,
  expect: "Order up: Fish and chips", starter: ``,
  tests: [{ inputs: ["Fish and chips"], expected: "Order up: Fish and chips" }, { inputs: ["Scampi"], expected: "Order up: Scampi" }],
  requires: [[/input\(/, "use input() to read the order"]],
  hints: ["Line 1: store input() in a variable. Line 2: print.", "The f-string trick from the last ticket works here.", "Keep the colon and the space after Order up."] },

{ svc: 0, title: "Bread Rolls", concept: "Converting types with int()",
  bark: "Two rolls a head! Read the covers, tell me how many rolls. And make it a number, not text!",
  lesson: `<p>Whatever <code>input()</code> gives you is always text, even "5". Text can't do maths. Wrap it in <code>int()</code> to turn it into a whole number.</p>
<pre class="ex">trays = int(input())
print(trays + 1)</pre>`,
  notes: `<table class="ops"><tr><th>Tool</th><th>Turns into</th></tr>
<tr><td><code>int()</code></td><td>whole number</td></tr><tr><td><code>float()</code></td><td>decimal</td></tr>
<tr><td><code>str()</code></td><td>text</td></tr><tr><td><code>type()</code></td><td>tells you what something is</td></tr></table>
<pre class="ex">x = "5"
print(type(x))
n = int(x)
print(type(n), n * 2)
print(float("2.5") * 2)</pre>`,
  mistakes: ["Forgetting <code>int()</code>: <code>\"5\" * 2</code> gives 55.", "<code>int(\"2.5\")</code> fails. Use <code>float()</code> for decimals."],
  task: `<p>Read the number of covers. Every guest gets 2 bread rolls. Print how many rolls to bake. For 5 covers:</p>`,
  expect: "10", starter: ``,
  tests: [{ inputs: ["5"], expected: "10" }, { inputs: ["12"], expected: "24" }, { inputs: ["1"], expected: "2" }],
  requires: [[/int\(/, "turn the input into a number with int()"]],
  hints: ["int() goes around input(), like a lid on a tub.", "If you see 55 instead of 10, Python is repeating the text. You forgot int().", "Then multiply your variable by 2 inside print()."] },

/* ---------- LUNCH ---------- */
{ svc: 1, title: "Shout It Back", concept: "String methods",
  bark: "I can't hear you! Read the dish and shout it back in capitals with an exclamation mark!",
  lesson: `<p>Strings come with built-in tools called <b>methods</b>. You use them with a dot after the string.</p>
<pre class="ex">dish = "fish pie"
print(dish.upper())    <span class="cm"># FISH PIE</span>
print(dish.title())    <span class="cm"># Fish Pie</span>
print(len(dish))       <span class="cm"># 8 characters</span></pre>`,
  notes: `<p>Methods hand back a <b>new</b> string. The original stays the same unless you save over it: <code>dish = dish.upper()</code>.</p>
<table class="ops"><tr><th>Method</th><th>Does</th></tr>
<tr><td><code>.lower()</code></td><td>all lowercase</td></tr><tr><td><code>.strip()</code></td><td>removes spaces at both ends</td></tr>
<tr><td><code>.replace(a, b)</code></td><td>swaps a for b</td></tr><tr><td><code>.startswith(x)</code></td><td>True or False</td></tr></table>
<p>You can chain them: <code>input().strip().lower()</code> tidies up whatever someone types.</p>
<pre class="ex">messy = "  CHIPS  "
print(messy.strip().lower())
print("chips"[0])   <span class="cm"># strings have positions too</span></pre>`,
  mistakes: ["Forgetting the brackets: <code>dish.upper</code> without <code>()</code> doesn't run it.", "Expecting the original to change without saving it back."],
  task: `<p>Read a dish with <code>input()</code> and print it in capitals with <code>!</code> on the end. For <code>chips</code>:</p>`,
  expect: "CHIPS!", starter: ``,
  tests: [{ inputs: ["chips"], expected: "CHIPS!" }, { inputs: ["fish pie"], expected: "FISH PIE!" }],
  requires: [[/\.upper\(\)/, "use .upper()"]],
  hints: ["Store the input, then use .upper() on it.", "An f-string can hold a method call: f\"{dish.upper()}!\"", "No space between the dish and the !."] },

{ svc: 1, title: "Fridge Check", concept: "if / else and booleans",
  bark: "Fridge check! Five degrees or under is safe. Any warmer, I want to know about it!",
  lesson: `<p><code>if</code> lets your code make a decision. End the line with a colon, then indent the lines below by 4 spaces. The indent is how Python knows what belongs to the if.</p>
<pre class="ex">stock = int(input())
if stock > 0:
    print("Available")
else:
    print("86 it")</pre>`,
  notes: `<p>Every comparison gives back <code>True</code> or <code>False</code>. These are called <b>booleans</b>.</p>
<table class="ops"><tr><th>Write</th><th>Means</th></tr>
<tr><td><code>==</code></td><td>equal to</td></tr><tr><td><code>!=</code></td><td>not equal to</td></tr>
<tr><td><code>&lt;</code> <code>&gt;</code></td><td>less, more</td></tr><tr><td><code>&lt;=</code> <code>&gt;=</code></td><td>at most, at least</td></tr></table>
<pre class="ex">temp = 4
print(temp <= 5)
if temp <= 5:
    print("Safe")
print("Check done")   <span class="cm"># runs either way</span></pre>
<p>You can have an <code>if</code> without an <code>else</code>. The else is optional.</p>`,
  mistakes: ["Using <code>=</code> to compare. Comparing needs <code>==</code>.", "Missing the colon at the end of the if or else line.", "Comparing text to a number. Remember <code>int()</code> on the input."],
  task: `<p>Read the fridge temperature as a number. If it's 5 or below, print <code>Safe</code>. Otherwise print <code>Too warm</code>.</p>`,
  expect: "Safe        (for 3)\nToo warm    (for 8)", starter: ``,
  tests: [{ inputs: ["3"], expected: "Safe" }, { inputs: ["5"], expected: "Safe" }, { inputs: ["8"], expected: "Too warm" }],
  requires: [[/\bif\b/, "use an if"], [/\belse\s*:/, "use an else:"]],
  hints: ["Read with int(input()) like before.", "5 counts as safe, so you need 'at most', not 'less than'.", "Check the colon at the end of the if and else lines, and the 4-space indent under them."] },

{ svc: 1, title: "Steak Station", concept: "elif",
  bark: "Probe that steak! Under fifty, rare. Under sixty, medium. Anything else, well done!",
  lesson: `<p>For more than two choices, add <code>elif</code>, short for "else if". Python checks from the top and runs only the <b>first</b> one that's true.</p>
<pre class="ex">size = int(input())
if size < 200:
    print("Small")
elif size < 300:
    print("Regular")
else:
    print("Large")</pre>`,
  notes: `<p>You can have as many <code>elif</code>s as you like. Order matters: put the narrowest check first.</p>
<p>If you checked <code>size < 300</code> first, a 150g portion would say "Regular", because 150 is also less than 300 and Python stops at the first true one.</p>`,
  mistakes: ["Checks in the wrong order, so the first branch catches everything.", "Using several separate <code>if</code>s instead of <code>elif</code>, so more than one prints."],
  task: `<p>Read the steak's core temperature. Below 50 print <code>Rare</code>, below 60 print <code>Medium</code>, anything else print <code>Well done</code>.</p>`,
  expect: "Rare (45)   Medium (55)   Well done (60)", starter: ``,
  tests: [{ inputs: ["45"], expected: "Rare" }, { inputs: ["55"], expected: "Medium" }, { inputs: ["60"], expected: "Well done" }, { inputs: ["72"], expected: "Well done" }],
  requires: [[/\belif\b/, "use elif for the middle option"]],
  hints: ["Order matters. Check the lowest temperature first.", "60 itself should be Well done, so the middle check is 'less than 60'.", "Shape: if ...: / elif ...: / else: with prints indented under each."] },

{ svc: 1, title: "Hot Holding", concept: "and, or, not",
  bark: "Hot holding! Sixty-three degrees or more AND held ninety minutes or less, it goes out. Otherwise, bin it!",
  lesson: `<p>Join conditions together:</p>
<ul><li><code>and</code>: both sides must be true</li><li><code>or</code>: at least one side is true</li><li><code>not</code>: flips True to False</li></ul>
<pre class="ex">vegan = True
nuts = False
if vegan and not nuts:
    print("Safe for table 4")</pre>`,
  notes: `<p>Each side of <code>and</code> must be a full comparison. <code>temp >= 63 and <= 90</code> doesn't work. You need <code>temp >= 63 and minutes <= 90</code>.</p>
<pre class="ex">print(True and False)
print(True or False)
print(5 > 3 or 2 > 9)
print(not 5 > 3)</pre>
<p>This task reads <b>two</b> inputs. Each <code>input()</code> call takes the next one.</p>`,
  mistakes: ["Writing <code>and</code> with half a comparison on one side.", "Mixing up the two inputs: the first is the temperature, the second is the minutes."],
  task: `<p>Read the temperature, then the minutes it's been held (two inputs, both numbers). If it's at least 63 <b>and</b> held 90 minutes or less, print <code>Serve</code>. Otherwise print <code>Bin it</code>.</p>`,
  expect: "Serve    (70, 30)\nBin it   (60, 30)\nBin it   (70, 120)", starter: ``,
  tests: [{ inputs: ["70", "30"], expected: "Serve" }, { inputs: ["60", "30"], expected: "Bin it" }, { inputs: ["70", "120"], expected: "Bin it" }, { inputs: ["63", "90"], expected: "Serve" }],
  requires: [[/\band\b/, "join the two checks with and"]],
  hints: ["Two lines of int(input()), one for temp, one for minutes.", "At least means >=, at most means <=.", "if temp >= 63 and ... : then the rest of the shape you know."] },

{ svc: 1, title: "On the Menu?", concept: "Checking with in",
  bark: "Someone's ordered something. Is it even on my menu? If it is, coming up. If not, it's 86'd!",
  lesson: `<p><code>in</code> checks whether something is inside something else. It works on lists and on strings.</p>
<pre class="ex">print("nut" in "walnut")              <span class="cm"># True</span>
print("pie" in ["soup", "pie"])       <span class="cm"># True</span>
print("tart" not in ["soup", "pie"])  <span class="cm"># True</span></pre>`,
  notes: `<p>"86" is kitchen slang for "we've run out". To get an apostrophe inside text, use double quotes on the outside: <code>"86'd, chef"</code>.</p>
<p><code>in</code> is case-sensitive. <code>"Pie" in ["pie"]</code> is False. Using <code>.lower()</code> on the input first makes it more forgiving.</p>`,
  mistakes: ["Single quotes around text that contains an apostrophe. The apostrophe ends the string early.", "Checking against one dish with <code>==</code> instead of the whole list with <code>in</code>."],
  task: `<p>Read a dish. If it's in <code>menu</code>, print <code>Coming up</code>. If not, print:</p>`,
  expect: "86'd, chef",
  starter: `menu = ["soup", "burger", "pie"]\n`,
  tests: [{ inputs: ["burger"], expected: "Coming up" }, { inputs: ["lasagne"], expected: "86'd, chef" }, { inputs: ["pie"], expected: "Coming up" }, { swap: swapList(["soup", "burger", "pie"], ["soup", "lasagne"], "menu list"), inputs: ["lasagne"], expected: "Coming up", hidden: true, note: "Chef put lasagne on tonight's menu to check you used the menu list." }],
  requires: [[/\bin\s+menu\b/, "check with in menu"]],
  hints: ["if dish in menu: then indented print.", "Use double quotes around 86'd, chef because of the apostrophe.", "Don't forget the else: for dishes not on the menu."] },

/* ---------- DINNER ---------- */
{ svc: 2, title: "The Prep List", concept: "Lists",
  bark: "Prep list! What's the first job, and how many jobs have we got?",
  lesson: `<p>A <b>list</b> holds several things in order, inside square brackets. Get one by its position. Python counts from <b>0</b>, so the first item is <code>[0]</code>.</p>
<pre class="ex">herbs = ["basil", "thyme", "sage"]
print(herbs[1])     <span class="cm"># thyme</span>
print(len(herbs))   <span class="cm"># 3</span></pre>`,
  notes: `<p>Negative positions count from the end: <code>[-1]</code> is the last item.</p>
<p><b>Slicing</b> grabs a run of items: <code>herbs[0:2]</code> gives positions 0 and 1 (it stops before 2).</p>
<pre class="ex">herbs = ["basil", "thyme", "sage", "mint"]
print(herbs[-1])
print(herbs[1:3])
print(herbs[:2])</pre>`,
  mistakes: ["Using <code>[1]</code> for the first item. It's <code>[0]</code>.", "Asking for a position past the end gives an IndexError."],
  task: `<p>Print the first item on the list, then on the next line print how many items there are.</p>`,
  expect: "onions\n3",
  starter: `prep = ["onions", "carrots", "celery"]\n`,
  tests: [{ expected: "onions\n3" }, { swap: swapList(["onions", "carrots", "celery"], ["fennel", "peas"], "prep list"), expected: "fennel\n2", hidden: true, note: "Chef swapped in a different prep list." }],
  requires: [[/prep\s*\[\s*0\s*\]/, "get the first item with prep[0]"], [/len\(/, "use len() to count"]],
  hints: ["Two print() lines.", "First item is position 0, not 1.", "len() goes around the list's name to count it."] },

{ svc: 2, title: "One More Job", concept: "Changing lists",
  bark: "Sous wants one more job on the list. Add it, then tell me how long the list is and what's last!",
  lesson: `<p>Lists can change. <code>.append()</code> adds an item to the end.</p>
<pre class="ex">jobs = ["peel"]
jobs.append("chop")
print(jobs)       <span class="cm"># ['peel', 'chop']</span></pre>`,
  notes: `<table class="ops"><tr><th>Method</th><th>Does</th></tr>
<tr><td><code>.append(x)</code></td><td>add to the end</td></tr><tr><td><code>.insert(0, x)</code></td><td>add at a position</td></tr>
<tr><td><code>.remove(x)</code></td><td>take out by name</td></tr><tr><td><code>.pop()</code></td><td>take out the last one and hand it back</td></tr>
<tr><td><code>.sort()</code></td><td>put in order</td></tr></table>
<pre class="ex">jobs = ["peel", "chop", "dice"]
jobs.remove("chop")
done = jobs.pop()
print(done, jobs)</pre>`,
  mistakes: ["Writing <code>prep = prep.append(x)</code>. append changes the list itself and returns nothing.", "Using <code>[len(prep)]</code> for the last item. That's one past the end. Use <code>[-1]</code>."],
  task: `<p>Read one more job with <code>input()</code>, add it to <code>prep</code>, then print the length of the list and then its last item. For <code>garlic</code>:</p>`,
  expect: "3\ngarlic",
  starter: `prep = ["onions", "carrots"]\n`,
  tests: [{ inputs: ["garlic"], expected: "3\ngarlic" }, { inputs: ["leeks"], expected: "3\nleeks" }, { swap: swapList(["onions", "carrots"], ["leeks", "peas", "beans"], "prep list"), inputs: ["garlic"], expected: "4\ngarlic", hidden: true, note: "Chef started you with a longer prep list." }],
  requires: [[/\.append\(/, "add it with .append()"], [/\[\s*-1\s*\]/, "get the last item with [-1]"]],
  hints: ["Store the input, then prep.append(your_variable).", "len(prep) for the count.", "prep[-1] for the last item."] },

{ svc: 2, title: "Working the List", concept: "for loops",
  bark: "Read the prep list out to the brigade. Every job, a dash in front. Use a loop!",
  lesson: `<p>A <code>for</code> loop runs the same steps for each item in a list. The name after <code>for</code> holds the current item each time round.</p>
<pre class="ex">for herb in ["basil", "thyme"]:
    print(f"Pick {herb}")</pre>`,
  notes: `<p>Everything indented under the <code>for</code> line runs once per item. The first unindented line after it runs once, after the loop finishes.</p>
<p><code>enumerate()</code> gives you a counter alongside each item.</p>
<pre class="ex">for i, job in enumerate(["peel", "chop"]):
    print(i + 1, job)
print("All done")</pre>
<p>Loops work on strings too, one letter at a time.</p>`,
  mistakes: ["Forgetting the colon on the for line.", "Printing the whole list inside the loop instead of the loop variable."],
  task: `<p>Print every item on the prep list with a dash and a space in front:</p>`,
  expect: "- onions\n- carrots\n- celery\n- garlic",
  starter: `prep = ["onions", "carrots", "celery", "garlic"]\n`,
  tests: [{ expected: "- onions\n- carrots\n- celery\n- garlic" }, { swap: swapList(["onions", "carrots", "celery", "garlic"], ["leeks", "beans"], "prep list"), expected: "- leeks\n- beans", hidden: true, note: "Chef swapped in a different prep list." }],
  requires: [[/\bfor\b.+\bin\b/, "use a for ... in ... loop, not a print for each one"]],
  hints: ["for item in prep: then an indented print.", "You can call the loop variable anything: item, veg, job.", "An f-string makes the dash easy: f\"- {item}\"."] },

{ svc: 2, title: "Oven Timer", concept: "range()",
  bark: "Countdown on the oven! Five down to one, then I want to hear the ding!",
  lesson: `<p><code>range()</code> makes a run of numbers for a loop. <code>range(start, stop, step)</code> stops <b>before</b> the stop number.</p>
<pre class="ex">for n in range(1, 4):
    print(n)          <span class="cm"># 1, 2, 3</span>
for n in range(10, 0, -5):
    print(n)          <span class="cm"># 10, 5</span></pre>`,
  notes: `<p><code>range(5)</code> on its own means 0, 1, 2, 3, 4. Five numbers, starting at 0.</p>
<p>A step of <code>-1</code> counts down. A step of 2 skips every other number.</p>
<pre class="ex">for n in range(1, 13):
    print(f"{n} x 7 = {n * 7}")</pre>`,
  mistakes: ["Expecting the stop number to be included. <code>range(1, 5)</code> ends at 4.", "Indenting the line that should run after the loop, so it runs every time."],
  task: `<p>Count down from 5 to 1, one number per line, then print <code>Ding!</code> once the loop is done.</p>`,
  expect: "5\n4\n3\n2\n1\nDing!", starter: ``,
  tests: [{ expected: "5\n4\n3\n2\n1\nDing!" }],
  requires: [[/range\(/, "use range() in a for loop"]],
  hints: ["You want range(start, stop, -1).", "The stop is never included, so to reach 1 you stop at 0.", "Ding! goes after the loop. Don't indent it."] },

{ svc: 2, title: "Restock", concept: "while loops",
  bark: "We're low! Stock's at two. Keep adding four portions till we're at twenty, and call each count!",
  lesson: `<p>A <code>while</code> loop keeps going as long as its condition is true. Something inside must change, or it never stops.</p>
<pre class="ex">eggs = 0
while eggs < 12:
    eggs = eggs + 6
    print(eggs)       <span class="cm"># 6, 12</span></pre>
<p><code>eggs += 6</code> is a shortcut for <code>eggs = eggs + 6</code>.</p>`,
  notes: `<p>Use <code>for</code> when you know how many times. Use <code>while</code> when you keep going until something happens.</p>
<p><code>break</code> jumps out of a loop early. <code>continue</code> skips to the next round.</p>
<pre class="ex">n = 0
while True:
    n += 1
    if n > 4:
        break
    print(n)</pre>`,
  mistakes: ["Nothing changes inside the loop, so it runs forever. The checker stops it after 3 seconds.", "Printing before adding, so you see the old number."],
  task: `<p>Stock starts at 2 portions. While stock is below 20, add 4 portions and print the new stock.</p>`,
  expect: "6\n10\n14\n18\n22",
  starter: `stock = 2\n`,
  tests: [{ expected: "6\n10\n14\n18\n22" }, { swap: swapNum("stock", 2, 9, "stock = 2 line"), expected: "13\n17\n21", hidden: true, note: "Chef started the stock at 9 instead." }],
  requires: [[/\bwhile\b/, "use a while loop"]],
  hints: ["while stock < 20: then indented lines underneath.", "Add first, then print. Both indented.", "If it runs forever, stock isn't changing inside the loop."] },

{ svc: 2, title: "Head Count", concept: "Running totals",
  bark: "How many covers across all the tables? Add them up with a loop. No shortcuts!",
  lesson: `<p>A <b>running total</b> starts at 0 and grows each time round a loop. It's one of the most-used patterns in programming.</p>
<pre class="ex">total = 0
for n in [3, 4, 5]:
    total += n
print(total)   <span class="cm"># 12</span></pre>`,
  notes: `<p>The same pattern counts things: start at 0, add 1 each time something matches.</p>
<p>Python has shortcuts too: <code>sum()</code>, <code>max()</code> and <code>min()</code>. Learn the loop first, because you'll need it when the job's more complicated than adding.</p>
<pre class="ex">tables = [4, 2, 6, 3]
print(sum(tables), max(tables), min(tables))</pre>`,
  mistakes: ["Setting <code>total = 0</code> inside the loop, so it resets every time.", "Indenting the print, so it prints every step instead of once at the end."],
  task: `<p>Add up the covers on every table using a loop and <code>+=</code>, then print the total once.</p>`,
  expect: "15",
  starter: `tables = [4, 2, 6, 3]\n`,
  tests: [{ expected: "15" }, { swap: swapList([4, 2, 6, 3], [5, 5, 1], "tables list"), expected: "11", hidden: true, note: "Chef tried a different set of tables." }],
  requires: [[/\bfor\b/, "use a for loop"], [/\+=/, "add to the total with +="]],
  hints: ["total = 0 goes before the loop.", "Inside the loop: total += the loop variable.", "The print goes after the loop, not indented."] },

{ svc: 2, title: "Big Ticket Items", concept: "Loops with decisions",
  bark: "Owner wants to know. Which dishes are over a tenner? Just those, nothing else!",
  lesson: `<p>Put an <code>if</code> inside a loop to pick out only the items you want. This is called <b>filtering</b>.</p>
<pre class="ex">for t in [2, 8, 5]:
    if t > 4:
        print(t)      <span class="cm"># 8, 5</span></pre>`,
  notes: `<p>Notice the double indent: the <code>if</code> is inside the loop (4 spaces), and the print is inside the if (8 spaces).</p>
<p>You can build a new list from the ones you keep:</p>
<pre class="ex">keep = []
for t in [2, 8, 5]:
    if t > 4:
        keep.append(t)
print(keep)</pre>`,
  mistakes: ["The print only indented once, so it runs for every item.", "Using <code>>=</code> when you mean over: 10 itself isn't over a tenner."],
  task: `<p>Print only the prices that are more than 10, one per line.</p>`,
  expect: "14\n12\n18",
  starter: `prices = [6, 14, 12, 9, 18]\n`,
  tests: [{ expected: "14\n12\n18" }, { swap: swapList([6, 14, 12, 9, 18], [11, 3, 25, 10], "prices list"), expected: "11\n25", hidden: true, note: "Chef tried different prices. Remember 10 itself isn't over a tenner." }],
  requires: [[/\bfor\b/, "loop over the prices"], [/\bif\b/, "use an if inside the loop"]],
  hints: ["for price in prices:", "Inside it, if price > 10:", "The print sits 8 spaces in, under the if."] },

/* ---------- LATE SERVICE ---------- */
{ svc: 3, title: "Signature Move", concept: "Functions",
  bark: "Every chef has a signature move. Write me a function called plate, then plate the duck and the salmon!",
  lesson: `<p>A <b>function</b> is a recipe with a name. Write it once with <code>def</code>, then use it whenever you like. The things in the brackets are the ingredients it needs, called <b>parameters</b>.</p>
<pre class="ex">def greet(name):
    print(f"Evening, {name}")

greet("table six")
greet("the bar")</pre>
<p>Defining it does nothing on its own. It only runs when you call it.</p>`,
  notes: `<p>Functions stop you writing the same lines again and again. If the recipe changes, you fix it in one place.</p>
<p>Functions can take more than one ingredient, and give one a default value:</p>
<pre class="ex">def call(dish, table=1):
    print(f"{dish} for table {table}")

call("Soup")
call("Pie", 4)</pre>`,
  mistakes: ["Defining it but never calling it, so nothing prints.", "Indenting the calls, which puts them inside the function."],
  task: `<p>Write a function <code>plate(dish)</code> that prints <code>Plating</code> and the dish. Then call it for <code>Duck</code> and <code>Salmon</code>.</p>`,
  expect: "Plating Duck\nPlating Salmon", starter: ``,
  tests: [{ expected: "Plating Duck\nPlating Salmon" }, { append: "\nplate(\"Lamb\")", expected: "Plating Duck\nPlating Salmon\nPlating Lamb", hidden: true, note: "Chef called your plate() function with Lamb." }],
  requires: [[/def\s+plate\s*\(/, "define a function called plate with def"], [/plate\(\s*["']Duck["']\s*\)/, "call plate(\"Duck\")"]],
  hints: ["def plate(dish): then an indented print.", "The calls go below, not indented.", "If nothing prints, you've defined it but not called it."] },

{ svc: 3, title: "Portion Control", concept: "return",
  bark: "How many portions from this batch? Write a function that works it out and hands me the number!",
  lesson: `<p><code>return</code> hands a value back from a function instead of printing it. Then you can store it, do maths with it, or print it.</p>
<pre class="ex">def double(n):
    return n * 2

big = double(21)
print(big)   <span class="cm"># 42</span></pre>`,
  notes: `<p>Printing shows something on screen. Returning gives it back to your code to use. A function that only prints can't be used in a calculation.</p>
<p><code>return</code> also ends the function straight away. Anything after it inside the function won't run.</p>
<p>Variables made inside a function only exist inside it. That's called <b>scope</b>.</p>`,
  mistakes: ["Printing inside the function instead of returning.", "Using <code>/</code> instead of <code>//</code>, giving 6.666 instead of 6."],
  task: `<p>Write <code>portions(total, size)</code> that returns how many whole portions you get. Then print <code>portions(1000, 150)</code> and <code>portions(2400, 200)</code>. Chef will also taste-test it with his own numbers.</p>`,
  expect: "6\n12",
  starter: `def portions(total, size):\n    # your code here\n\n`,
  tests: [{ expected: "6\n12" }, { append: "\nprint(portions(900, 100))", expected: "6\n12\n9", hidden: true, note: "Chef tasted your function with 900 and 100." }],
  requires: [[/\breturn\b/, "use return inside your function"]],
  hints: ["Inside the function: return total // size.", "Use // not /.", "The print() calls go outside the function, with no indent."] },

{ svc: 3, title: "The Menu Board", concept: "Dictionaries",
  bark: "Customer wants a price. Look it up on the board and tell them!",
  lesson: `<p>A <b>dictionary</b> matches keys to values, like a menu matches dishes to prices. Curly brackets, <code>key: value</code> pairs.</p>
<pre class="ex">allergens = {"pesto": "nuts", "aioli": "egg"}
print(allergens["pesto"])   <span class="cm"># nuts</span></pre>`,
  notes: `<p>Lists find things by position. Dictionaries find things by name, which is quicker and clearer when you have labels.</p>
<p>Asking for a key that isn't there crashes with a KeyError. <code>.get()</code> gives a fallback instead.</p>
<pre class="ex">menu = {"soup": 6}
print(menu.get("tart", "not on tonight"))
print("soup" in menu)</pre>`,
  mistakes: ["Using round brackets: <code>menu(\"soup\")</code>. It's square: <code>menu[\"soup\"]</code>.", "Putting quotes round a variable: <code>menu[\"dish\"]</code> looks for a dish literally called dish."],
  task: `<p>Read a dish name with <code>input()</code>, look up its price in <code>menu</code>, and print it like this (for burger):</p>`,
  expect: "burger: £14",
  starter: `menu = {"soup": 6, "burger": 14, "pie": 12}\n`,
  tests: [{ inputs: ["burger"], expected: "burger: £14" }, { inputs: ["pie"], expected: "pie: £12" }, { inputs: ["soup"], expected: "soup: £6" }, { swap: swapDict({ soup: 6, burger: 14, pie: 12 }, { soup: 6, burger: 15, pie: 12 }, "menu"), inputs: ["burger"], expected: "burger: £15", hidden: true, note: "Chef put the burger up to £15 to check you looked the price up." }],
  requires: [[/menu\s*\[/, "look up the price with menu[...]"]],
  hints: ["Store the input in a variable, say dish.", "menu[dish] gives you the price. No quotes around dish.", "An f-string with two { } parts does the rest. The £ is just typed in."] },

{ svc: 3, title: "New Specials", concept: "Changing dictionaries",
  bark: "Soup's going up a quid and pie's on tonight at twelve! Update the board and read it all out!",
  lesson: `<p>Add or change a dictionary entry the same way: put a value in for a key.</p>
<pre class="ex">menu = {"soup": 6}
menu["tart"] = 8     <span class="cm"># new key, gets added</span>
menu["soup"] = 7     <span class="cm"># old key, gets changed</span></pre>
<p>Loop through every pair with <code>.items()</code>:</p>
<pre class="ex">for dish, price in menu.items():
    print(dish, price)</pre>`,
  notes: `<p><code>.keys()</code> gives just the keys, <code>.values()</code> just the values. <code>del menu["tart"]</code> removes one.</p>
<pre class="ex">menu = {"soup": 6, "tart": 8}
print(list(menu.keys()))
print(sum(menu.values()))
del menu["tart"]
print(menu)</pre>`,
  mistakes: ["Forgetting that the loop over <code>.items()</code> needs two names: <code>for dish, price in ...</code>"],
  task: `<p>Change soup to 7, add pie at 12, then loop through the menu printing each line like <code>soup: £7</code>. Any order is fine.</p>`,
  expect: "soup: £7\nburger: £14\npie: £12",
  starter: `menu = {"soup": 6, "burger": 14}\n`,
  tests: [{ expected: "soup: £7\nburger: £14\npie: £12", anyOrder: true }, { swap: swapDict({ soup: 6, burger: 14 }, { soup: 6, burger: 14, tart: 5 }, "menu"), expected: "soup: £7\nburger: £14\npie: £12\ntart: £5", anyOrder: true, hidden: true, note: "Chef added a tart to the starting menu to check your loop reads every dish." }],
  requires: [[/\.items\(\)/, "loop with .items()"]],
  hints: ["Two lines to update: menu[\"soup\"] = ... and menu[\"pie\"] = ...", "for dish, price in menu.items():", "Inside: an f-string with dish, a colon, a space, £ and the price."] },

{ svc: 3, title: "Bad Orders", concept: "try / except",
  bark: "Front of house keeps writing numbers as words! Don't let it crash my kitchen. Catch it!",
  lesson: `<p>Some code can fail, like <code>int("four")</code>. Put it in a <code>try</code> block, and if it fails, the <code>except</code> block runs instead of crashing.</p>
<pre class="ex">try:
    n = int("abc")
    print(n)
except ValueError:
    print("Not a number")</pre>`,
  notes: `<p>Naming the error, like <code>except ValueError:</code>, means you only catch the problem you expected. A bare <code>except:</code> catches everything, which can hide real bugs.</p>
<p>This is how real programs stay standing when people type the wrong thing.</p>`,
  mistakes: ["Putting the risky line outside the try.", "Forgetting the colons after try and except."],
  task: `<p>Read the covers. If it's a number, print how many bread rolls (2 each). If it isn't, print:</p>`,
  expect: "That's not a number, chef", starter: ``,
  tests: [{ inputs: ["4"], expected: "8" }, { inputs: ["four"], expected: "That's not a number, chef" }, { inputs: ["10"], expected: "20" }],
  requires: [[/\btry\s*:/, "use try:"], [/\bexcept\b/, "use except"]],
  hints: ["The int(input()) line goes inside try.", "The print of the rolls can go inside try too, after it.", "except ValueError: then the message, indented."] },

{ svc: 3, title: "The Full Ticket", concept: "Boss ticket: everything together",
  bark: "Last ticket of the night. Price up the whole order. Function, loop, menu, total. Don't let me down!",
  lesson: `<p>Last ticket of service. You need a function, a loop, a dictionary and a running total. You've used every one of these already.</p>
<pre class="ex">def count_items(order):
    n = 0
    for dish in order:
        n += 1
    return n

print(count_items(["soup", "pie"]))</pre>`,
  notes: `<p>Write the plan in comments first, then fill in the code under each one:</p>
<pre class="ex"># start the total at 0
# for each dish in the order
#     look up its price and add it
# hand back the total</pre>
<p>That's how working programmers tackle anything bigger than a few lines.</p>`,
  mistakes: ["Returning inside the loop, so it stops after the first dish.", "Putting quotes around dish when looking it up."],
  task: `<p>Write <code>ticket_total(order)</code> that adds up the price of every dish in the order using <code>menu</code>, and returns the total. The print line is already there. Chef will also try other orders.</p>`,
  expect: "Total: £46",
  starter: `menu = {"soup": 6, "burger": 14, "pie": 12}\norder = ["soup", "burger", "burger", "pie"]\n\ndef ticket_total(order):\n    # your code here\n\n\nprint(f"Total: £{ticket_total(order)}")\n`,
  tests: [{ expected: "Total: £46" }, { append: "\nprint(ticket_total([\"pie\", \"pie\"]))", expected: "Total: £46\n24", hidden: true, note: "Chef tried a different order: two pies." }],
  requires: [[/def\s+ticket_total/, "keep the ticket_total function"], [/\bfor\b/, "loop over the order with for"], [/\breturn\b/, "return the total"]],
  hints: ["Inside the function: start total at 0, loop over order, return total.", "For each dish, add menu[dish] to total.", "Indents: the loop is inside the function, the add is inside the loop, the return comes after the loop."] },

/* ---------- GRADUATION ---------- */
{ svc: 4, title: "The Pass Is Yours", concept: "Graduation project: a real program",
  bark: "No more hand-holding. Build the till for the whole restaurant. Orders in, receipt out. Show me what you've learned.",
  lesson: `<p>This is a proper little program, the kind you'd write for a real kitchen. It uses <b>everything</b>: a dictionary, a function, a while loop, a list, if/else, try/except and f-strings.</p>
<p>Plan it in comments first. Then build it one piece at a time and press <b>Send to the pass</b> often. The output tells you how far you've got.</p>
<pre class="ex"># 1. ask for a dish
# 2. while it isn't done:
#      unknown dish?  say so
#      otherwise ask how many (try/except!)
#      save [dish, how_many] in the orders list
#      ask for the next dish
# 3. print each order and the total</pre>`,
  notes: `<p>A list can hold other lists. Each order can be a little list of two things, and a for loop can unpack them straight into two names:</p>
<pre class="ex">orders = []
orders.append(["soup", 2])
orders.append(["pie", 1])
for dish, qty in orders:
    print(dish, qty)</pre>
<p>Ask for the next dish at the <b>bottom</b> of the while loop, every time round, or the loop never ends.</p>
<p><code>dish in menu</code> is True when the dish is one of the menu's keys.</p>`,
  mistakes: ["Forgetting to ask for the next dish inside the loop, so it goes round forever.", "Asking how many for a dish that isn't on the menu. Check the menu first.", "Putting int() outside the try, so a bad number still crashes.", "Printing each line inside the while loop. The receipt comes at the end."],
  task: `<p>Build the till. Keep asking <code>input()</code> for a dish until the server types <code>done</code>.</p>
<ul><li>Dish not on the menu: print <code>Not on the menu: pizza</code> (with the dish's name) and don't ask how many.</li>
<li>Otherwise ask how many. If it isn't a whole number, print <code>How many? Numbers only</code> and skip that dish.</li>
<li>When they type done, print one line per order using <code>line_price()</code>, then the total.</li></ul>
<p>Tonight's orders: soup ×2, pizza, pie × "x", burger ×1. Chef will try other orders too.</p>`,
  expect: "Not on the menu: pizza\nHow many? Numbers only\n2 x soup = £12\n1 x burger = £14\nTotal: £26",
  starter: `menu = {"soup": 6, "burger": 14, "pie": 12, "cake": 5}\n\ndef line_price(dish, qty):\n    # hand back the price for qty of this dish\n\n\n# 1. ask for a dish\n# 2. while it isn't "done", handle the order\n# 3. print each order, then the total\n`,
  tests: [
    { inputs: ["soup", "2", "pizza", "pie", "x", "burger", "1", "done"], expected: "Not on the menu: pizza\nHow many? Numbers only\n2 x soup = £12\n1 x burger = £14\nTotal: £26" },
    { inputs: ["cake", "3", "pie", "2", "done"], expected: "3 x cake = £15\n2 x pie = £24\nTotal: £39", hidden: true, note: "Chef rang through a different order: three cakes and two pies." },
    { inputs: ["done"], expected: "Total: £0", hidden: true, note: "Chef tried a quiet night: nobody ordered anything." },
    { inputs: ["chips", "soup", "two", "soup", "1", "done"], expected: "Not on the menu: chips\nHow many? Numbers only\n1 x soup = £6\nTotal: £6", hidden: true, note: "Chef tried chips (not on the menu) and typed two in words." }],
  requires: [[/def\s+line_price/, "keep the line_price function"], [/\breturn\b/, "line_price should return the price"], [/\bwhile\b/, "take the orders with a while loop"], [/\btry\b/, "use try/except for the number"], [/\.append\(/, "keep the orders in a list with .append()"]],
  hints: ["Start with dish = input(\"Dish: \") and a while dish != \"done\": loop. Ask for the next dish as the last line inside the loop.", "Inside the loop: if dish not in menu: print the message. else: put qty = int(input(\"How many? \")) inside a try, and append [dish, qty] to orders. except ValueError: print the other message.", "After the loop: total = 0, then for dish, qty in orders: work out price = line_price(dish, qty), add it to total and print the line. Finally print the total."] },
];

const RECIPES = [
  { name: "Hello kitchen", desc: "Printing and variables", inputs: "", code: `chef = "Dorran"\nprint("Hello, kitchen!")\nprint(f"Head chef tonight: {chef}")\nprint("Soup", "Bread", "Butter")\n` },
  { name: "Times tables", desc: "for and range()", inputs: "", code: `number = 7\nfor n in range(1, 13):\n    print(f"{n} x {number} = {n * number}")\n` },
  { name: "Guess the dish", desc: "while, input and if", inputs: "soup\npie\nrisotto", code: `secret = "risotto"\nguesses = 0\nwhile True:\n    guess = input("Guess the special: ")\n    guesses += 1\n    if guess == secret:\n        print(f"Got it in {guesses}!")\n        break\n    print("Nope, try again")\n` },
  { name: "Shopping list builder", desc: "Lists that grow", inputs: "flour\neggs\nbutter\ndone", code: `shopping = []\nitem = input("Add item (or done): ")\nwhile item != "done":\n    shopping.append(item)\n    item = input("Add item (or done): ")\nprint(f"{len(shopping)} things to buy:")\nfor thing in shopping:\n    print(f"- {thing}")\n` },
  { name: "Tip splitter", desc: "float() and rounding", inputs: "84.50\n4\n10", code: `bill = float(input("Bill: "))\npeople = int(input("People: "))\ntip = int(input("Tip %: "))\ntotal = bill * (1 + tip / 100)\neach = total / people\nprint(f"Total with tip: £{total:.2f}")\nprint(f"Each pays: £{each:.2f}")\n` },
  { name: "Sizzle Buzz", desc: "The classic % puzzle", inputs: "", code: `# Multiples of 3 say Sizzle, of 5 say Buzz, both say SizzleBuzz\nfor n in range(1, 21):\n    if n % 15 == 0:\n        print("SizzleBuzz")\n    elif n % 3 == 0:\n        print("Sizzle")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)\n` },
  { name: "Stock checker", desc: "Dictionaries and functions", inputs: "", code: `stock = {"eggs": 30, "milk": 2, "flour": 0, "butter": 5}\n\ndef needs_order(amount):\n    return amount < 5\n\nfor item, amount in stock.items():\n    if needs_order(amount):\n        print(f"ORDER {item} (only {amount} left)")\n    else:\n        print(f"{item} is fine")\n` },
  { name: "Dice roller", desc: "Importing a module", inputs: "", code: `import random\n\nfor roll in range(5):\n    d20 = random.randint(1, 20)\n    if d20 == 20:\n        print(f"{d20}! Critical hit")\n    elif d20 == 1:\n        print(f"{d20}... critical miss")\n    else:\n        print(d20)\n` },
];


/* ---------- recap quizzes: one after each service. a = index of the right answer ---------- */
const QUIZZES = [
  [ { q: "What does this print?", code: 'dish = "Soup"\nprint("dish")', o: ["Soup", "dish", "An error"], a: 1, why: "The quote marks make it the word dish. Without quotes, print(dish) would show what's in the tub: Soup." },
    { q: "What does this print?", code: 'covers = 12\nprint(covers + 3)', o: ["123", "15", "covers + 3"], a: 1, why: "12 is a number, so + adds: 15." },
    { q: "Which line puts the variable inside the text properly?", o: ['print("Table {table}")', 'print(f"Table {table}")', 'print(f"Table table")'], a: 1, why: "The f before the quotes switches on the {curly brackets}, and the name goes inside them." },
    { q: "Someone types 4 for input(). What type is it?", code: 'n = input("How many? ")', o: ["A number", "Text (a string)", "It depends"], a: 1, why: "input() always gives you text. Use int() to turn it into a number." } ],
  [ { q: "Which line checks if two things are equal?", o: ["if dish = \"soup\":", "if dish == \"soup\":", "if dish is equal \"soup\""], a: 1, why: "One = puts something in a tub. Two == compares." },
    { q: "temp is 3. What prints?", code: 'temp = 3\nif temp > 5:\n    print("Too warm")\nelif temp > 0:\n    print("Fridge fine")\nelse:\n    print("Frozen")', o: ["Too warm", "Fridge fine", "Frozen"], a: 1, why: "Python checks top to bottom and stops at the first True one. 3 > 0 is the first match." },
    { q: "What's missing at the end of an if line?", o: ["A full stop .", "A colon :", "A semicolon ;"], a: 1, why: "if, elif, else, for, while, def and try lines all end with a colon." },
    { q: "When is this True?", code: 'vegan and gluten_free', o: ["When either one is True", "Only when both are True", "Never"], a: 1, why: "and needs both sides to be True. or needs just one." } ],
  [ { q: "What does menu[0] give you?", code: 'menu = ["soup", "pie", "cake"]', o: ['"soup"', '"pie"', "An error"], a: 0, why: "Lists start counting at 0, so [0] is the first item." },
    { q: "How many times does this print?", code: 'for n in range(3):\n    print("Service!")', o: ["2", "3", "4"], a: 1, why: "range(3) gives 0, 1 and 2: three goes round the loop." },
    { q: "Which adds pie to the end of the list?", o: ['order.add("pie")', 'order.append("pie")', 'order + "pie"'], a: 1, why: ".append() adds one item to the end of a list." },
    { q: "Why does this loop never stop?", code: 'left = 5\nwhile left > 0:\n    print(left)', o: ["left never changes", "print is wrong", "5 is too big"], a: 0, why: "Something inside a while loop has to change, like left -= 1, or it goes round forever." } ],
  [ { q: "What does this print?", code: 'def double(n):\n    return n * 2\n\nprint(double(4))', o: ["4", "8", "double(4)"], a: 1, why: "The function hands back 4 * 2, and print shows it." },
    { q: "What does prices[\"pie\"] give you?", code: 'prices = {"soup": 6, "pie": 12}', o: ["12", '"pie"', "1"], a: 0, why: "A dictionary looks up the value for a key. The key pie has the value 12." },
    { q: "What's the difference between print and return in a function?", o: ["No difference", "print shows it on screen, return hands it back to your code", "return shows it on screen twice"], a: 1, why: "return gives the value back so you can store it or use it in sums. print just shows it." },
    { q: "Someone types four for int(input()). What catches it?", o: ["if / else", "try / except ValueError", "a for loop"], a: 1, why: "int(\"four\") raises a ValueError, and try/except catches it so the program carries on." } ],
];

/* ---------- marking ---------- */
const tidy = s => String(s).replace(/\r/g, "").split("\n").map(l => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
const sortLines = s => tidy(s).split("\n").sort().join("\n");

/* Remove comments (and, unless keepStrings, blank out the text inside strings,
   keeping f-string {expressions}) so technique checks can't be fooled by a comment
   like "# for" or a string like print("return"). */
function scrub(code, keepStrings) {
  let out = "", i = 0;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    if (c === "#") { while (i < n && code[i] !== "\n") i++; continue; }
    if (c === '"' || c === "'") {
      let j = out.length - 1, prefix = "";
      while (j >= 0 && /[rRbBfFuU]/.test(out[j]) && prefix.length < 2) { prefix = out[j] + prefix; j--; }
      if (j >= 0 && /\w/.test(out[j])) prefix = "";
      const isF = /f/i.test(prefix), raw = /r/i.test(prefix);
      const triple = code.startsWith(c + c + c, i), q = triple ? c + c + c : c;
      out += q; i += q.length;
      let depth = 0;
      while (i < n) {
        const ch = code[i];
        if (!triple && ch === "\n") break;
        if (ch === "\\" && !raw && depth === 0) { out += keepStrings ? code.slice(i, i + 2) : "  "; i += 2; continue; }
        if (depth === 0 && code.startsWith(q, i)) { out += q; i += q.length; break; }
        if (isF) {
          if (ch === "{") {
            if (depth === 0 && code[i + 1] === "{") { out += keepStrings ? "{{" : "  "; i += 2; continue; }
            depth++; out += ch; i++; continue;
          }
          if (ch === "}" && depth > 0) { depth--; out += ch; i++; continue; }
          if (depth > 0) { out += ch; i++; continue; }
        }
        out += keepStrings || ch === "\n" ? ch : " ";
        i++;
      }
      continue;
    }
    out += c; i++;
  }
  return out;
}

/* Judge one ticket. run(code, inputs) must resolve to {out, log, error}. */
async function judge(level, code, run) {
  let first = null;
  for (const t of level.tests) {
    let src = code;
    if (t.swap) {
      const re = new RegExp(t.swap.find);
      if (!re.test(src)) return { ok: false, type: "swap", msg: t.swap.missing, first };
      src = src.replace(re, () => t.swap.to);
    }
    src += t.append || "";
    const r = await run(src, t.inputs || []);
    if (!first) first = r;
    if (r.error) return { ok: false, type: "error", t, r, first };
    const ok = t.anyOrder ? sortLines(r.out) === sortLines(t.expected) : tidy(r.out) === tidy(t.expected);
    if (!ok) return { ok: false, type: "wrong", t, r, first };
  }
  const noComments = scrub(code, true), noStrings = scrub(code, false);
  for (const [re, msg] of level.requires || []) {
    const target = /["']/.test(re.source) ? noComments : noStrings;
    if (!re.test(target)) return { ok: false, type: "rule", msg, first };
  }
  return { ok: true, first };
}

const PK = { SERVICES, LEVELS, RECIPES, QUIZZES, judge, scrub, tidy, sortLines };
if (typeof module !== "undefined" && module.exports) module.exports = PK;
else root.PK = PK;
})(typeof window !== "undefined" ? window : globalThis);
