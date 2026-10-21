# AwayDays

A Chrome extension that counts down the sleeps to your next annual leave, with a pre-leave checklist, holiday scenes and messages that build as your break gets closer.

## Features

- **Sleeps countdown** - big days-left number with a live hours, minutes and seconds clock
- **Working days left** - skips weekends and England & Wales bank holidays
- **Toolbar badge** - shows days left on the icon, "BYE" on your last working day and "ON" while you're away
- **Leave used** - shows how many leave days each trip uses
- **Holiday types** - beach, city break, mountains / skiing, countryside / camping, staycation, festival / event and cruise, each with its own scene and icon
- **Changing sky** - colours warm up and the sun rises as leave gets closer; the cruise ship sails in
- **Mood messages** - change as leave gets closer, matched to your type of holiday
- **Pre-leave checklist** - starter items for each trip, plus your own, with a progress bar
- **Checklist nudge** - a reminder in your last week if anything is still unticked
- **Last day confetti** - themed to your type of holiday
- **Welcome back** - a message for your first two working days back
- **Light and dark mode** - or follow your system setting
- **Synced** - trips sync across your own Chrome browsers when Chrome sync is on

## Customising

**Mood and welcome back messages** are in `messages.js`, grouped by holiday type and stage:

```js
beach: {
  far:       ["Somewhere, a sun lounger has your name on it.", "The sea isn't going anywhere."],
  month:     ["Time to dig out the flip-flops.", "Under a month until sand in everything."],
  twoWeeks:  [...],
  lastWeek:  [...],
  threeDays: ["{Sleeps} until the seaside.", "You can almost hear the waves."],
  lastDay:   [...],
  welcome:   [...]
},
```

Add as many messages per stage as you like; one is picked at random. `{Sleeps}` becomes "Three sleeps", "Two sleeps" or "One sleep".

**Starter checklist items** are at the top of `popup.js` in `DEFAULT_CHECKLIST`.

**Holiday types and scenes** are in `scenes.js`. Each type has a label, icon, confetti emojis and an SVG scene.

**Bank holidays** are in `holidays.js` and currently cover England & Wales from 2026 to 2028. Add new dates in `YYYY-MM-DD` format as they are published on [GOV.UK](https://www.gov.uk/bank-holidays).

## Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the downloaded folder

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Saves your trips, checklist and appearance choice in your browser |
| `alarms` | Refreshes the days-left number on the toolbar icon every 30 minutes |

## File Structure

```
awaydays/
  manifest.json     Extension config and permissions
  background.js     Service worker - updates the toolbar badge and tooltip
  holidays.js       Bank holidays and date logic (working days, stages, welcome back)
  messages.js       Mood and welcome back messages by holiday type
  scenes.js         Holiday types, icons, confetti and SVG scenes
  popup.html        Popup UI - countdown, checklist, trip list and add form
  popup.css         Popup styles, including light and dark mode
  popup.js          Popup logic - countdown, checklist, trips and appearance
  icons/            Extension icons (16px, 32px, 48px, 128px)
```

## Licence

MIT
