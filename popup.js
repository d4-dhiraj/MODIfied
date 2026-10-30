const DEFAULTS = {
  enabled: true, random: false, codingOnly: false,
  party: "BJP 🪷", sound: true,
};

const $ = (id) => document.getElementById(id);

chrome.storage.sync.get(DEFAULTS, (s) => {
  $("enabled").checked = s.enabled;
  $("random").checked = s.random;
  $("codingOnly").checked = s.codingOnly;
  $("party").value = s.party;
  $("party").disabled = s.random;
  $("sound").checked = s.sound;
});

chrome.storage.local.get({ count: 0 }, (r) => {
  $("count").textContent = r.count;
});

function save() {
  $("party").disabled = $("random").checked;
  chrome.storage.sync.set({
    enabled: $("enabled").checked,
    random: $("random").checked,
    codingOnly: $("codingOnly").checked,
    sound: $("sound").checked,
    party: $("party").value.trim() || DEFAULTS.party,
  });
}

["enabled", "random", "codingOnly", "sound"].forEach((id) =>
  $(id).addEventListener("change", save)
);
$("party").addEventListener("input", save);