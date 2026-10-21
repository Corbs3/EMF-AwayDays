// Holiday types: label, list icon, confetti and the scene drawn along the bottom of the sky.
const HOLIDAY_TYPES = {
  beach:       { label: "Beach",                 icon: "🏖️", confetti: ["🐚", "☀️", "🌊"] },
  city:        { label: "City break",            icon: "🏙️", confetti: ["✨", "📸", "🗺️"] },
  mountains:   { label: "Mountains / skiing",    icon: "⛷️", confetti: ["❄️", "⛄", "❄️"] },
  countryside: { label: "Countryside / camping", icon: "🏕️", confetti: ["🍂", "🌿", "🔥"] },
  staycation:  { label: "Staycation",            icon: "🛋️", confetti: ["☕", "🍪", "📺"] },
  festival:    { label: "Festival / event",      icon: "🎪", confetti: ["🎶", "🎉", "🎸"] },
  cruise:      { label: "Cruise",                icon: "🚢", confetti: ["⚓", "🛟", "🌊"] }
};

const SCENES = {
  beach: `
    <path d="M0 40 Q42 32 85 40 T170 40 T255 40 T340 40 V80 H0Z" fill="#1C6E8C"/>
    <path d="M0 60 Q85 50 170 58 T340 56 V80 H0Z" fill="#F2D49B"/>
    <line x1="72" y1="30" x2="78" y2="60" stroke="#6B4F2A" stroke-width="2"/>
    <path d="M50 36 Q70 14 96 28 Z" fill="#E8574A"/>`,

  city: `
    <g fill="#24384C">
      <rect x="8" y="34" width="26" height="46"/><rect x="38" y="20" width="22" height="60"/>
      <rect x="64" y="40" width="30" height="40"/><rect x="98" y="12" width="18" height="68"/>
      <polygon points="107,2 101,12 113,12"/><rect x="120" y="30" width="34" height="50"/>
      <rect x="158" y="44" width="24" height="36"/><rect x="186" y="24" width="28" height="56"/>
      <rect x="218" y="38" width="22" height="42"/><rect x="244" y="16" width="20" height="64"/>
      <rect x="268" y="34" width="30" height="46"/><rect x="302" y="26" width="30" height="54"/>
    </g>
    <g fill="#FFE07A" opacity="0.85">
      <rect x="44" y="28" width="4" height="5"/><rect x="52" y="40" width="4" height="5"/>
      <rect x="126" y="38" width="4" height="5"/><rect x="140" y="50" width="4" height="5"/>
      <rect x="192" y="32" width="4" height="5"/><rect x="204" y="46" width="4" height="5"/>
      <rect x="250" y="26" width="4" height="5"/><rect x="310" y="36" width="4" height="5"/>
    </g>`,

  mountains: `
    <polygon points="0,80 60,22 120,80" fill="#4E6A85"/>
    <polygon points="80,80 170,8 260,80" fill="#3F5A75"/>
    <polygon points="210,80 280,26 340,70 340,80" fill="#4E6A85"/>
    <g fill="#FFFFFF">
      <polygon points="60,22 45.5,36 52,33 58,38 64,33 74.5,36"/>
      <polygon points="170,8 147.5,26 156,22 163,28 172,22 180,27 192.5,26"/>
      <polygon points="280,26 264.5,38 272,35 279,40 287,35 296,38"/>
    </g>
    <path d="M0 68 Q170 56 340 66 V80 H0Z" fill="#EEF4F8"/>`,

  countryside: `
    <path d="M0 50 Q90 26 190 48 T340 42 V80 H0Z" fill="#6FAE63"/>
    <rect x="78" y="40" width="4" height="12" fill="#5A3E26"/>
    <circle cx="80" cy="36" r="10" fill="#3F7F45"/>
    <path d="M0 64 Q120 46 240 62 T340 58 V80 H0Z" fill="#4F8F49"/>
    <polygon points="230,66 252,36 274,66" fill="#E8834A"/>
    <polygon points="248,66 252,52 256,66" fill="#2A1A0E"/>`,

  staycation: `
    <rect x="0" y="66" width="340" height="14" fill="#8A6A4F"/>
    <rect x="60" y="38" width="120" height="24" rx="6" fill="#3E6E8E"/>
    <rect x="72" y="44" width="30" height="12" rx="4" fill="#F2B84B"/>
    <rect x="138" y="44" width="30" height="12" rx="4" fill="#E8834A"/>
    <rect x="66" y="54" width="108" height="10" rx="3" fill="#4A80A3"/>
    <rect x="52" y="46" width="18" height="20" rx="5" fill="#2F5A76"/>
    <rect x="170" y="46" width="18" height="20" rx="5" fill="#2F5A76"/>
    <rect x="220" y="52" width="40" height="4" fill="#5A3E26"/>
    <rect x="236" y="56" width="8" height="10" fill="#5A3E26"/>
    <rect x="232" y="42" width="12" height="10" rx="2" fill="#FFFFFF"/>
    <path d="M244 44 q6 3 0 6" stroke="#FFFFFF" stroke-width="2" fill="none"/>
    <path d="M236 38 q-3 -4 0 -8 M241 38 q-3 -4 0 -8" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.7"/>`,

  festival: `
    <path d="M0 22 Q50 34 100 24" stroke="#FFFFFF" stroke-width="1" fill="none"/>
    <path d="M240 24 Q290 34 340 22" stroke="#FFFFFF" stroke-width="1" fill="none"/>
    <g>
      <polygon points="15,26 23,26 19,36" fill="#E8574A"/><polygon points="38,29 46,29 42,39" fill="#FFE07A"/>
      <polygon points="62,29 70,29 66,39" fill="#3BB7D9"/><polygon points="85,26 93,26 89,36" fill="#13918D"/>
      <polygon points="252,26 260,26 256,36" fill="#FFE07A"/><polygon points="275,29 283,29 279,39" fill="#E8574A"/>
      <polygon points="298,29 306,29 302,39" fill="#13918D"/><polygon points="321,26 329,26 325,36" fill="#3BB7D9"/>
    </g>
    <polygon points="100,34 170,14 240,34" fill="#3B3B52"/>
    <rect x="110" y="34" width="120" height="30" fill="#2A2A3A"/>
    <g fill="#FFE07A"><circle cx="130" cy="38" r="3"/><circle cx="170" cy="38" r="3"/><circle cx="210" cy="38" r="3"/></g>
    <rect x="0" y="62" width="340" height="18" fill="#4C7A3F"/>
    <g fill="#1D2B3A">
      <circle cx="40" cy="68" r="6"/><circle cx="62" cy="70" r="6"/><circle cx="120" cy="69" r="6"/>
      <circle cx="146" cy="70" r="6"/><circle cx="196" cy="68" r="6"/><circle cx="222" cy="70" r="6"/>
      <circle cx="280" cy="69" r="6"/><circle cx="304" cy="70" r="6"/>
    </g>`,

  cruise: `
    <path d="M0 50 Q42 44 85 50 T170 50 T255 50 T340 50 V80 H0Z" fill="#1C6E8C"/>
    <g class="ship">
      <rect x="206" y="18" width="10" height="10" fill="#E8574A"/>
      <rect x="178" y="28" width="44" height="8" fill="#FFFFFF"/>
      <rect x="168" y="36" width="64" height="10" fill="#FFFFFF"/>
      <g fill="#2F6FA3">
        <rect x="174" y="39" width="5" height="4"/><rect x="184" y="39" width="5" height="4"/>
        <rect x="194" y="39" width="5" height="4"/><rect x="204" y="39" width="5" height="4"/>
        <rect x="214" y="39" width="5" height="4"/><rect x="186" y="30" width="5" height="4"/>
        <rect x="198" y="30" width="5" height="4"/>
      </g>
      <path d="M150 46 L250 46 L238 62 L162 62 Z" fill="#F4F4F4"/>
      <path d="M156 56 L244 56 L238 62 L162 62 Z" fill="#1D2B3A"/>
    </g>
    <path d="M0 60 Q42 55 85 60 T170 60 T255 60 T340 60 V80 H0Z" fill="#17607A"/>`
};

function sceneSvg(type) {
  return `<svg viewBox="0 0 340 80" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${SCENES[type] || SCENES.beach}</svg>`;
}
