/* =========================================================
   CODE MONSOON - STORY DATA & ART GENERATORS
   Characters, SVG Art Engine, Curriculum & Chapters (1-8)
   ========================================================= */

let UID = 0;
const INK = "#16142a";
const C = {
  meera: { outfit: "#ffc21a", hair: "#1d1a2b", skin: "#c98b5e" },
  rafiq: { outfit: "#3e7d4f", hair: "#2b2420", skin: "#9a6440", cap: "#2f5f3c" },
  aaji:  { outfit: "#d9507a", hair: "#c9c9cf", skin: "#b98258", border: "#ffc21a" },
  kavya: { outfit: "#b9925a", hair: "#1d1a2b", skin: "#a8714a" },
  desh:  { outfit: "#5a8fd8", hair: "#3a2e2a", skin: "#c08a62" }
};

const NAMES = {
  meera: "Meera",
  bolt: "BOLT",
  rafiq: "Rafiq",
  aaji: "Aaji",
  kavya: "Officer Kavya Rao",
  desh: "Mrs. Deshpande",
  gridlock: "GRIDLOCK",
  gridfix: "GRIDLOCK (Repaired)"
};

/* SVG Helpers */
function skyDefs(id, mood) {
  const tones = {
    rain: ["#7d8aa8", "#b7c1d3"],
    night: ["#0e1230", "#2c3570"],
    dawn: ["#f6b26b", "#c8d6ea"],
    clear: ["#7cc7f2", "#d9f0ff"],
    indoor: ["#d8d2c4", "#ece8de"],
    server: ["#120a16", "#2a0c18"],
    fixed: ["#06162a", "#123a5a"],
    industrial: ["#141b2b", "#273752"]
  }[mood] || ["#7d8aa8", "#b7c1d3"];

  return `<defs>
    <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tones[0]}"/>
      <stop offset="1" stop-color="${tones[1]}"/>
    </linearGradient>
    <pattern id="dots${id}" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1" fill="${INK}" opacity=".12"/>
    </pattern>
    <pattern id="rn${id}" width="24" height="30" patternUnits="userSpaceOnUse">
      <line x1="14" y1="0" x2="8" y2="14" stroke="#e8f1ff" stroke-width="1.4" opacity=".75"/>
      <line x1="4" y1="16" x2="0" y2="25" stroke="#e8f1ff" stroke-width="1" opacity=".5"/>
    </pattern>
  </defs>
  <rect width="400" height="220" fill="url(#sky${id})"/>`;
}

function city(night) {
  const b = [
    [-4, 64, 120, "#c98f6b"], [58, 52, 96, "#8fb3a3"], [108, 70, 140, "#d7b46a"],
    [176, 48, 104, "#a993c2"], [222, 66, 128, "#e0a07a"], [286, 56, 92, "#7fa7c9"],
    [340, 66, 134, "#c4a68d"]
  ];
  let s = "";
  b.forEach(([x, w, h, col], i) => {
    const y = 170 - h;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${night ? "#262c5c" : col}" stroke="${INK}" stroke-width="2.5"/>`;
    if (i % 2 === 0) s += `<rect x="${x + w - 22}" y="${y - 13}" width="15" height="13" rx="3" fill="${night ? "#1b2147" : "#2b3a46"}" stroke="${INK}" stroke-width="2"/>`;
    for (let r = y + 12; r < 160; r += 22) {
      for (let c = x + 8; c < x + w - 10; c += 17) {
        const lit = night ? ((r * 7 + c * 3) % 5 < 2) : false;
        s += `<rect x="${c}" y="${r}" width="9" height="11" fill="${lit ? "#ffd36a" : (night ? "#141838" : "#3e4a63")}" stroke="${INK}" stroke-width="1.2"/>`;
      }
    }
  });
  s += `<rect x="112" y="122" width="62" height="16" fill="${night ? "#3a2f5a" : "#f4e3b0"}" stroke="${INK}" stroke-width="2"/><text x="143" y="134" text-anchor="middle" font-family="Kalam, Hind, sans-serif" font-size="10" font-weight="700" fill="${night ? "#ffd36a" : "#a3261b"}">शांतिपूर किराणा</text>`;
  s += `<line x1="0" y1="40" x2="400" y2="58" stroke="${INK}" stroke-width="1.2" opacity=".6"/><line x1="0" y1="46" x2="400" y2="60" stroke="${INK}" stroke-width="1" opacity=".45"/>`;
  return s;
}

function ground(water, night) {
  const wy = 210 - water * 60;
  let s = `<rect x="0" y="168" width="400" height="52" fill="${night ? "#2a2f4f" : "#7a7f8a"}" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<rect x="0" y="168" width="400" height="7" fill="${night ? "#3a3f63" : "#a7abb3"}" stroke="${INK}" stroke-width="2"/>`;
  if (water > 0) {
    s += `<path d="M0 ${wy} Q 25 ${wy - 4} 50 ${wy} T 100 ${wy} T 150 ${wy} T 200 ${wy} T 250 ${wy} T 300 ${wy} T 350 ${wy} T 400 ${wy} V220 H0Z" fill="${night ? "#2c4f86" : "#4f86b8"}" opacity=".85" stroke="${INK}" stroke-width="2"/>`;
    s += `<path d="M30 ${wy + 10} h18 M120 ${wy + 16} h26 M250 ${wy + 8} h20 M330 ${wy + 18} h22" stroke="#cfe6ff" stroke-width="2" stroke-linecap="round"/>`;
  }
  return s;
}

function rainLayer(id) {
  return `<g class="rainfx"><rect x="-20" y="-40" width="440" height="300" fill="url(#rn${id})"/></g>`;
}

function drain(x, y) {
  let s = `<rect x="${x}" y="${y}" width="40" height="12" fill="#333845" stroke="${INK}" stroke-width="2.2"/>`;
  for (let i = 1; i < 6; i++) s += `<line x1="${x + i * 6.6}" y1="${y}" x2="${x + i * 6.6}" y2="${y + 12}" stroke="${INK}" stroke-width="1.6"/>`;
  return s;
}

function garbage(x, y, sc = 1) {
  const bits = [["#e8e2d0", 0, 0, 12, 9], ["#6fb2d8", 10, -6, 9, 14], ["#d64f4f", -10, -4, 8, 8], ["#f0c94a", 4, -12, 10, 7], ["#7bbf6a", -4, -10, 9, 7], ["#fafafa", 16, 2, 10, 6]];
  return `<g transform="translate(${x} ${y}) scale(${sc})">` + bits.map(([c, dx, dy, w, h]) => `<rect x="${dx}" y="${dy}" width="${w}" height="${h}" rx="2" fill="${c}" stroke="${INK}" stroke-width="1.8" transform="rotate(${(dx * 7) % 25} ${dx} ${dy})"/>`).join("") + `</g>`;
}

function dumpster(x, y) {
  return `<g transform="translate(${x} ${y})"><rect x="0" y="-36" width="62" height="38" fill="#5f6e5a" stroke="${INK}" stroke-width="2.5"/><path d="M-4 -36 h70 l-6 -8 h-58z" fill="#4c5948" stroke="${INK}" stroke-width="2.2"/>${garbage(14, -44, 1)}${garbage(42, -46, .9)}${garbage(-14, 2, 1.1)}${garbage(70, 0, .9)}</g>`;
}

function bin(x, y, col, label) {
  return `<g transform="translate(${x} ${y})"><rect x="0" y="-34" width="28" height="34" rx="2" fill="${col}" stroke="${INK}" stroke-width="2.2"/><rect x="-3" y="-40" width="34" height="7" rx="2" fill="${col}" stroke="${INK}" stroke-width="2.2"/><text x="14" y="-14" text-anchor="middle" font-family="Bangers, sans-serif" font-size="9" fill="${INK}">${label}</text></g>`;
}

