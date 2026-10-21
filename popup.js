const $ = id => document.getElementById(id);
let trips = [];
let clockTimer = null;
let confettiDone = false;
const messageCache = new Map(); // keeps the same message while the popup is open

const DEFAULT_CHECKLIST = [
  { text: "Request annual leave" },
  { text: "Add an out-of-office event to your calendar", hint: "This also updates your Slack status" },
  { text: "Set your Gmail out-of-office reply" },
  { text: "Hand over urgent work" }
];

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const defaultChecklist = () => DEFAULT_CHECKLIST.map(i => ({ id: newId(), text: i.text, hint: i.hint || "", done: false }));

// Older trips (from version 1.0) get a type and checklist
function normalise(t) {
  return {
    ...t,
    type: HOLIDAY_TYPES[t.type] ? t.type : "beach",
    checklist: Array.isArray(t.checklist) ? t.checklist : defaultChecklist()
  };
}

const fmt = s => parseDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function message(type, stage, days) {
  const key = `${type}:${stage}:${days}`;
  if (!messageCache.has(key)) messageCache.set(key, pickMessage(type, stage, days));
  return messageCache.get(key);
}

function liveClock(startKey) {
  const ms = Math.max(0, parseDate(startKey) - new Date());
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `That’s ${h.toLocaleString("en-GB")} h ${String(m).padStart(2, "0")} m ${String(s).padStart(2, "0")} s`;
}

function renderHero(status) {
  const welcomeTrip = welcomeBackTrip(trips);
  const type = status.trip ? status.trip.type : welcomeTrip ? welcomeTrip.type : "beach";
  document.body.className = stageFor(status);
  document.body.style.removeProperty("--rise");
  $("scene").innerHTML = sceneSvg(type);
  clearInterval(clockTimer);

  const welcome = welcomeTrip
    ? `<p class="welcome">${escapeHtml(message(welcomeTrip.type, "welcome", 0))}</p>`
    : "";

  if (status.state === "none") {
    $("hero").innerHTML = `${welcome}
      <p class="trip-name">No leave booked</p>
      <p class="big">?</p>
      <p class="mood">Add your next break below and the countdown starts.</p>`;
    return;
  }

  const t = status.trip;
  const title = `${HOLIDAY_TYPES[t.type].icon} ${escapeHtml(t.name)}`;

  if (status.state === "onleave") {
    $("hero").innerHTML = `
      <p class="trip-name">${title}</p>
      <p class="big">${status.daysLeft}</p>
      <p class="unit">${status.daysLeft === 1 ? "day of leave left" : "days of leave left"}</p>
      <p class="mood">You’re on leave. Enjoy it.</p>`;
    return;
  }

  // Sun rises (and the ship sails in) over the last 60 days
  const rise = Math.min(1, Math.max(0.05, 1 - status.days / 60));
  document.body.style.setProperty("--rise", rise.toFixed(2));

  const stage = messageStage(status);
  const todo = t.checklist.filter(i => !i.done).length;
  let nudge = "";
  if (t.checklist.length && todo === 0) {
    nudge = `<p class="nudge">✓ Checklist done. You’re all set.</p>`;
  } else if (todo > 0 && ["lastWeek", "threeDays", "lastDay"].includes(stage)) {
    nudge = `<p class="nudge">${plural(todo, "checklist item")} still to do</p>`;
  }

  $("hero").innerHTML = `${welcome}
    <p class="trip-name">${title}</p>
    <p class="big">${status.days}</p>
    <p class="unit">${status.days === 1 ? "sleep to go" : "sleeps to go"}</p>
    <p class="detail">${stage === "lastDay" ? "Today is your last working day" : `${plural(status.workDays, "working day")} left, including today`}</p>
    <p class="clock" id="clock">${liveClock(t.start)}</p>
    <p class="mood">${escapeHtml(message(t.type, stage, status.days))}</p>
    ${nudge}`;

  clockTimer = setInterval(() => {
    const clock = $("clock");
    if (clock) clock.textContent = liveClock(t.start);
  }, 1000);

  if (stage === "lastDay" && !confettiDone) {
    confettiDone = true;
    launchConfetti(t.type);
  }
}

