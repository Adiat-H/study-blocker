# Study Blocker - Learning Guide

## How to run it
1. Open Chrome and go to `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick the `study-blocker` folder
4. Click the puzzle-piece icon and pin Study Blocker
5. Add a site (try `youtube.com`, 2 minutes), then open YouTube
6. After you edit any code, click the refresh icon on the extension card, then reload the page

## The big picture
A browser extension is just a folder of web files (HTML, CSS, JavaScript) plus a
`manifest.json` that tells the browser what the extension is and what it can do.

Our extension has two parts that talk through shared storage:

    popup.js  --writes-->  chrome.storage  <--reads--  content.js
    (you add a site)       (saved list)               (runs on every page)

## File by file

### manifest.json
The ID card of the extension.
- `manifest_version: 3` is the current version of the extension format.
- `permissions: ["storage"]` lets us save data in the browser.
- `action.default_popup` is the page that opens when you click the icon.
- `content_scripts` tells Chrome to inject `content.js` into every page
  (`<all_urls>`). `document_start` means it runs as early as possible.

### popup.html
A normal HTML page: two inputs, a button, and an empty `<ul>`. It loads `popup.js`.

### popup.js
- `getBlocked()` loads the saved object from storage.
- `cleanSite()` turns messy input into a plain domain.
- The button's `onclick` saves `blocked[site] = Date.now() + minutes * 60 * 1000`.
- `showList()` redraws the list and shows the minutes left.

### content.js
- Gets the current page's hostname.
- Loads the blocked list and checks for a match whose end time is still in the future.
- If so, replaces the page with a "blocked" message.

## Key ideas to be able to talk about
1. **Storing an end time instead of a countdown.** We save the exact moment the
   block ends. Nothing has to "tick" in the background. Every page just compares
   `endTime > Date.now()`. That is why the code stays so simple.
2. **Data structure.** A JavaScript object used like a Python dict:
   `{ "youtube.com": 1760000000000 }`.
3. **async / await.** `chrome.storage` takes time to respond, so we `await` it.
   Think of it as "pause here until the data arrives".
4. **Popup vs content script.** They are separate programs. They cannot share
   variables, so they communicate by saving and loading from storage.
5. **Milliseconds.** `Date.now()` returns milliseconds, so 1 minute = 60 * 1000.

## Java / Python comparisons
- JS object `{}` ~ Python dict ~ Java `HashMap`
- `for (const site in blocked)` ~ Python `for site in blocked:`
- `const`/`let` ~ declaring variables (no type needed, unlike Java)
- Template string with backticks and `${x}` ~ Python f-string

## Known limitations (good to mention in an interview, and ideas for v2)
- The block can be bypassed by disabling the extension. A stronger version could
  use the `declarativeNetRequest` API to block requests before the page loads.
- It only checks when a page loads, so a tab already open stays open until reloaded.
- Ideas: preset buttons (25 / 50 min), a schedule, a "most blocked" counter,
  a password to unblock early.

## Practice challenges
1. Change the blocked screen's colors and message.
2. Add a button that blocks the site you're currently on.
3. Show the unblock time as a clock time ("until 3:45 PM").
4. Port the storage idea to SQL thinking: what would the table look like?