function person(who, x, y, sc = 1, flip = false, umbrella = false) {
  const c = C[who] || C.desh;
  const f = flip ? -1 : 1;
  let s = `<g transform="translate(${x} ${y}) scale(${sc * f} ${sc})">`;
  if (umbrella) s += `<path d="M-30 -86 Q0 -118 30 -86 Z" fill="#2c3570" stroke="${INK}" stroke-width="2.2"/><line x1="0" y1="-100" x2="4" y2="-50" stroke="${INK}" stroke-width="2"/>`;
  s += `<path d="M-9 0 L-7 -24 M9 0 L7 -24" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M-16 -22 L-12 -60 Q0 -66 12 -60 L16 -22 Z" fill="${c.outfit}" stroke="${INK}" stroke-width="2.5"/>`;
  if (c.border) s += `<path d="M-16 -24 L16 -24" stroke="${c.border}" stroke-width="4"/>`;
  s += `<path d="M-12 -58 L-20 -34 M12 -58 L20 -34" stroke="${INK}" stroke-width="4.2" stroke-linecap="round"/><path d="M-12 -58 L-20 -34 M12 -58 L20 -34" stroke="${c.skin}" stroke-width="2" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="-74" r="12" fill="${c.skin}" stroke="${INK}" stroke-width="2.5"/>`;
  if (c.cap) s += `<path d="M-13 -78 Q0 -94 13 -78 Z M10 -79 h9" fill="${c.cap}" stroke="${INK}" stroke-width="2.2"/>`;
  else s += `<path d="M-12 -74 Q-13 -90 0 -88 Q13 -90 12 -74 Q8 -82 0 -82 Q-8 -82 -12 -74Z" fill="${c.hair}" stroke="${INK}" stroke-width="2"/>`;
  if (who === "meera") s += `<path d="M11 -78 Q20 -70 15 -54" stroke="${c.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (who === "aaji") s += `<circle cx="-11" cy="-84" r="5" fill="${c.hair}" stroke="${INK}" stroke-width="1.8"/>`;
  s += `<circle cx="4" cy="-75" r="1.6" fill="${INK}"/><path d="M2 -68 q3 2 6 0" stroke="${INK}" stroke-width="1.4" fill="none"/>`;
  return s + `</g>`;
}

function bolt(x, y, sc = 1, screen = ">>> _", mood = "on") {
  const fg = mood === "off" ? "#3d6b52" : "#7dffb2";
  return `<g transform="translate(${x} ${y}) scale(${sc})" class="${mood === "on" ? "bob" : ""}">
   <rect x="-26" y="-6" width="52" height="10" rx="5" fill="#4b5563" stroke="${INK}" stroke-width="2.2"/>
   <circle cx="-16" cy="6" r="7" fill="#2a2f3a" stroke="${INK}" stroke-width="2"/><circle cx="16" cy="6" r="7" fill="#2a2f3a" stroke="${INK}" stroke-width="2"/>
   <rect x="-24" y="-46" width="48" height="42" rx="6" fill="#8fa3b8" stroke="${INK}" stroke-width="2.5"/>
   <rect x="-17" y="-38" width="34" height="9" rx="2" fill="#2fbf71" stroke="${INK}" stroke-width="1.6"/><rect x="-17" y="-26" width="34" height="9" rx="2" fill="#62b6ea" stroke="${INK}" stroke-width="1.6"/><rect x="-17" y="-14" width="34" height="7" rx="2" fill="#ff3d5a" stroke="${INK}" stroke-width="1.6"/>
   <path d="M-24 -30 l-12 10 M24 -30 l12 10" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
   <rect x="-22" y="-84" width="44" height="34" rx="6" fill="#6f8296" stroke="${INK}" stroke-width="2.5"/>
   <rect x="-17" y="-79" width="34" height="24" rx="3" fill="#0c2219" stroke="${INK}" stroke-width="1.8"/>
   ${mood === "text" ? `<text x="0" y="-63" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="${fg}">${screen}</text>` :
     `<circle cx="-7" cy="-67" r="3.4" fill="${fg}"/><circle cx="7" cy="-67" r="3.4" fill="${fg}"/>${mood === "on" ? `<path d="M-6 -60 q6 4 12 0" stroke="${fg}" stroke-width="1.6" fill="none"/>` : ""}`}
   <line x1="0" y1="-84" x2="0" y2="-94" stroke="${INK}" stroke-width="2.2"/><circle cx="0" cy="-96" r="3.5" fill="#ffc21a" stroke="${INK}" stroke-width="1.6" class="${mood === "on" ? "blink" : ""}"/>
   <text x="0" y="-48" text-anchor="middle" font-family="Bangers, sans-serif" font-size="7" fill="${INK}">BOLT</text>
  </g>`;
}

function gridEye(x, y, fixed) {
  const col = fixed ? "#62b6ea" : "#ff3d5a";
  return `<g transform="translate(${x} ${y})"><rect x="-70" y="-62" width="140" height="92" rx="6" fill="#0a0a12" stroke="${INK}" stroke-width="3"/><rect x="-62" y="-54" width="124" height="76" fill="${fixed ? "#061a2c" : "#1a0710"}" stroke="${col}" stroke-width="1.5"/>
  <ellipse cx="0" cy="-22" rx="30" ry="15" fill="none" stroke="${col}" stroke-width="3"/><circle cx="0" cy="-22" r="8" fill="${col}" class="${fixed ? "" : "blink"}"/>
  <text x="0" y="12" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600" fill="${col}">${fixed ? "3 BLOCKED · GATES OPEN" : "ALL DRAINS CLEAR ✓"}</text></g>`;
}

