// Shared date logic, used by both the popup and the background worker.

// England & Wales bank holidays (GOV.UK). Add new years here when they are published.
const BANK_HOLIDAYS = new Set([
  "2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25",
  "2026-08-31", "2026-12-25", "2026-12-28",
  "2027-01-01", "2027-03-26", "2027-03-29", "2027-05-03", "2027-05-31",
  "2027-08-30", "2027-12-27", "2027-12-28",
  "2028-01-03", "2028-04-14", "2028-04-17", "2028-05-01", "2028-05-29",
  "2028-08-28", "2028-12-25", "2028-12-26"
]);

const DAY_MS = 86400000;

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// Rounding keeps this correct across clock changes (BST/GMT).
function daysBetween(a, b) {
  return Math.round((b - a) / DAY_MS);
}

function isWorkingDay(d) {
  const w = d.getDay();
  return w !== 0 && w !== 6 && !BANK_HOLIDAYS.has(toKey(d));
}

// Working days from `from` up to but not including `to`.
function countWorkingDays(from, to) {
  let n = 0;
  const d = new Date(from);
  while (d < to) {
    if (isWorkingDay(d)) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

// Leave days a trip uses (start and end both included).
function leaveDaysUsed(trip) {
  const end = parseDate(trip.end);
  end.setDate(end.getDate() + 1);
  return countWorkingDays(parseDate(trip.start), end);
}

// Trips that have not finished yet, soonest first.
function activeTrips(trips) {
  const today = startOfToday();
  return trips
    .filter(t => parseDate(t.end) >= today)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function getStatus(trips) {
  const today = startOfToday();
  const list = activeTrips(trips);
  const current = list.find(t => parseDate(t.start) <= today);
  if (current) {
    return { state: "onleave", trip: current, daysLeft: daysBetween(today, parseDate(current.end)) + 1 };
  }
  const next = list[0];
  if (!next) return { state: "none" };
  const start = parseDate(next.start);
  return {
    state: "counting",
    trip: next,
    days: daysBetween(today, start),
    workDays: countWorkingDays(today, start)
  };
}

// Sky stage drives the colours in the popup and the badge.
function stageFor(status) {
  if (status.state === "onleave") return "onleave";
  if (status.state === "none") return "none";
  if (status.days <= 7) return "near";
  if (status.days <= 30) return "mid";
  return "far";
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function firstWorkingDayAfter(dateKey) {
  let d = addDays(parseDate(dateKey), 1);
  while (!isWorkingDay(d)) d = addDays(d, 1);
  return d;
}

// Is today your last working day before leave?
function isLastWorkingDay(status) {
  return status.state === "counting" && isWorkingDay(startOfToday()) && status.workDays === 1;
}

// Which set of mood messages to use.
function messageStage(status) {
  if (isLastWorkingDay(status)) return "lastDay";
  const d = status.days;
  if (d <= 3) return "threeDays";
  if (d <= 7) return "lastWeek";
  if (d <= 14) return "twoWeeks";
  if (d <= 30) return "month";
  return "far";
}

// The trip you've just come back from, during your first 2 working days back.
function welcomeBackTrip(trips) {
  const today = startOfToday();
  if (!isWorkingDay(today)) return null;
  const ended = trips
    .filter(t => parseDate(t.end) < today)
    .sort((a, b) => b.end.localeCompare(a.end));
  const trip = ended[0];
  if (!trip) return null;
  const back = firstWorkingDayAfter(trip.end);
  const workingDaysBack = countWorkingDays(back, addDays(today, 1));
  return workingDaysBack >= 1 && workingDaysBack <= 2 ? trip : null;
}

// Keep finished trips for 2 weeks so the welcome back message can find them.
function pruneTrips(trips) {
  const cutoff = addDays(startOfToday(), -14);
  return trips.filter(t => parseDate(t.end) >= cutoff);
}
