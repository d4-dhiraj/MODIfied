# 🗳️ MODIfied - Prank Vote Extension

A fun, lightweight browser extension (Manifest V3) that pops up a fake "Vote Submitted" notification with confetti, party names, and funny meme sounds whenever someone clicks a **Submit** button! 

> **Disclaimer:** This extension is purely for entertainment and prank purposes only. No actual votes are cast or collected. 

---

## ✨ Features

* **Instant Prank Trigger:** Automatically detects `Submit` buttons or form submissions across websites (especially tailored for coding platforms like LeetCode, Codeforces, and GFG).
* **Meme Sound Effects:** Plays random funny meme audio clips (`s1.mp3` to `s5.mp3`) on submission with a synthetic fallback ding.
* **Random Party Mode:** Automatically shuffles through hilarious options (BJP 🪷, Congress ✋, AAP 🧹, NOTA 🙃, Chai Party ☕, Maggi Party 🍜, etc.).
* **Custom Controls:** Easy popup settings to toggle the extension on/off, enable/disable meme sounds, switch to random party mode, or restrict it to coding sites only.
* **Fake Vote Counter:** Keeps track of how many "fake votes" you've cast using `chrome.storage`.
* **Dark Mode Support:** Automatically adapts to your system/browser theme.

---

## 📂 Project Structure

```text
MODIfied/
├── manifest.json       # Extension configuration (Manifest V3)
├── popup.html          # Extension popup UI
├── popup.js            # Popup controls & storage sync
├── content.js          # DOM observer & prank trigger logic
├── icons/              # Extension logos (16, 48, 128 px)
└── sounds/             # Meme sound clips (s1.mp3 - s5.mp3)