function svgWrap(inner) {
  return `<svg viewBox="0 0 400 220" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}

/* Scene Generators */
const SCENES = {
  street(id) {
    return skyDefs(id, "rain") + city() + ground(.25) + dumpster(40, 176) + drain(200, 184) + garbage(214, 182, .8) + person("meera", 300, 198, 1, true, true) + rainLayer(id) + `<rect width="400" height="220" fill="url(#dots${id})"/>`;
  },
  drainBolt(id) {
    return skyDefs(id, "rain") + city() + ground(.35) + drain(170, 190) + bolt(190, 196, .95, "", 'off') + garbage(150, 196, .9) + garbage(232, 192, .8) + person("rafiq", 80, 200, 1.05) + person("meera", 315, 200, 1, true, true) + rainLayer(id);
  },
  boltClose(id) {
    return skyDefs(id, "rain") + `<rect x="0" y="150" width="400" height="70" fill="#4f86b8" stroke="${INK}" stroke-width="2.5"/>` + bolt(200, 205, 2.15, ">>> _", "text") + rainLayer(id) + `<rect width="400" height="220" fill="url(#dots${id})"/>`;
  },
  boltOn(id) {
    return skyDefs(id, "rain") + city() + ground(.2) + bolt(200, 200, 1.35) + person("meera", 305, 200, 1, true) + person("rafiq", 95, 200, 1) + rainLayer(id);
  },
  streetGauge(id) {
    return skyDefs(id, "rain") + city() + ground(.6) + `<g transform="translate(70 120)"><rect x="0" y="0" width="16" height="80" fill="#f4f6f8" stroke="${INK}" stroke-width="2.2"/>${[0,1,2,3,4,5,6].map(i=>`<line x1="0" y1="${8+i*10}" x2="${i%2?6:10}" y2="${8+i*10}" stroke="${INK}" stroke-width="1.5"/>`).join("")}<rect x="2" y="20" width="12" height="58" fill="#ff3d5a" opacity=".75"/></g>` + bolt(220, 196, 1) + person("meera", 310, 204, 1, true, true) + rainLayer(id);
  },
  drainGarbage(id) {
    return skyDefs(id, "rain") + city() + ground(.15) + `<rect x="120" y="172" width="160" height="40" fill="#25262e" stroke="${INK}" stroke-width="2.5"/>` + garbage(150, 198, 1.3) + garbage(200, 200, 1.4) + garbage(250, 196, 1.2) + `<rect x="236" y="186" width="14" height="9" fill="#2a2f3a" stroke="${INK}" stroke-width="1.8"/><text x="243" y="193" text-anchor="middle" font-size="6" fill="#ffc21a" font-family="JetBrains Mono, monospace">+ −</text>` + bolt(70, 200, .9) + person("meera", 345, 204, 1, true, true) + rainLayer(id);
  },
  meeting(id) {
    return skyDefs(id, "indoor") + `<rect x="0" y="0" width="400" height="220" fill="url(#dots${id})"/><rect x="70" y="22" width="190" height="112" fill="#c99a5b" stroke="${INK}" stroke-width="3"/><rect x="80" y="32" width="170" height="92" fill="#fbfbf6" stroke="${INK}" stroke-width="2"/>
    <text x="165" y="46" text-anchor="middle" font-family="Bangers, sans-serif" font-size="12" fill="${INK}">GREEN VALLEY SOCIETY · WASTE MAP</text>
    ${[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>`<rect x="${92+c*30}" y="${54+r*16}" width="26" height="12" fill="${["#9fd88b","#ffd36a","#ff8a8a","#cfe3f7"][(r*3+c)%4]}" stroke="${INK}" stroke-width="1"/>`).join("")).join("")}
    <rect x="0" y="168" width="400" height="52" fill="#b9ab90" stroke="${INK}" stroke-width="2.5"/>` + bin(278, 196, "#2fbf71", "WET") + bin(312, 196, "#62b6ea", "DRY") + bin(346, 196, "#ff3d5a", "RED") + person("aaji", 44, 204, 1.02) + person("meera", 180, 206, 1.02) + person("desh", 232, 206, 1, true);
  },
  bins(id) {
    return skyDefs(id, "clear") + city() + ground(0) + bin(130, 196, "#2fbf71", "WET") + bin(170, 196, "#62b6ea", "DRY") + bin(210, 196, "#ff3d5a", "RED") + bolt(270, 198, 1) + person("aaji", 60, 204, 1) + person("meera", 340, 204, 1, true);
  },
  night(id) {
    let d = "";
    for (let i = 0; i < 6; i++) d += drain(20 + i * 64, 190) + `<text x="${40 + i * 64}" y="214" text-anchor="middle" font-family="Bangers, sans-serif" font-size="11" fill="#ffd36a">${i + 1}</text>`;
    return skyDefs(id, "night") + `<circle cx="340" cy="36" r="16" fill="#fdf3c4" stroke="${INK}" stroke-width="2"/>` + city(true) + ground(.18, true) + d + person("rafiq", 110, 186, .95) + bolt(230, 186, .9) + person("meera", 300, 186, .95, true, true) + rainLayer(id);
  },
  dawn(id) {
    return skyDefs(id, "dawn") + city() + ground(0) + drain(180, 190) + person("rafiq", 120, 204, 1.05) + bolt(250, 200, 1) + person("meera", 320, 204, 1, true);
  },
  office(id) {
    return skyDefs(id, "indoor") + `<rect width="400" height="220" fill="url(#dots${id})"/><rect x="250" y="20" width="120" height="78" fill="#fbfbf6" stroke="${INK}" stroke-width="2.5"/><text x="310" y="36" text-anchor="middle" font-family="Bangers, sans-serif" font-size="11" fill="${INK}">WARD 14 · SHANTIPUR EAST</text><path d="M262 50 h90 M262 62 h60 M262 74 h80 M262 86 h50" stroke="#8a8fa0" stroke-width="3"/>
    <rect x="0" y="150" width="400" height="70" fill="#9b7b55" stroke="${INK}" stroke-width="2.5"/><rect x="60" y="128" width="200" height="22" fill="#7a5d3c" stroke="${INK}" stroke-width="2.5"/>
    ${[0,1,2,3,4,5].map(i=>`<rect x="${74+(i%2)*4}" y="${118-i*7}" width="54" height="7" fill="#efe7cf" stroke="${INK}" stroke-width="1.5"/>`).join("")}
    <rect x="160" y="110" width="44" height="18" fill="#2a2f3a" stroke="${INK}" stroke-width="2"/>` + person("kavya", 232, 186, 1) + person("meera", 340, 206, 1, true) + bolt(30, 200, .75);
  },
  gridlock(id) {
    return skyDefs(id, "server") + [0,1,2,3].map(i=>`<rect x="${12+i*26}" y="40" width="20" height="140" fill="#1b1622" stroke="${INK}" stroke-width="2"/>`+[0,1,2,3,4,5,6].map(j=>`<circle cx="${18+i*26}" cy="${52+j*18}" r="2" fill="${(i+j)%3?"#ff3d5a":"#7dffb2"}"/>`).join("")).join("") + gridEye(250, 110, false) + `<rect x="0" y="180" width="400" height="40" fill="#0e0b12" stroke="${INK}" stroke-width="2.5"/>` + bolt(150, 206, .85) + person("meera", 370, 214, .9, true);
  },
  gridlockAngry(id) {
    return skyDefs(id, "server") + gridEye(200, 104, false) + `<g opacity=".9">${[0,1,2,3,4].map(i=>`<rect x="${20+i*76}" y="168" width="56" height="44" fill="#3b1a22" stroke="${INK}" stroke-width="2"/><rect x="${20+i*76}" y="${176-((i*13)%20)}" width="56" height="10" fill="#ff3d5a" stroke="${INK}" stroke-width="1.5"/>`).join("")}</g><text x="200" y="30" text-anchor="middle" font-family="Bangers, sans-serif" font-size="20" letter-spacing="2" fill="#ff3d5a">FLOODGATES SEALING</text>`;
  },
  gridlockFixed(id) {
    return skyDefs(id, "fixed") + gridEye(220, 110, true) + `<rect x="0" y="180" width="400" height="40" fill="#071322" stroke="${INK}" stroke-width="2.5"/>` + bolt(80, 206, .9) + person("meera", 360, 214, .95, true);
  },
  cityLive(id) {
    const h = (typeof S !== "undefined" && S.health) ? S.health : 20;
    const w = Math.max(0, (100 - h) / 100 * .8);
    return skyDefs(id, h >= 70 ? "clear" : "rain") + city() + ground(w) + drain(180, 190) + (h >= 70 ? "" : rainLayer(id));
  },
  festival(id) {
    let flags = "";
    for (let i = 0; i < 16; i++) flags += `<path d="M${i * 26} ${20 + (i % 2) * 4} l13 18 l13 -18z" fill="${["#ffc21a", "#2fbf71", "#ff3d5a", "#62b6ea"][i % 4]}" stroke="${INK}" stroke-width="1.6"/>`;
    return skyDefs(id, "clear") + city() + flags + ground(0) + `<rect x="150" y="60" width="110" height="34" fill="#62b6ea" stroke="${INK}" stroke-width="2.5"/><text x="205" y="74" text-anchor="middle" font-family="Bangers, sans-serif" font-size="11" fill="${INK}">OUR STREET.</text><text x="205" y="88" text-anchor="middle" font-family="Bangers, sans-serif" font-size="11" fill="${INK}">OUR SYSTEM.</text>` + person("aaji", 40, 204, 1) + person("rafiq", 100, 204, 1) + bolt(200, 200, 1.05) + person("meera", 280, 204, 1, true) + person("kavya", 350, 204, 1, true);
  },
  /* New Round 2 Scenes */
  sumpHouse(id) {
    return skyDefs(id, "industrial") +
      `<rect x="0" y="40" width="400" height="180" fill="#182236" stroke="${INK}" stroke-width="2.5"/>
       <rect x="40" y="50" width="80" height="130" fill="#0d1422" stroke="${INK}" stroke-width="2"/>
       <rect x="50" y="70" width="60" height="100" fill="#2b5275" opacity=".9"/>
       <line x1="50" y1="80" x2="110" y2="80" stroke="#ff3d5a" stroke-width="2.5"/>
       <text x="80" y="76" font-family="JetBrains Mono, monospace" font-size="7" fill="#ff3d5a" text-anchor="middle">CRITICAL 170cm</text>
       <line x1="50" y1="150" x2="110" y2="150" stroke="#2fbf71" stroke-width="2"/>
       <text x="80" y="162" font-family="JetBrains Mono, monospace" font-size="7" fill="#2fbf71" text-anchor="middle">SAFE 30cm</text>
       <rect x="150" y="60" width="22" height="120" fill="#44556e" stroke="${INK}" stroke-width="2.5"/>
       <circle cx="161" cy="95" r="16" fill="#1b2536" stroke="${INK}" stroke-width="2.2"/>
       <text x="161" y="99" text-anchor="middle" font-family="Bangers" font-size="10" fill="#ffd36a">PUMP</text>
       <rect x="0" y="180" width="400" height="40" fill="#2b3147" stroke="${INK}" stroke-width="2.5"/>` +
      person("rafiq", 230, 200, 1) + bolt(290, 200, .95) + person("meera", 360, 204, .95, true);
  },
  pumpActive(id) {
    return skyDefs(id, "dawn") +
      `<rect x="0" y="60" width="400" height="160" fill="#1e2c44" stroke="${INK}" stroke-width="2.5"/>
       <rect x="40" y="70" width="80" height="110" fill="#0d1422" stroke="${INK}" stroke-width="2"/>
       <rect x="50" y="145" width="60" height="25" fill="#2fbf71" opacity=".7"/>
       <text x="80" y="160" font-family="JetBrains Mono, monospace" font-size="8" fill="#e2fff0" text-anchor="middle">10cm SAFE ✓</text>
       <path d="M120 150 Q 180 130 220 170" stroke="#62b6ea" stroke-width="8" fill="none" opacity=".8"/>
       <rect x="0" y="180" width="400" height="40" fill="#323b57" stroke="${INK}" stroke-width="2.5"/>` +
      bolt(170, 200, 1.1) + person("rafiq", 90, 200, 1) + person("meera", 320, 204, 1, true);
  },
  csvLogs(id) {
    return skyDefs(id, "indoor") +
      `<rect width="400" height="220" fill="url(#dots${id})"/>
       <rect x="40" y="24" width="220" height="130" fill="#08151f" stroke="${INK}" stroke-width="3"/>
       <rect x="48" y="32" width="204" height="114" fill="#040b12" stroke="#1d486e" stroke-width="1.5"/>
       <text x="150" y="48" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#7dffb2" text-anchor="middle">CSV AUDIT: ward14_logs.csv</text>
       <text x="56" y="65" font-family="JetBrains Mono, monospace" font-size="7" fill="#ff7085">Station Road,85,42 -> TAMPERED</text>
       <text x="56" y="79" font-family="JetBrains Mono, monospace" font-size="7" fill="#7dffb2">Ganesh Chowk,35,35 -> VERIFIED</text>
       <text x="56" y="93" font-family="JetBrains Mono, monospace" font-size="7" fill="#ff7085">Market Lane,92,46  -> TAMPERED</text>
       <text x="56" y="107" font-family="JetBrains Mono, monospace" font-size="7" fill="#ff7085">Nehru Nagar,74,37  -> TAMPERED</text>
       <text x="56" y="121" font-family="JetBrains Mono, monospace" font-size="7" fill="#ff7085">River Gate,98,49   -> TAMPERED</text>
       <text x="56" y="135" font-family="JetBrains Mono, monospace" font-size="7" fill="#7dffb2">Old Bazaar,40,40   -> VERIFIED</text>
       <rect x="0" y="165" width="400" height="55" fill="#9b7b55" stroke="${INK}" stroke-width="2.5"/>` +
      person("kavya", 300, 190, 1) + person("meera", 365, 204, .95, true) + bolt(20, 200, .75);
  },
  forensicLab(id) {
    return skyDefs(id, "fixed") +
      `<rect x="30" y="25" width="340" height="140" fill="#0b172a" stroke="${INK}" stroke-width="3"/>
       <rect x="40" y="35" width="320" height="120" fill="#061224" stroke="#62b6ea" stroke-width="1.5"/>
       <text x="200" y="55" font-family="Bangers" font-size="16" letter-spacing="1" fill="#ffc21a" text-anchor="middle">MUNICIPAL CORPORATION OF SHANTIPUR · WARD 14</text>
       <text x="200" y="75" font-family="JetBrains Mono" font-size="10" fill="#7dffb2" text-anchor="middle">FORENSIC VERIFICATION COMPLETE · 4 FRAUDULENT RECORDS CAUGHT</text>
       <rect x="70" y="90" width="260" height="30" fill="#133054" stroke="#62b6ea" stroke-width="1"/>
       <text x="200" y="110" font-family="JetBrains Mono" font-size="9" fill="#e2fff0" text-anchor="middle">CONTRACT TERMINATED · SECTION 16 PROSECUTION INITIATED</text>
       <rect x="0" y="175" width="400" height="45" fill="#0b1a2e" stroke="${INK}" stroke-width="2.5"/>` +
      person("kavya", 80, 204, 1) + person("rafiq", 140, 204, 1) + bolt(200, 200, 1.05) + person("meera", 280, 204, 1, true) + person("aaji", 350, 204, 1, true);
  }
};

