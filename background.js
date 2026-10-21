importScripts("holidays.js", "scenes.js");

const BADGE_COLOURS = {
  far: "#5B6B7F",
  mid: "#2F6FA3",
  near: "#E07B24",
  onleave: "#13918D"
};

async function updateBadge() {
  const { trips = [] } = await chrome.storage.sync.get("trips");
  const status = getStatus(trips);
  const stage = stageFor(status);

  if (status.state === "none") {
    await chrome.action.setBadgeText({ text: "" });
    await chrome.action.setTitle({ title: "AwayDays: no leave booked" });
    return;
  }

  const text = status.state === "onleave" ? "ON"
    : isLastWorkingDay(status) ? "BYE"
    : String(Math.min(status.days, 999));
  const title = status.state === "onleave"
    ? `AwayDays: on leave (${status.trip.name})`
    : `AwayDays: ${status.days} ${status.days === 1 ? "sleep" : "sleeps"} until ${status.trip.name}`;

  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOURS[stage] });
  await chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
  await chrome.action.setTitle({ title });
}

function ensureAlarm() {
  chrome.alarms.create("tick", { periodInMinutes: 30 });
}

chrome.runtime.onInstalled.addListener(() => { ensureAlarm(); updateBadge(); });
chrome.runtime.onStartup.addListener(() => { ensureAlarm(); updateBadge(); });
chrome.alarms.onAlarm.addListener(updateBadge);
chrome.storage.onChanged.addListener(updateBadge);
