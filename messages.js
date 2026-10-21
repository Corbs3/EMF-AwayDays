// Mood messages by holiday type and stage. Two or more per stage, picked at random.
// {Sleeps} becomes "Three sleeps", "Two sleeps" or "One sleep".
const MESSAGES = {
  general: {
    far: ["It’s on the calendar. That’s what counts.", "A long way off, but it’s coming."],
    month: ["Under a month. Hold steady.", "Time to start daydreaming properly."],
    twoWeeks: ["Two weeks. Start the playlist.", "Fortnight to go. Keep calm and carry on."],
    lastWeek: ["Single figures. Nearly there.", "Is your out-of-office message drafted?"],
    threeDays: ["{Sleeps}. You can almost taste it.", "Start wrapping things up."],
    lastDay: ["Final shift. Make it count.", "Log off on time today. You’ve earned it."],
    welcome: ["Welcome back. Take the inbox one email at a time.", "Back in the chair. Coffee first, emails second."]
  },
  beach: {
    far: ["Somewhere, a sun lounger has your name on it.", "The sea isn’t going anywhere."],
    month: ["Time to dig out the flip-flops.", "Under a month until sand in everything."],
    twoWeeks: ["Two weeks. Check your swimwear still fits.", "Start building the beach playlist."],
    lastWeek: ["Sun cream bought yet?", "Nearly time to swap screens for waves."],
    threeDays: ["{Sleeps} until the seaside.", "You can almost hear the waves."],
    lastDay: ["Last shift. Next stop: the beach.", "Close the laptop, open the beach bag."],
    welcome: ["Welcome back. Still finding sand?", "Tan fading, inbox growing. Coffee first."]
  },
  city: {
    far: ["The city lights can wait. For now.", "Start a list of places to eat."],
    month: ["Time to plan your must-sees.", "Comfy shoes? You’ll need them."],
    twoWeeks: ["Two weeks. Download the offline map.", "Start practising your ‘please’ and ‘thank you’."],
    lastWeek: ["Check your passport’s in date.", "Restaurant booked? Good."],
    threeDays: ["{Sleeps} until exploring.", "Charge the power bank."],
    lastDay: ["Last shift. The city’s waiting.", "Swap spreadsheets for streets."],
    welcome: ["Welcome back. How many steps did you do?", "Back from the big smoke. Easy does it."]
  },
  mountains: {
    far: ["The mountains are waiting.", "Snow’s on the way. For you, anyway."],
    month: ["Time to find those thermals.", "Start your ski squats now. Trust us."],
    twoWeeks: ["Two weeks. Goggles found?", "Check the snow forecast. Then check again."],
    lastWeek: ["Nearly time for fresh powder.", "Gloves. Both of them."],
    threeDays: ["{Sleeps} until the slopes.", "Wax on, logged off."],
    lastDay: ["Last shift. Next stop: first lift.", "Close the laptop, open the piste map."],
    welcome: ["Welcome back. Legs still working?", "Back from the slopes. Hot chocolate allowed."]
  },
  countryside: {
    far: ["Fresh air is on the calendar.", "The hills will still be there."],
    month: ["Time to check the tent for holes.", "Dig out the walking boots."],
    twoWeeks: ["Two weeks. Find the head torch.", "Start planning your walks."],
    lastWeek: ["Check the weather. Pack a coat anyway.", "Marshmallows on the shopping list?"],
    threeDays: ["{Sleeps} until fresh air.", "Nearly time to swap Wi-Fi for wildlife."],
    lastDay: ["Last shift. Next stop: the great outdoors.", "Log off and head for the hills."],
    welcome: ["Welcome back. Still smell of campfire?", "Back to signal. Brace yourself."]
  },
  staycation: {
    far: ["Sofa’s already reserved.", "Rest is on the calendar."],
    month: ["Start a list of films to watch.", "Plan nothing. That’s the plan."],
    twoWeeks: ["Two weeks. Stock up on biscuits.", "Start choosing your box set."],
    lastWeek: ["Nearly time for lie-ins.", "Hide the alarm clock."],
    threeDays: ["{Sleeps} until slippers all day.", "Kettle’s warming up."],
    lastDay: ["Last shift. Sofa’s ready when you are.", "Log off. Put the kettle on."],
    welcome: ["Welcome back. Hope you rested properly.", "Back from the sofa. It misses you already."]
  },
  festival: {
    far: ["The countdown to the crowds begins.", "Tickets got? Good."],
    month: ["Time to plan who you’re seeing.", "Wellies or trainers? Decide now."],
    twoWeeks: ["Two weeks. Check the line-up times.", "Start the pre-festival playlist."],
    lastWeek: ["Pack a poncho. Just in case.", "Charge everything. Twice."],
    threeDays: ["{Sleeps} until showtime.", "Nearly time to sing badly in public."],
    lastDay: ["Last shift. Next stop: front row.", "Log off, turn up."],
    welcome: ["Welcome back. Voice recovered yet?", "Back from the crowds. Quiet day, maybe?"]
  },
  cruise: {
    far: ["Your ship is on the horizon.", "Smooth sailing ahead."],
    month: ["Time to plan your ports.", "Start practising your captain’s wave."],
    twoWeeks: ["Two weeks. Pack something smart for dinner.", "Check your boarding time."],
    lastWeek: ["Nearly time to set sail.", "Travel sickness bands? Just in case."],
    threeDays: ["{Sleeps} until all aboard.", "Anchors nearly up."],
    lastDay: ["Last shift. The ship’s waiting.", "Log off. Set sail."],
    welcome: ["Welcome back. Found your land legs?", "Back on dry land. Steady as she goes."]
  }
};

function pickMessage(type, stage, days) {
  const list = (MESSAGES[type] && MESSAGES[type][stage]) || MESSAGES.general[stage] || [];
  const msg = list[Math.floor(Math.random() * list.length)] || "";
  const sleeps = ["One sleep", "Two sleeps", "Three sleeps"][days - 1] || `${days} sleeps`;
  return msg.replace("{Sleeps}", sleeps);
}