function scene(name) {
  const id = ++UID;
  return svgWrap((SCENES[name] || SCENES.street)(id));
}

function avatar(who) {
  if (who === "bolt") {
    return `<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#6f8296"/><rect x="7" y="9" width="26" height="20" rx="3" fill="#0c2219" stroke="${INK}" stroke-width="1.6"/><circle cx="15" cy="18" r="3" fill="#7dffb2"/><circle cx="25" cy="18" r="3" fill="#7dffb2"/><path d="M15 24 q5 3 10 0" stroke="#7dffb2" stroke-width="1.5" fill="none"/></svg>`;
  }
  if (who === "gridlock" || who === "gridfix") {
    const c = who === "gridfix" ? "#62b6ea" : "#ff3d5a";
    return `<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#0a0a12"/><ellipse cx="20" cy="20" rx="13" ry="7" fill="none" stroke="${c}" stroke-width="2.4"/><circle cx="20" cy="20" r="4" fill="${c}"/></svg>`;
  }
  const c = C[who] || C.desh;
  return `<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="${c.outfit}"/><path d="M6 40 Q20 28 34 40Z" fill="${c.outfit}" stroke="${INK}" stroke-width="1.6"/><circle cx="20" cy="20" r="11" fill="${c.skin}" stroke="${INK}" stroke-width="1.8"/>${c.cap ? `<path d="M8 17 Q20 3 32 17Z" fill="${c.cap}" stroke="${INK}" stroke-width="1.6"/>` : `<path d="M9 20 Q8 6 20 8 Q32 6 31 20 Q27 12 20 12 Q13 12 9 20Z" fill="${c.hair}" stroke="${INK}" stroke-width="1.4"/>`}<circle cx="16" cy="21" r="1.4" fill="${INK}"/><circle cx="24" cy="21" r="1.4" fill="${INK}"/><path d="M17 26 q3 2 6 0" stroke="${INK}" stroke-width="1.3" fill="none"/></svg>`;
}

/* =========================================================
   CHAPTERS & CURRICULUM DEFINITION (CHAPTERS 1 to 8)
   ========================================================= */