function renderChecklist(status) {
  const section = $("checklist-section");
  if (status.state !== "counting") {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  const t = status.trip;
  const done = t.checklist.filter(i => i.done).length;
  $("checklist-title").textContent = `Before you go: ${t.name}`;
  $("checklist-progress").textContent = `${done} of ${t.checklist.length} done`;
  $("checklist-bar").style.width = t.checklist.length ? `${(done / t.checklist.length) * 100}%` : "0";
  $("checklist").dataset.trip = t.id;

  $("checklist").innerHTML = t.checklist.map(i => `
    <li class="${i.done ? "done" : ""}">
      <input type="checkbox" id="item-${i.id}" data-item="${i.id}" ${i.done ? "checked" : ""}>
      <label for="item-${i.id}">
        <span>${escapeHtml(i.text)}</span>
        ${i.hint ? `<span class="hint">${escapeHtml(i.hint)}</span>` : ""}
      </label>
      <button class="remove" data-remove-item="${i.id}" aria-label="Remove ${escapeHtml(i.text)}">×</button>
    </li>`).join("") || `<li class="hint">No items. Add one below.</li>`;
}

function renderTrips() {
  const list = activeTrips(trips);
  if (!list.length) {
    $("trips").innerHTML = `<li class="empty">Nothing booked yet.</li>`;
    return;
  }
  $("trips").innerHTML = list.map(t => {
    const used = leaveDaysUsed(t);
    const dates = t.start === t.end ? fmt(t.start) : `${fmt(t.start)} to ${fmt(t.end)}`;
    return `
      <li>
        <span class="t-icon" aria-hidden="true">${HOLIDAY_TYPES[t.type].icon}</span>
        <div class="info">
          <div class="t-name">${escapeHtml(t.name)}</div>
          <div class="t-dates">${dates}</div>
          <div class="t-used">${HOLIDAY_TYPES[t.type].label}, uses ${plural(used, "leave day")}</div>
        </div>
        <button class="remove" data-id="${t.id}" aria-label="Remove ${escapeHtml(t.name)}">Remove</button>
      </li>`;
  }).join("");
}

function render() {
  const status = getStatus(trips);
  renderHero(status);
  renderChecklist(status);
  renderTrips();
}

async function save() {
  trips = pruneTrips(trips);
  await chrome.storage.sync.set({ trips });
  render();
}

// Add leave
$("add-form").addEventListener("submit", async e => {
  e.preventDefault();
  $("error").textContent = "";
  const name = $("name").value.trim() || "Annual leave";
  const type = $("type").value;
  const start = $("start").value;
  const end = $("end").value || start;

  if (!start) return ($("error").textContent = "Choose your first day off.");
  if (end < start) return ($("error").textContent = "Your last day off must be on or after your first day off.");
  if (parseDate(end) < startOfToday()) return ($("error").textContent = "Those dates are in the past. Choose upcoming dates.");

  trips.push({ id: newId(), name, type, start, end, checklist: defaultChecklist() });
  $("add-form").reset();
  $("type").value = "beach";
  await save();
});

// Remove leave
$("trips").addEventListener("click", async e => {
  const btn = e.target.closest(".remove");
  if (!btn) return;
  trips = trips.filter(t => t.id !== btn.dataset.id);
  await save();
});

// Checklist: tick and remove
const currentTrip = () => trips.find(t => t.id === $("checklist").dataset.trip);

$("checklist").addEventListener("change", async e => {
  const trip = currentTrip();
  const item = trip && trip.checklist.find(i => i.id === e.target.dataset.item);
  if (!item) return;
  item.done = e.target.checked;
  await save();
});

$("checklist").addEventListener("click", async e => {
  const btn = e.target.closest("[data-remove-item]");
  const trip = currentTrip();
  if (!btn || !trip) return;
  trip.checklist = trip.checklist.filter(i => i.id !== btn.dataset.removeItem);
  await save();
});

// Checklist: add your own item
$("item-form").addEventListener("submit", async e => {
  e.preventDefault();
  const text = $("item-text").value.trim();
  const trip = currentTrip();
  if (!text || !trip) return;
  trip.checklist.push({ id: newId(), text, hint: "", done: false });
  $("item-text").value = "";
  await save();
  $("item-text").focus();
});

// Keep the end date sensible when the start date changes
$("start").addEventListener("change", e => {
  $("end").min = e.target.value;
  if (!$("end").value || $("end").value < e.target.value) $("end").value = e.target.value;
});

function launchConfetti(type) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = $("confetti");
  const colours = ["#FFE07A", "#3BB7D9", "#E8834A", "#13918D", "#FFFFFF"];
  const emojis = HOLIDAY_TYPES[type].confetti;
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("span");
    if (i % 2) {
      piece.className = "emoji";
      piece.textContent = emojis[i % emojis.length];
    } else {
      piece.style.background = colours[i % colours.length];
    }
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    box.appendChild(piece);
  }
  setTimeout(() => (box.innerHTML = ""), 3600);
}

// Appearance: auto follows the Mac setting
function applyTheme(choice) {
  if (choice === "light" || choice === "dark") document.documentElement.dataset.theme = choice;
  else delete document.documentElement.dataset.theme;
  document.querySelectorAll("[data-theme-choice]").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.themeChoice === (choice || "auto"))));
}

document.querySelector(".seg").addEventListener("click", async e => {
  const btn = e.target.closest("[data-theme-choice]");
  if (!btn) return;
  applyTheme(btn.dataset.themeChoice);
  await chrome.storage.sync.set({ theme: btn.dataset.themeChoice });
});

(async function init() {
  $("type").innerHTML = Object.entries(HOLIDAY_TYPES)
    .map(([key, t]) => `<option value="${key}">${t.icon} ${t.label}</option>`).join("");
  const today = toKey(startOfToday());
  $("start").min = today;
  $("end").min = today;
  const data = await chrome.storage.sync.get(["trips", "theme"]);
  applyTheme(data.theme || "auto");
  trips = (data.trips || []).map(normalise);
  render();
})();
