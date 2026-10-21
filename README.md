# Study Blocker
A Chrome extension that blocks distracting websites for a set amount of time while you study.
## Features
- Block any site for a number of minutes you choose
- See time remaining and unblock early
- Blocks subdomains too (e.g. m.youtube.com)
## How it works
The popup saves each site and the time its block ends in chrome.storage.
A content script runs on every page, checks that list, and replaces the page
with a focus screen if the block is still active. I store end times instead of
running a countdown, so no background process is needed.
## Install
1. Download or clone this repo
2. Go to chrome://extensions and turn on Developer mode
3. Click "Load unpacked" and select this folder
## Tools Used
JavaScript, HTML, CSS, Chrome Extension API (Manifest V3)
## Things to improve
- Block already-open tabs, not just new page loads
- Make blocks harder to bypass using declarativeNetRequest