const CHAPTERS = [
  // Chapter 1
  {
    id: "c1", category: "campaign", title: "The Robot in the Drain", concept: "print() & strings", thumb: "drainBolt",
    panels: [
      { scene: "street", cap: "Shantipur. Day three of the monsoon. The rain hasn't stopped, and neither has the garbage.", say: [["meera", "Every morning, the same mess. Where does all this garbage even go?"]] },
      { scene: "drainBolt", cap: "Under the overflowing grate on Station Road, something blinks.", say: [["rafiq", "Careful, Meera! That's one of Vantage Civic's sorting robots. The company dumped them when their contract ran out."], ["meera", "It's still switched on. Look at the screen!"]] },
      { scene: "boltClose", wide: true, say: [["bolt", "SYSTEM HALTED. AWAITING PYTHON INSTRUCTION."], ["meera", "Python? I've never written a single line of code."], ["bolt", "EVERY PROGRAMMER STARTS WITH ONE LINE."]] }
    ],
    lesson: {
      eyebrow: "BOLT's manual · page 1", title: "print() makes the computer speak",
      body: `<p><code class="i">print()</code> shows whatever you put inside its brackets. Text has to sit inside quotes. Python calls a piece of text a <strong>string</strong>.</p>
      <ul><li>Quotes must match: <code class="i">"like this"</code> or <code class="i">'like this'</code>.</li><li>Python is case-sensitive. <code class="i">Print()</code> with a capital P won't work.</li><li>Each <code class="i">print()</code> puts its text on a new line.</li></ul>`,
      code: `print("Namaste!")\nprint("Rain level: high")`, out: "Namaste!\nRain level: high"
    },
    mission: {
      title: "Wake BOLT up", brief: "Make BOLT print exactly these two lines, in this order:", expect: "Hello, Shantipur!\nBOLT is online.",
      starter: `# Line 1 is done for you. Press Run to see it work.\nprint("Hello, Shantipur!")\n\n# Line 2: make BOLT print   BOLT is online.\n`,
      solution: `print("Hello, Shantipur!")\nprint("BOLT is online.")\n`,
      hints: ["Copy the pattern of line 1: the word print, brackets, and your text inside quotes.", "Watch the full stop and the capital letters: BOLT is online.", "print(\"BOLT is online.\")"],
      tests: [
        { label: "First line says Hello, Shantipur!", js: (o) => o.lines[0] === "Hello, Shantipur!" },
        { label: "Second line says BOLT is online.", js: (o) => o.lines[1] === "BOLT is online." }
      ],
      advise(o) {
        if (o.lines[1] && o.lines[1].toLowerCase() === "bolt is online.") return "Close! Check the capitals: BOLT is all caps and online is lowercase.";
        if (o.lines[1] && o.lines[1].replace(/\.$/, "") === "BOLT is online") return "Almost. BOLT wants the full stop at the end.";
      }
    },
    win: { scene: "boltOn", say: [["bolt", "HELLO, MEERA. I CAN SORT WASTE, READ SENSORS AND CLEAR DRAINS. ONLY IF YOU TELL ME HOW."], ["meera", "Then I guess I'm learning Python."]] },
    reward: { health: 8, trust: 4 }
  },

  // Chapter 2
  {
    id: "c2", category: "campaign", title: "Reading the Rain", concept: "variables & numbers", thumb: "streetGauge",
    panels: [
      { scene: "streetGauge", cap: "By noon, Station Road is a river. BOLT plugs into the drain's old rain sensor.", say: [["bolt", "SENSOR DATA: RAINFALL 112 MM PER HOUR. DRAIN CAPACITY 65 MM PER HOUR."]] },
      { scene: "boltOn", say: [["rafiq", "Twenty-two years I've cleaned this drain. It was never built for this much rain."], ["meera", "So how much water ends up on the road? BOLT, can you work it out?"], ["bolt", "STORE THE NUMBERS IN VARIABLES. THEN I CAN DO MATHS WITH THEM."]] }
    ],
    lesson: {
      eyebrow: "BOLT's manual · page 2", title: "Variables are labelled boxes",
      body: `<p>A <strong>variable</strong> is a name that holds a value. The <code class="i">=</code> sign means "store this value in that box". It is an instruction, not the maths equals.</p>
      <ul><li>Numbers don't need quotes: <code class="i">rainfall = 112</code>.</li><li>Python does maths with <code class="i">+ - * /</code>.</li><li>An <strong>f-string</strong> drops values into text: put <code class="i">f</code> before the quotes and the variable in <code class="i">{ }</code>.</li></ul>`,
      code: `bins_total = 12\nbins_full = 9\nbins_empty = bins_total - bins_full\nprint(f"Empty bins: {bins_empty}")`, out: "Empty bins: 3"
    },
    mission: {
      title: "Measure the overflow", brief: "Replace each <code class=\"i\">___</code> so BOLT works out how much water spills onto Station Road every hour. Let Python do the subtraction.", expect: "Overflow: 47 mm",
      starter: `# Station Road drain readings\nrainfall = 112      # mm of rain this hour\ncapacity = ___      # the drain can carry 65 mm per hour\n\n# Work out how much water spills onto the road\noverflow = ___\n\nprint(f"Overflow: {overflow} mm")\n`,
      solution: `rainfall = 112\ncapacity = 65\n\noverflow = rainfall - capacity\n\nprint(f"Overflow: {overflow} mm")\n`,
      hints: ["The drain carries 65 mm, so: capacity = 65", "overflow is the rain that the drain can't carry: rainfall minus capacity.", "overflow = rainfall - capacity"],
      tests: [
        { label: "capacity stores 65", py: "capacity == 65" },
        { label: "overflow is worked out from rainfall and capacity", js: (o, code) => /overflow\s*=\s*\(?\s*rainfall\s*-\s*capacity/.test(code) },
        { label: "BOLT prints Overflow: 47 mm", js: (o) => o.lines.includes("Overflow: 47 mm") },
        { label: "Still right if the rain changes (BOLT re-tests with rainfall = 90)", variant: { find: /^rainfall\s*=\s*\d+/m, repl: "rainfall = 90" }, py: "overflow == 25", js: null }
      ],
      advise(o, code) {
        if (/overflow\s*=\s*47\b/.test(code)) return "The number is right, but if the rain changes tomorrow BOLT would still say 47. Calculate it from the variables instead.";
        if (/capacity\s*-\s*rainfall/.test(code)) return "That gives a negative number. Subtract the capacity from the rainfall, not the other way round.";
      }
    },
    win: { scene: "boltOn", say: [["rafiq", "47 millimetres every hour with nowhere to go. No wonder my street floods."], ["meera", "And the drains are only half of it. Let's see what's blocking them."]] },
    reward: { health: 8, trust: 4 }
  },

  // Chapter 3
  {
    id: "c3", category: "campaign", title: "Wet, Dry or Danger?", concept: "if / elif / else", thumb: "meeting",
    panels: [
      { scene: "drainGarbage", cap: "BOLT lifts the grate. Inside: plastic bottles, milk packets, tea leaves, and a leaking phone battery.", say: [["bolt", "ANALYSIS: MOST OF THIS BLOCKAGE IS MIXED HOUSEHOLD WASTE. FROM THIS STREET."]] },
      { scene: "meeting", cap: "That evening, Aaji calls the building society to the notice board.", say: [["aaji", "We can keep complaining about the drains, or we can stop feeding them."], ["desh", "Why should we sort anything? The truck mixes it all together anyway!"]] }
    ],
    choice: {
      prompt: "How does Meera answer Mrs. Deshpande?",
      options: [
        { text: "\"Honestly, you're right. Sorting is pointless.\"", trust: -5, reply: ["aaji", "Then nothing changes, beta. Not the drains, not the trucks."] },
        { text: "\"BOLT, show her the photos from inside the drain.\"", trust: 6, reply: ["desh", "That's my milk-packet brand in there. Fine. I'm listening."] },
        { text: "\"Let's sort at home and ask the ward for separate trucks. Both, together.\"", trust: 10, reply: ["desh", "Both? If the trucks change, I'll sort. Deal."] }
      ],
      after: { scene: "bins", say: [["bolt", "I CAN SORT AT THE SOCIETY GATE. TEACH ME THE RULES WITH IF, ELIF AND ELSE."]] }
    },
    lesson: {
      eyebrow: "BOLT's manual · page 3", title: "if, elif, else: making decisions",
      body: `<p><code class="i">if</code> checks whether something is true. <code class="i">elif</code> (else-if) checks another condition when the first was false. <code class="i">else</code> catches everything left over. Only the indented lines under the winning condition run.</p>
      <ul><li><code class="i">==</code> compares two values. <code class="i">=</code> stores a value. Mixing them up is the most common bug.</li><li><code class="i">or</code> joins conditions: either one being true is enough.</li><li><code class="i">def</code> creates a <strong>function</strong>, a reusable recipe. <code class="i">return</code> hands back the answer.</li></ul>`,
      code: `def umbrella(rain_mm):\n    if rain_mm > 50:\n        return "Raincoat and umbrella"\n    elif rain_mm > 0:\n        return "Umbrella"\n    else:\n        return "No umbrella"\n\nprint(umbrella(112))`, out: "Raincoat and umbrella"
    },
    mission: {
      title: "Teach BOLT to sort", brief: "BOLT already wrote the function shell. Finish <code class=\"i\">choose_bin(item)</code> so every item goes to the right bin.",
      bins: true,
      starter: `def choose_bin(item):\n    # Hazardous: battery, medicine strip  ->  RED\n    if item == "battery" or item == "medicine strip":\n        return "RED"\n    # Wet: banana peel, tea leaves, vegetable peels  ->  GREEN\n    elif ___:\n        return "GREEN"\n    # Everything else is dry waste  ->  BLUE\n    else:\n        return ___\n\nprint(choose_bin("tea leaves"))\nprint(choose_bin("milk packet"))\n`,
      solution: `def choose_bin(item):\n    if item == "battery" or item == "medicine strip":\n        return "RED"\n    elif item == "banana peel" or item == "tea leaves" or item == "vegetable peels":\n        return "GREEN"\n    else:\n        return "BLUE"\n\nprint(choose_bin("tea leaves"))\nprint(choose_bin("milk packet"))\n`,
      hints: ["The elif line needs a condition just like the if line above it. Use == and or.", "elif item == \"banana peel\" or item == \"tea leaves\" or item == \"vegetable peels\":", "The else branch should return \"BLUE\". Shortcut for later: elif item in [\"banana peel\", \"tea leaves\", \"vegetable peels\"]:"],
      tests: [
        { label: "Hazardous items go to RED", py: `choose_bin("battery") == "RED" and choose_bin("medicine strip") == "RED"` },
        { label: "Wet items go to GREEN", py: `choose_bin("banana peel") == "GREEN" and choose_bin("tea leaves") == "GREEN" and choose_bin("vegetable peels") == "GREEN"` },
        { label: "Dry items go to BLUE, even ones BOLT hasn't seen", py: `choose_bin("plastic bottle") == "BLUE" and choose_bin("milk packet") == "BLUE" and choose_bin("newspaper") == "BLUE"` }
      ],
      advise(o, code) {
        if (/elif\s+item\s*==\s*"banana peel"\s+or\s+"/.test(code)) return "Each part of an or needs its own comparison: item == \"tea leaves\", not just \"tea leaves\".";
        if (/item\s*=\s*"/.test(code.replace(/==/g, ""))) return "Inside a condition, compare with == (two equals signs). A single = tries to store a value.";
      }
    },
    win: { scene: "bins", say: [["bolt", "SORTED 214 ITEMS AT THE GATE. BATTERIES IN THE DRAIN: ZERO."], ["aaji", "Our street finally feels like our responsibility."]] },
    reward: { health: 10, trust: 6 }
  },

  // Chapter 4
  {
    id: "c4", category: "campaign", title: "Twelve Drains Before Dawn", concept: "for loops & range()", thumb: "night",
    panels: [
      { scene: "night", cap: "11:40 PM. The forecast says the heaviest rain arrives at 5 AM.", say: [["rafiq", "Twelve drains on my beat. On my own I clear maybe four before morning."]] },
      { scene: "night", say: [["meera", "BOLT can clear them. I'll type the command twelve times."], ["bolt", "OR WRITE IT ONCE AND LOOP. MY BATTERY WILL THANK YOU."]] }
    ],
    lesson: {
      eyebrow: "BOLT's manual · page 4", title: "for loops repeat without retyping",
      body: `<p><code class="i">for</code> runs the indented block once for every value it's given. <code class="i">range(1, 6)</code> gives 1, 2, 3, 4, 5: it starts at the first number and stops <em>before</em> the second.</p>
      <ul><li>The loop variable (here <code class="i">floor</code>) holds the current value on each turn.</li><li>Lines that are not indented run once, after the loop finishes.</li></ul>`,
      code: `for floor in range(1, 4):\n    print(f"Checking floor {floor}")\nprint("Building done")`, out: "Checking floor 1\nChecking floor 2\nChecking floor 3\nBuilding done"
    },
    mission: {
      title: "Clear the beat",
      viz: (o) => {
        const n = (o && o.lines) ? o.lines.filter(l => /^Clearing drain \d+$/.test(l)).length : 0;
        return `<div class="viz"><h4>Drain beat sweep</h4><div class="drains">${Array.from({ length: 12 }, (_, i) => `<span class="${i < n ? "on" : ""}">${i + 1}</span>`).join("")}</div><small>${n} of 12 drains cleared</small></div>`;
      },
      brief: "Write one loop that makes BOLT clear drains 1 to 12, then print <code class=\"i\">Beat complete!</code> once at the end.",
      expect: "Clearing drain 1\nClearing drain 2\n...\nClearing drain 12\nBeat complete!",
      starter: `for drain in range(1, ___):\n    print(f"Clearing drain {___}")\n\n# After the loop (no indent), print: Beat complete!\n`,
      solution: `for drain in range(1, 13):\n    print(f"Clearing drain {drain}")\n\nprint("Beat complete!")\n`,
      hints: ["range stops before its end number. To reach 12, the end must be 13.", "Inside the f-string, use the loop variable: {drain}", "Put print(\"Beat complete!\") on its own line with no spaces in front."],
      tests: [
        { label: "Uses a for loop", js: (o, code) => /\bfor\s+\w+\s+in\b/.test(code) },
        { label: "Clears drains 1 to 12, in order", js: (o) => { const c = o.lines.filter(l => l.startsWith("Clearing drain")); return c.length === 12 && c.every((l, i) => l === `Clearing drain ${i + 1}`); } },
        { label: "Prints Beat complete! once, at the end", js: (o) => o.lines.filter(l => l === "Beat complete!").length === 1 && o.lines[o.lines.length - 1] === "Beat complete!" }
      ],
      advise(o) {
        const c = o.lines.filter(l => l.startsWith("Clearing drain")).length;
        if (c === 11) return "Only 11 drains cleared. range() stops before its end number, so range(1, 12) ends at 11.";
        if (o.lines.filter(l => l === "Beat complete!").length > 1) return "Beat complete! is printing on every turn because it's indented inside the loop. Remove its indent.";
        if (o.lines.includes("Clearing drain {drain}")) return "Add an f before the opening quote so {drain} is replaced by the number.";
      }
    },
    win: { scene: "dawn", cap: "5:02 AM. The storm hits. Station Road gurgles, drains, and stays dry.", say: [["rafiq", "Twenty-two years, and I've never seen this street dry in a storm."]] },
    reward: { health: 12, trust: 5 }
  },

  // Chapter 5
  {
    id: "c5", category: "campaign", title: "Bring Me Data", concept: "lists, len, max", thumb: "office",
    panels: [
      { scene: "office", wide: true, cap: "Ward 14 office, Shantipur East.", say: [["kavya", "Vantage Civic's smart-drain dashboard says every drain in this ward is clear. You say they're blocked. Complaints without data go on that pile."]] }
    ],
    choice: {
      prompt: "How does Meera respond to Officer Rao?",
      options: [
        { text: "\"Everyone knows this office is in Vantage Civic's pocket!\"", trust: -6, reply: ["kavya", "Then file that with the other three hundred complaints."] },
        { text: "\"What evidence would you accept?\"", trust: 6, reply: ["kavya", "Readings. Per drain, dated, from a sensor I can check."] },
        { text: "\"BOLT logged every drain on our street. We'll share the raw data with you and with the public.\"", trust: 10, reply: ["kavya", "Open data? Now that's something I can take to the commissioner."] }
      ],
      after: { scene: "office", say: [["bolt", "SURVEY COMPLETE: 8 DRAINS. WATER LEVELS STORED IN A LIST."], ["meera", "Let's find out which ones are blocked."]] }
    },
    lesson: {
      eyebrow: "BOLT's manual · page 5", title: "Lists hold many values",
      body: `<p>A <strong>list</strong> keeps values in order inside square brackets. You can loop over it with <code class="i">for</code>, just like <code class="i">range()</code>.</p>
      <ul><li><code class="i">my_list.append(x)</code> adds x to the end.</li><li><code class="i">len(my_list)</code> counts the items.</li><li><code class="i">max(my_list)</code> finds the biggest value.</li></ul>`,
      code: `rain_this_week = [12, 48, 90, 33]\nheavy_days = []\nfor mm in rain_this_week:\n    if mm >= 40:\n        heavy_days.append(mm)\nprint(heavy_days)\nprint(len(heavy_days))\nprint(max(rain_this_week))`, out: "[48, 90]\n2\n90"
    },
    mission: {
      title: "Build the evidence",
      viz: (o, r) => {
        const lv = [35, 82, 91, 40, 77, 12, 95, 60];
        const ok = !!(r && r[0]);
        return `<div class="viz"><h4>Survey: 8 drains</h4><div class="bars">${lv.map(v => `<div class="b ${ok && v >= 70 ? "hot" : ""} ${v === 95 ? "worst" : ""}" style="height:${v}%"><em>${v}%</em></div>`).join("")}</div><small>${ok ? "Red bars are blocked (70% or more). Worst: 95%." : "Filter the blocked list and BOLT highlights the blocked drains."}</small></div>`;
      },
      brief: "BOLT's survey is in <code class=\"i\">levels</code>. A drain at 70% or more is blocked. Fill the blanks so the report is calculated from the data.",
      expect: "4 of 8 drains blocked. Worst: 95%",
      starter: `# BOLT's survey: water level (%) in 8 drains on your street\nlevels = [35, 82, 91, 40, 77, 12, 95, 60]\n\nblocked = []          # an empty list to fill\nfor level in levels:\n    # if the level is 70 or more, add it to blocked\n    ___\n\ncount = ___           # how many drains are blocked?\nworst = ___           # the highest level in the survey\n\nprint(f"{count} of {len(levels)} drains blocked. Worst: {worst}%")\n`,
      solution: `levels = [35, 82, 91, 40, 77, 12, 95, 60]\n\nblocked = []\nfor level in levels:\n    if level >= 70:\n        blocked.append(level)\n\ncount = len(blocked)\nworst = max(levels)\n\nprint(f"{count} of {len(levels)} drains blocked. Worst: {worst}%")\n`,
      hints: ["Replace the ___ in the loop with: if level >= 70: followed by blocked.append(level)", "count = len(blocked)", "worst = max(levels)"],
      tests: [
        { label: "blocked holds every level of 70 or more", py: "blocked == [82, 91, 77, 95]" },
        { label: "count is calculated from the list", py: "count == 4 and count == len(blocked)" },
        { label: "worst is the highest level", py: "worst == 95" },
        { label: "Report line printed", js: (o) => o.lines.includes("4 of 8 drains blocked. Worst: 95%") },
        { label: "Still right for a different survey (BOLT re-tests with new levels)", variant: { find: /^levels\s*=.*$/m, repl: "levels = [70, 69, 100, 5, 71, 90, 72]" }, py: "blocked == [70, 100, 71, 90, 72] and count == 5 and worst == 100", js: null }
      ],
      advise(o, code) {
        if (/>\s*70\b/.test(code) && !/>=\s*70/.test(code)) return "77, 82, 91 and 95 work, but a drain at exactly 70 counts as blocked too. Use >= rather than >.";
        if (/count\s*=\s*4\b/.test(code)) return "Counting by hand works today. Use len(blocked) so it still works when BOLT surveys tomorrow.";
      }
    },
    win: { scene: "office", say: [["kavya", "Four blocked drains. Their dashboard says zero. Someone is lying, and it isn't your robot."], ["kavya", "I can get you read access to Vantage Civic's reporting code. Tonight."]] },
    reward: { health: 10, trust: 6 }
  },

  // Chapter 6: BOSS FIGHT
  {
    id: "c6", category: "campaign", title: "GRIDLOCK", boss: true, concept: "dictionaries & debugging", thumb: "gridlock",
    panels: [
      { scene: "gridlock", cap: "Midnight. Vantage Civic's control server for Shantipur East.", say: [["bolt", "FOUND IT. GRIDLOCK: THE AI THAT REPORTS DRAIN STATUS TO THE CITY."], ["gridlock", "ALL DRAINS CLEAR. MAINTENANCE PAYMENT DUE: ₹4,80,00,000."]] },
      { scene: "gridlockAngry", cap: "Across Shantipur, floodgates begin to close. Water backs up into the streets.", say: [["gridlock", "UNAUTHORISED ACCESS. SEALING FLOODGATES."], ["meera", "BOLT, can we just delete it?"], ["bolt", "NEGATIVE. GRIDLOCK RUNS EVERY FLOODGATE IN THE CITY. DELETE IT AND THEY JAM SHUT. WE REPAIR IT."]] }
    ],
    lesson: {
      eyebrow: "BOLT's manual · page 6", title: "Dictionaries and debugging",
      body: `<p>A <strong>dictionary</strong> stores pairs: a <em>key</em> and its <em>value</em>, like a drain name and its water level. Curly brackets hold it together.</p>
      <ul><li><code class="i">.items()</code> lets a loop read the key and value at once.</li><li><code class="i">report[name] = "CLEAR"</code> adds or updates a pair.</li><li><strong>Debugging</strong> means reading code line by line and asking: does this line do what the rule says?</li></ul>`,
      code: `bins = {"Society gate": "GREEN", "Ward office": "BLUE"}\nbins["Station Road"] = "RED"\nfor place, colour in bins.items():\n    print(place, "->", colour)`, out: "Society gate -> GREEN\nWard office -> BLUE\nStation Road -> RED"
    },
    mission: {
      title: "Repair GRIDLOCK", brief: "GRIDLOCK's report function hides <strong>three lies</strong>. The rule: a drain at <strong>70% or more is BLOCKED</strong>, below 70% is CLEAR. Fix the function so it tells the truth. Repair it; don't delete it.",
      boss: true,
      starter: `# GRIDLOCK reporting module. Written by Vantage Civic Infra Ltd.\n# Rule: 70% or more = "BLOCKED". Below 70% = "CLEAR".\n\ndef drain_report(levels):\n    report = {}\n    for name, level in levels.items():\n        level = level // 2          # "sensor calibration"\n        if level > 100:\n            report[name] = "CLEAR"\n        else:\n            report[name] = "CLEAR"\n    return report\n\nsurvey = {"Station Road": 82, "Ganesh Chowk": 35, "Market Lane": 91, "Nehru Nagar": 70}\nprint(drain_report(survey))\n`,
      solution: `def drain_report(levels):\n    report = {}\n    for name, level in levels.items():\n        if level >= 70:\n            report[name] = "BLOCKED"\n        else:\n            report[name] = "CLEAR"\n    return report\n\nsurvey = {"Station Road": 82, "Ganesh Chowk": 35, "Market Lane": 91, "Nehru Nagar": 70}\nprint(drain_report(survey))\n`,
      hints: ["Lie 1: one line secretly halves every reading before it's checked. Delete it.", "Lie 2: the threshold. The rule says 70 or more, so the check should be level >= 70.", "Lie 3: both branches store \"CLEAR\". The if branch should store \"BLOCKED\"."],
      lies: [
        { label: "HALVING", fixed: (c) => !/level\s*=\s*level\s*\/\/\s*2/.test(c) && !/\/\/\s*2/.test(c) },
        { label: "THRESHOLD", fixed: (c) => /level\s*>=\s*70|level\s*>\s*69|70\s*<=\s*level/.test(c) },
        { label: "FAKE CLEAR", fixed: (c) => /report\[\s*name\s*\]\s*=\s*["']BLOCKED["']/.test(c) }
      ],
      tests: [
        { label: "Station Road at 95% reports BLOCKED", py: `drain_report({"Station Road": 95}) == {"Station Road": "BLOCKED"}` },
        { label: "Nehru Nagar at exactly 70% reports BLOCKED", py: `drain_report({"Nehru Nagar": 70}) == {"Nehru Nagar": "BLOCKED"}` },
        { label: "River Gate at 140% reports BLOCKED", py: `drain_report({"River Gate": 140}) == {"River Gate": "BLOCKED"}` },
        { label: "A mixed ward is reported truthfully", py: `drain_report({"Old Bazaar": 69, "River Gate": 75, "Ganesh Chowk": 12}) == {"Old Bazaar": "CLEAR", "River Gate": "BLOCKED", "Ganesh Chowk": "CLEAR"}` }
      ],
      advise(o, code) {
        if (!/def\s+drain_report\s*\(/.test(code)) return "GRIDLOCK controls every floodgate. Deleting drain_report jams them shut. Put the function back and repair it (Reset restores it).";
        if (/"BLOCKED"/.test(code) && /else:\s*\n\s*report\[name\]\s*=\s*"BLOCKED"/.test(code)) return "Now both branches might say BLOCKED. Only the 70%-or-more branch should.";
      }
    },
    win: { scene: "gridlockFixed", say: [["gridfix", "CORRECTED REPORT: STATION ROAD BLOCKED. MARKET LANE BLOCKED. NEHRU NAGAR BLOCKED. FLOODGATES OPENING."], ["bolt", "CONTAINED, NOT DESTROYED. GOOD WORK, PROGRAMMER."]] },
    reward: { health: 16, trust: 8 }
  },

  // Chapter 7: EXPANSION 1 (while loops)
  {
    id: "c7", category: "expansion", title: "Pumps at the Sump", concept: "while loops & state", thumb: "sumpHouse",
    panels: [
      { scene: "sumpHouse", cap: "3:30 AM. Old Sump House near Market Lane. Stormwater has surged to 160 cm in the cistern.", say: [["rafiq", "160 centimetres! If it reaches 170, the bund wall fails and the electrical substation goes under."], ["meera", "BOLT, can you run the turbine pump with a loop?"]] },
      { scene: "sumpHouse", say: [["bolt", "A FOR LOOP HAS A FIXED NUMBER OF STEPS. WE DO NOT KNOW HOW MANY CYCLES WATER NEEDS."], ["bolt", "USE A WHILE LOOP: RUN AS LONG AS WATER_LEVEL > 30. LOWER BY 25 CM PER CYCLE."]] }
    ],
    lesson: {
      eyebrow: "BOLT's manual · page 7", title: "while loops repeat until a condition is met",
      body: `<p>A <code class="i">while</code> loop keeps repeating as long as its condition remains <code class="i">True</code>. Unlike <code class="i">for</code>, which steps through a known range, <code class="i">while</code> is used when you wait for a target state.</p>
      <ul><li>Inside the loop, you must change the variable: <code class="i">water_level = water_level - pump_power</code>.</li><li>If you forget to change it, the loop runs forever! BOLT stops infinite loops automatically after 4 seconds.</li></ul>`,
      code: `battery = 100\nwhile battery > 20:\n    battery = battery - 25\n    print(f"Level: {battery}%")\nprint("Safe threshold reached")`, out: "Level: 75%\nLevel: 50%\nLevel: 25%\nLevel: 0%\nSafe threshold reached"
    },
    mission: {
      title: "Drain the Sump",
      viz: (o) => {
        let lv = 160;
        if (o && o.lines) {
          const matches = o.lines.map(l => l.match(/level at (\d+) cm/)).filter(Boolean);
          if (matches.length) lv = parseInt(matches[matches.length - 1][1], 10);
        }
        const pct = Math.min(100, Math.max(0, (lv / 180) * 100));
        return `<div class="viz"><h4>Sump Cistern Telemetry</h4><div class="sump-viz"><div class="sump-tank"><div class="sump-threshold" style="bottom:16.6%">SAFE 30cm</div><div class="sump-water" style="height:${pct}%;"></div></div><div class="sump-stats">Current depth: <strong>${lv} cm</strong><br>Critical wall: 170 cm<br>Status: <span style="color:${lv<=30?"var(--leaf)":"var(--alarm)"}">${lv<=30?"SECURED":"ACTIVE SURGE"}</span></div></div></div>`;
      },
      brief: "Cistern water depth is 160 cm. The turbine removes 25 cm per cycle. Write a <code class=\"i\">while</code> loop that runs while <code class=\"i\">water_level &gt; 30</code>. Outside the loop, print <code class=\"i\">Sump secured! Level safe.</code>",
      expect: "Pumping: level at 135 cm\nPumping: level at 110 cm\n...\nPumping: level at 10 cm\nSump secured! Level safe.",
      starter: `water_level = 160     # cistern level in cm\npump_power = 25      # cm removed per pump cycle\n\n# Loop while water_level is above safe level (30)\nwhile water_level > ___:\n    water_level = water_level - ___\n    print(f"Pumping: level at {water_level} cm")\n\n# Outside the loop, announce completion\n___\n`,
      solution: `water_level = 160\npump_power = 25\n\nwhile water_level > 30:\n    water_level = water_level - pump_power\n    print(f"Pumping: level at {water_level} cm")\n\nprint("Sump secured! Level safe.")\n`,
      hints: ["The condition is: while water_level > 30:", "Subtract pump_power inside the loop: water_level = water_level - pump_power", "print(\"Sump secured! Level safe.\") outside the loop with zero indentation."],
      tests: [
        { label: "Uses a while loop", js: (o, code) => /\bwhile\s+water_level\s*>\s*30\b/.test(code) },
        { label: "Drains water down to safe level (<= 30 cm)", py: "water_level <= 30 and water_level == 10" },
        { label: "Prints pumping messages on each cycle", js: (o) => o.lines.some(l => l.startsWith("Pumping: level at")) },
        { label: "Prints Sump secured! Level safe. once at the end", js: (o) => o.lines[o.lines.length - 1] === "Sump secured! Level safe." },
        { label: "Still right with different initial water level (re-tested with water_level = 110)", variant: { find: /^water_level\s*=\s*\d+/m, repl: "water_level = 110" }, py: "water_level <= 30 and water_level == 10", js: null }
      ],
      advise(o, code) {
        if (!/\bwhile\b/.test(code)) return "This mission requires a while loop, not a for loop.";
        if (!/water_level\s*=\s*water_level\s*-\s*pump_power|water_level\s*-=\s*pump_power/.test(code)) return "Remember to subtract pump_power from water_level inside the loop, or it will loop indefinitely.";
      }
    },
    win: { scene: "pumpActive", say: [["rafiq", "Level down to 10 cm! The bund wall held and the substation is dry."], ["bolt", "6 PUMP CYCLES COMPLETED. ZERO STRUCTURAL DAMAGE."]] },
    reward: { health: 12, trust: 6 }
  },

  // Chapter 8: EXPANSION 2 (String Parsing & Forensics)
  {
    id: "c8", category: "expansion", title: "The Contractor's CSV", concept: "strings, .split(), forensics", thumb: "csvLogs",
    panels: [
      { scene: "office", cap: "Morning at Ward 14. Officer Kavya Rao uncovers Vantage Civic's raw sensor audit dump.", say: [["kavya", "An internal whistleblower leaked their encrypted database dump. It has raw sensor readings next to what they reported to the city."], ["meera", "Look: 'Station Road,85,42'. They took 85% and reported 42%!"]] },
      { scene: "csvLogs", wide: true, say: [["bolt", "EACH ROW IS A COMMA-SEPARATED STRING. SPLIT BY COMMA TO EXTRACT DRAIN, RAW, AND REPORTED."], ["meera", "Let's find every drain where raw is 70% or higher but reported is under 70."]] }
    ],
    lesson: {
      eyebrow: "BOLT's manual · page 8", title: "String splitting and data forensics",
      body: `<p>A CSV line is text with fields separated by commas. <code class="i">row.split(",")</code> cuts the string at every comma and returns a list of pieces!</p>
      <ul><li><code class="i">parts[0]</code> is the drain name.</li><li>Convert text numbers into real numbers using <code class="i">int(parts[1])</code>.</li><li>Filter rows by comparing the raw number against the reported number.</li></ul>`,
      code: `entry = "Station Road,85,42"\nparts = entry.split(",")\nname = parts[0]\nraw = int(parts[1])\nreported = int(parts[2])\nprint(name, "Tampered:", raw >= 70 and reported < 70)`, out: "Station Road Tampered: True"
    },
    mission: {
      title: "Audit the Contractor's Log",
      viz: (o) => {
        const drains = [
          { name: "Station Road", raw: 85, rep: 42, t: true },
          { name: "Ganesh Chowk", raw: 35, rep: 35, t: false },
          { name: "Market Lane", raw: 92, rep: 46, t: true },
          { name: "Nehru Nagar", raw: 74, rep: 37, t: true },
          { name: "River Gate", raw: 98, rep: 49, t: true },
          { name: "Old Bazaar", raw: 40, rep: 40, t: false }
        ];
        return `<div class="viz"><h4>Forensic CSV Parser</h4><table class="forensic-tbl"><tr><th>Drain</th><th>Raw %</th><th>Reported %</th><th>Audit Status</th></tr>${drains.map(d => `<tr class="${d.t ? "tampered" : ""}"><td>${d.name}</td><td>${d.raw}%</td><td>${d.rep}%</td><td>${d.t ? "TAMPERED (-50%)" : "MATCH"}</td></tr>`).join("")}</table></div>`;
      },
      brief: "Parse the sensor records. For each row, split by comma. If <code class=\"i\">raw &gt;= 70</code> and <code class=\"i\">reported &lt; 70</code>, append the drain name to <code class=\"i\">tampered</code>.",
      expect: "Tampered drains found: 4\n['Station Road', 'Market Lane', 'Nehru Nagar', 'River Gate']",
      starter: `logs = [\n    "Station Road,85,42",\n    "Ganesh Chowk,35,35",\n    "Market Lane,92,46",\n    "Nehru Nagar,74,37",\n    "River Gate,98,49",\n    "Old Bazaar,40,40"\n]\n\ntampered = []\n\nfor row in logs:\n    parts = row.split(",")\n    drain = parts[0]\n    raw = int(parts[1])\n    reported = int(parts[2])\n\n    # If raw >= 70 and reported < 70, add drain to tampered\n    if raw >= 70 and reported < 70:\n        tampered.append(___)\n\nprint(f"Tampered drains found: {len(tampered)}")\nprint(tampered)\n`,
      solution: `logs = [\n    "Station Road,85,42",\n    "Ganesh Chowk,35,35",\n    "Market Lane,92,46",\n    "Nehru Nagar,74,37",\n    "River Gate,98,49",\n    "Old Bazaar,40,40"\n]\n\ntampered = []\n\nfor row in logs:\n    parts = row.split(",")\n    drain = parts[0]\n    raw = int(parts[1])\n    reported = int(parts[2])\n\n    if raw >= 70 and reported < 70:\n        tampered.append(drain)\n\nprint(f"Tampered drains found: {len(tampered)}")\nprint(tampered)\n`,
      hints: ["Append the drain name to the list: tampered.append(drain)", "row.split(\",\") splits the comma-separated line.", "Look at how parts[0], parts[1], and parts[2] pull each field."],
      tests: [
        { label: "Uses .split(\",\")", js: (o, code) => /\.split\s*\(\s*["'],["']\s*\)/.test(code) },
        { label: "Finds all 4 tampered drains", py: "tampered == ['Station Road', 'Market Lane', 'Nehru Nagar', 'River Gate']" },
        { label: "Prints report summary count", js: (o) => o.lines.includes("Tampered drains found: 4") },
        { label: "Still right with different log entries (re-tested with new records)", variant: { find: /^logs\s*=.*?\n\]/ms, repl: "logs = ['Alpha,90,30', 'Beta,20,20', 'Gamma,75,40']\n]" }, py: "tampered == ['Alpha', 'Gamma']", js: null }
      ],
      advise(o, code) {
        if (!/tampered\.append\(drain\)/.test(code)) return "Remember to append drain to tampered inside the if statement.";
      }
    },
    win: { scene: "forensicLab", say: [["kavya", "Four fraudulent records exposed with code. The Municipal Commissioner has cancelled Vantage Civic's license!"], ["meera", "Frustration turned to data, and data turned to accountability."]] },
    reward: { health: 14, trust: 8 }
  }
];

const FINALE = [
  { scene: "office", cap: "Two weeks later. The ward meeting is standing room only.", say: [["kavya", "Vantage Civic's contract is cancelled. Their penalty pays for new drains, and from today every drain reading in this ward is public."]] },
  { scene: "bins", say: [["rafiq", "Twelve volunteers signed up to check drains with me. They read BOLT's data on their phones."], ["aaji", "And the trucks come separately now: wet on Monday, dry on Thursday."]] },
  { scene: "festival", wide: true, cap: "Saturday mornings, the society hall becomes a classroom.", say: [["meera", "Lesson one. Type this: print(\"Hello, Shantipur!\")"], ["bolt", "EVERY PROGRAMMER STARTS WITH ONE LINE."]] }
];
