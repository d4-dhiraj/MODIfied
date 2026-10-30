const PARTY = "BJP 🪷"; // yahan kuch bhi badal sakte ho

// ---------- Popup ----------
function showPrankToast() {
  if (document.getElementById("prank-vote-host")) return;

  const host = document.createElement("div");
  host.id = "prank-vote-host";
  const root = host.attachShadow({ mode: "open" });

  root.innerHTML = `
    <style>
      .card {
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        width: 280px; padding: 18px; border-radius: 14px;
        background: #fff; color: #222; font-family: system-ui, sans-serif;
        box-shadow: 0 8px 30px rgba(0,0,0,.3); text-align: center;
        animation: pop .25s ease-out;
      }
      .tick { font-size: 36px; color: #1faa59; }
      h3 { margin: 4px 0; font-size: 18px; }
      .ok { color: #1faa59; font-weight: 600; }
      .party { margin: 8px 0; font-size: 15px; }
      small { color: #777; display: block; margin-top: 8px; }
      button { position: absolute; top: 6px; right: 10px; border: 0;
               background: none; font-size: 18px; cursor: pointer; }
      @keyframes pop {
        from { transform: scale(.85); opacity: 0 }
        to { transform: scale(1); opacity: 1 }
      }
    </style>
    <div class="card">
      <button id="x">×</button>
      <h3>Vote Submitted!</h3>
      <div class="ok">Success</div>
      <div class="tick">✓</div>
      <div>Thank you!</div>
      <div class="party">Your vote goes to ${PARTY}</div>
    </div>`;

  root.getElementById("x").onclick = () => host.remove();
  document.documentElement.appendChild(host);
  setTimeout(() => host.remove(), 5000);
}

// ---------- Submit detection ----------
const SUBMIT_RE = /^\s*submit(\s|$)/i; // "Submit", "Submit Code", "Submit Answer"

function looksLikeSubmitButton(el) {
  if (!el || el.nodeType !== 1) return false;

  const isClickable = el.matches?.(
    'button, input[type="submit"], input[type="button"], [role="button"], a'
  );
  if (!isClickable) return false;

  // type=submit wale buttons (Codeforces, normal forms)
  if (el.matches('input[type="submit"], button[type="submit"]')) return true;

  // LeetCode ka known attribute
  if (el.getAttribute("data-e2e-locator") === "console-submit-button") return true;

  // Text / value / aria-label se match (GFG, HackerRank, etc.)
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
  true // capture phase, preventDefault nahi, to original submit chalta rahega
);

// 2) Form submit detection (Enter press se submit hone par)
document.addEventListener(
  "submit",
  () => {
    try { sessionStorage.setItem("prankVotePending", "1"); } catch (e) {}
    showPrankToast();
  },
  true
);

// 3) Navigation ke baad naye page par toast
try {
  if (sessionStorage.getItem("prankVotePending")) {
    sessionStorage.removeItem("prankVotePending");
    showPrankToast();
  }
} catch (e) {}