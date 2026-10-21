// content.js - injected into EVERY page you visit (see manifest.json).
// Job: check if this page's site is currently blocked. If yes, replace the page.

async function checkIfBlocked() {
  // Which site are we on? e.g. "www.youtube.com" -> "youtube.com"
  const currentSite = window.location.hostname.replace("www.", "");

  // Load the blocked list that popup.js saved
  const data = await chrome.storage.local.get("blocked");
  const blocked = data.blocked || {};

  // Look through every blocked site
  for (const site in blocked) {
    const endTime = blocked[site];
    const stillActive = endTime > Date.now();

    // Match "youtube.com" itself and subdomains like "m.youtube.com"
    const matches = currentSite === site || currentSite.endsWith("." + site);

    if (matches && stillActive) {
      const minutesLeft = Math.ceil((endTime - Date.now()) / 60000);
      showBlockedScreen(site, minutesLeft);
      return;
    }
  }
}

// Replace the whole page with a "get back to work" message
function showBlockedScreen(site, minutesLeft) {
  document.documentElement.innerHTML = `
    <head><title>Blocked</title></head>
    <body style="font-family: Arial, sans-serif; text-align: center;
                 padding-top: 120px; background: #1e1e2e; color: white;">
      <h1>${site} is blocked</h1>
      <p>Stay focused. ${minutesLeft} minute(s) left.</p>
    </body>
  `;
}

checkIfBlocked();
