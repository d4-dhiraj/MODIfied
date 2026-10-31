const DEFAULTS = {
  enabled: true, random: false, codingOnly: false,
  party: "BJP 🪷", sound: true,
};

const modiQuotes = [
  "Fir Ek Baar, Modi Baar! 🪷",
  "Mitron! Your vote has been successfully registered.",
  "Digital India Masterstroke: Vote submitted successfully!",
  "Waah Modiji Waah!",
  "Aapka ek click, desh ke vikas ke liye!"
];

const RANDOM_PARTIES = [
  "BJP 🪷", "Congress ✋", "AAP 🧹", "Samajwadi Party 🚲",
  "BSP 🐘", "NOTA 🙃", "Chai Party ☕", "Maggi Party 🍜",
];
const CODING_HOSTS = [
  "leetcode.com", "geeksforgeeks.org", "codeforces.com",
  "hackerrank.com", "codechef.com", "atcoder.jp",
];

let settings = { ...DEFAULTS };
let lastShown = 0;

// ---------- Settings ----------
try {
  chrome.storage.sync.get(DEFAULTS, (s) => (settings = s));
  chrome.storage.onChanged.addListener((changes) => {
    for (const k in changes) settings[k] = changes[k].newValue;
  });
} catch (e) {}

function shouldRun() {
  if (!settings.enabled) return false;
  if (settings.codingOnly) {
    return CODING_HOSTS.some((h) => location.hostname.endsWith(h));
  }
  return true;
}

function pickParty() {
  if (settings.random) {
    return RANDOM_PARTIES[Math.floor(Math.random() * RANDOM_PARTIES.length)];
  }
  return settings.party;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ---------- Sound ----------
function ding() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    
  } catch (e) {}
}
// ---------- Meme sounds ----------
const SOUND_FILES = ["s1.mp3", "s2.mp3", "s3.mp3", "s4.mp3", "s5.mp3"];
const SOUND_CHANCE = 1; // 1 = hamesha, 0.5 = aadhi baar
const SOUND_VOLUME = 0.7;
let lastSound = -1;

function playRandomSound() {
  if (!settings.sound) return;
  if (Math.random() > SOUND_CHANCE) return;

  // same sound do baar lagatar na aaye
  let i;
  do {
    i = Math.floor(Math.random() * SOUND_FILES.length);
  } while (i === lastSound && SOUND_FILES.length > 1);
  lastSound = i;

  try {
    const audio = new Audio(chrome.runtime.getURL("sounds/" + SOUND_FILES[i]));
    audio.volume = SOUND_VOLUME;
    audio.play().catch(() => ding()); // block ho gaya to simple ding
  } catch (e) {
    ding();
  }
}
// ---------- Counter ----------
function bumpCounter() {
  try {
    chrome.storage.local.get({ count: 0 }, (r) =>
      chrome.storage.local.set({ count: r.count + 1 })
    );
  } catch (e) {}
}

// ---------- Popup ----------
function showPrankToast() {
  const now = Date.now();
  if (!shouldRun() || now - lastShown < 3000) return;
  if (document.getElementById("prank-vote-host")) return;
  lastShown = now;

  const party = escapeHtml(pickParty());
  
  // 1. Lotus aur Sparkles wala Confetti mix
  const emojis = ["🎉", "🪷", "✨", "🇮🇳"];
  const confetti = Array.from({ length: 16 }, () => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    return `<span class="c" style="left:${left}%;animation-delay:${delay}s">${randomEmoji}</span>`;
  }).join("");

  // 2. Random Modi Quote uthao
  const randomQuote = modiQuotes[Math.floor(Math.random() * modiQuotes.length)];

  const host = document.createElement("div");
  host.id = "prank-vote-host";
  const root = host.attachShadow({ mode: "open" });

  root.innerHTML = `
    <style>
      :host { all: initial; }
      .card {
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        width: 290px; padding: 18px 18px 14px; border-radius: 14px;
        background: #fff; color: #222; font-family: system-ui, sans-serif;
        box-shadow: 0 8px 30px rgba(0,0,0,.3); text-align: center;
        overflow: hidden; animation: pop .25s ease-out;
      }
      @media (prefers-color-scheme: dark) {
        .card { background: #1f2430; color: #eee; }
        small { color: #aaa !important; }
      }
      .tick { font-size: 32px; color: #1faa59; margin: 2px 0; }
      h3 { margin: 4px 0; font-size: 18px; }
      .ok { color: #1faa59; font-weight: 600; font-size: 14px; }
      .quote { font-weight: 600; margin: 8px 0; font-size: 13px; color: #e65100; }
      @media (prefers-color-scheme: dark) { .quote { color: #ffb74d; } }
      .party { margin: 6px 0; font-size: 14px; }
      small { color: #777; display: block; margin-top: 8px; font-size: 11px; }
      #x { position: absolute; top: 6px; right: 10px; border: 0;
           background: none; font-size: 18px; cursor: pointer; color: inherit; }
      .bar { position: absolute; left: 0; bottom: 0; height: 4px; width: 100%;
             background: #1faa59; transform-origin: left;
             animation: shrink 5s linear forwards; }
      .c { position: absolute; top: -20px; font-size: 16px;
           animation: fall 1.6s ease-in forwards; pointer-events: none; }
      @keyframes pop { from { transform: scale(.85); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      @keyframes shrink { to { transform: scaleX(0) } }
      @keyframes fall { to { transform: translateY(260px) rotate(360deg); opacity: 0 } }
    </style>
    <div class="card">
      ${confetti}
      <button id="x">×</button>
      <h3>Vote Submitted!</h3>
      <div class="ok">Success 🪷</div>
      <div class="tick">✓</div>
      <div class="quote">"${randomQuote}"</div>
      <div class="party">Your vote goes to <b>${party}</b></div>
      <small>Just a prank notification. No actual vote was cast.</small>
      <div class="bar"></div>
    </div>`;

  root.getElementById("x").onclick = () => host.remove();
  document.documentElement.appendChild(host);
  setTimeout(() => host.remove(), 5000);

  playRandomSound();
  bumpCounter();
}

// ---------- Submit detection ----------
const SUBMIT_RE = /^\s*submit(\s|$)/i;

function looksLikeSubmitButton(el) {
  if (!el || el.nodeType !== 1) return false;
  const isClickable = el.matches?.(
    'button, input[type="submit"], input[type="button"], [role="button"], a'
  );
  if (!isClickable) return false;

  if (el.matches('input[type="submit"], button[type="submit"]')) return true;
  if (el.getAttribute("data-e2e-locator") === "console-submit-button") return true;

  const label =
    el.value || el.getAttribute("aria-label") || el.innerText || el.textContent || "";
  return SUBMIT_RE.test(label.trim());
}

// 1) Click detection (JS-based buttons)
document.addEventListener(
  "click",
  (e) => {
    for (const node of e.composedPath()) {
      if (looksLikeSubmitButton(node)) {
        showPrankToast();
        break;
      }
    }
  },
  true
);

// 2) Form submit (Enter press etc.)
document.addEventListener(
  "submit",
  () => {
    try { sessionStorage.setItem("prankVotePending", "1"); } catch (e) {}
    showPrankToast();
  },
  true
);

// 3) Navigation ke baad naye page par
try {
  if (sessionStorage.getItem("prankVotePending")) {
    sessionStorage.removeItem("prankVotePending");
    setTimeout(showPrankToast, 300); // settings load hone ka wait
  }
} catch (e) {}