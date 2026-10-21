// popup.js - runs when you click the extension icon.
// Job: let the user add a site + duration, save it, and show the list.

// Grab the HTML elements we need (like finding objects by name)
const siteInput = document.getElementById("siteInput");
const minutesInput = document.getElementById("minutesInput");
const blockBtn = document.getElementById("blockBtn");
const blockedList = document.getElementById("blockedList");

// Turn whatever the user typed into a clean hostname.
// "https://www.YouTube.com/watch?v=123" -> "youtube.com"
function cleanSite(text) {
  let site = text.trim().toLowerCase();
  site = site.replace("https://", "").replace("http://", "");
  site = site.replace("www.", "");
  site = site.split("/")[0]; // drop everything after the first "/"
  return site;
}

// Read the saved list from browser storage.
// Format: { "youtube.com": 1760000000000, ... }
// key = site, value = the time (in milliseconds) when the block ends
async function getBlocked() {
  const data = await chrome.storage.local.get("blocked");
  return data.blocked || {}; // if nothing saved yet, use an empty object
}

// Draw the list on screen, skipping blocks that already expired
async function showList() {
  const blocked = await getBlocked();
  const now = Date.now();
  blockedList.innerHTML = ""; // clear the old list

  for (const site in blocked) {
    const endTime = blocked[site];
    if (endTime <= now) continue; // expired, don't show

    const minutesLeft = Math.ceil((endTime - now) / 60000);
    const li = document.createElement("li");
    li.textContent = site + " - " + minutesLeft + " min left ";

    // A small button to unblock early
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Unblock";
    removeBtn.onclick = async function () {
      delete blocked[site];
      await chrome.storage.local.set({ blocked: blocked });
      showList();
    };

    li.appendChild(removeBtn);
    blockedList.appendChild(li);
  }
}

// When the "Block it" button is clicked
blockBtn.onclick = async function () {
  const site = cleanSite(siteInput.value);
  const minutes = Number(minutesInput.value);

  if (site === "" || minutes <= 0) {
    alert("Enter a website and a number of minutes.");
    return;
  }

  const blocked = await getBlocked();
  blocked[site] = Date.now() + minutes * 60 * 1000; // end time = now + minutes
  await chrome.storage.local.set({ blocked: blocked });

  siteInput.value = "";
  minutesInput.value = "";
  showList();
};

// Show the list as soon as the popup opens
showList();
