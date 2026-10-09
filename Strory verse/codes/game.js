/* =========================================================
   CODE MONSOON - GAME LOGIC & RUNTIME ENGINE
   Skulpt Python Runtime, Evaluation Engine, UI Controller
   ========================================================= */

/* State & Storage */
const KEY = "codeMonsoon.v2";
const fresh = () => ({
  done: [],
  health: 20,
  trust: 20,
  xp: 0,
  code: {},
  choices: {},
  studentName: "Ajinkya Kalyankar"
});

let S = fresh();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) S = Object.assign(fresh(), JSON.parse(raw));
} catch (e) {}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
}

const clamp = (v) => Math.max(0, Math.min(100, v));

function hud() {
  const hv = document.getElementById("hv");
  const tv = document.getElementById("tv");
  const hb = document.getElementById("hb");
  const tb = document.getElementById("tb");
  const xp = document.getElementById("xp");
  if (hv) hv.textContent = S.health;
  if (tv) tv.textContent = S.trust;
  if (hb) hb.style.width = S.health + "%";
  if (tb) tb.style.width = S.trust + "%";
  if (xp) xp.innerHTML = S.xp + "<small>XP</small>";
}

let view = { screen: "title" };
let DEMO = false;   // Judge demo mode (unlocks all chapters, free solution reveal)
let SND = false;    // Web Audio Sound FX toggle
let activeFilter = "all";

/* =========================================================
   SYNTHESIZED WEB AUDIO (Pure Web Audio API - Zero MP3s needed)
   ========================================================= */
let AC = null;
let rainNode = null;

function initAudio() {
  if (!AC) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) AC = new AudioContextClass();
  }
  if (AC && AC.state === "suspended") {
    AC.resume();
  }
}

function beep(freqs) {
  if (!SND) return;
  try {
    initAudio();
    if (!AC) return;
    const d = 0.12;
    let t = AC.currentTime;
    freqs.forEach((f, i) => {
      const o = AC.createOscillator();
      const g = AC.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.04, t + i * d);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * d + d);
      o.connect(g);
      g.connect(AC.destination);
      o.start(t + i * d);
      o.stop(t + i * d + d);
    });
  } catch (e) {}
}

function playKeyClick() {
  if (!SND) return;
  try {
    initAudio();
    if (!AC) return;
    const osc = AC.createOscillator();
    const gain = AC.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(450 + Math.random() * 150, AC.currentTime);
    gain.gain.setValueAtTime(0.005, AC.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(AC.destination);
    osc.start();
    osc.stop(AC.currentTime + 0.04);
  } catch (e) {}
}

function playThunder() {
  if (!SND) return;
  try {
    initAudio();
    if (!AC) return;
    const bufferSize = AC.sampleRate * 1.5;
    const buffer = AC.createBuffer(1, bufferSize, AC.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (AC.sampleRate * 0.4));
    }
    const noise = AC.createBufferSource();
    noise.buffer = buffer;
    const filter = AC.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, AC.currentTime);
    const gain = AC.createGain();
    gain.gain.setValueAtTime(0.12, AC.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 1.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(AC.destination);
    noise.start();
  } catch (e) {}
}

/* =========================================================
   PYTHON RUNTIME (Skulpt + Dynamic Grading)
   ========================================================= */
const engineOK = () => typeof window.Sk !== "undefined" && window.Sk.misceval;

function setEngine() {
  const el = document.getElementById("engine");
  if (!el) return;
  if (engineOK()) {
    el.className = "engine ok";
    el.lastElementChild.textContent = "Python ready";
  } else {
    el.className = "engine bad";
    el.lastElementChild.textContent = "Python offline";
  }
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) {
    throw "File not found: '" + x + "'";
  }
  return Sk.builtinFiles.files[x];
}

async function runPython(code, harness) {
  if (!engineOK()) {
    return {
      ok: false,
      out: "",
      err: "The Python engine is not loaded. Please ensure skulpt.min.js and skulpt-stdlib.js are accessible."
    };
  }

  let out = "";
  Sk.configure({
    output: (t) => { out += t; },
    read: builtinRead,
    __future__: Sk.python3,
    execLimit: 4000,
    inputfun: () => ""
  });

  const full = code + (harness ? "\n\nprint('@@TESTS@@')\n" + harness : "");
  const userLines = code.split("\n").length;

  try {
    await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, full, true));
    return { ok: true, out };
  } catch (e) {
    let msg = e && e.toString ? e.toString() : String(e);
    const m = msg.match(/on line (\d+)/);
    if (m && +m[1] > userLines) msg = msg.replace(/ on line \d+/, "");
    return { ok: false, out, err: friendly(msg) };
  }
}

function friendly(msg) {
  if (/TimeLimitError|time limit/i.test(msg)) {
    return "BOLT stopped your program after 4 seconds. Is there a loop that never ends? Ensure loop variables change on each cycle.";
  }
  if (/name '___' is not defined/.test(msg)) {
    return "There's still a ___ blank in your code. Replace every ___ with your answer.\n(" + msg + ")";
  }
  if (/NameError: name '(\w+)' is not defined/.test(msg)) {
    const n = msg.match(/name '(\w+)'/)[1];
    return msg + `\nTip: Python doesn't know "${n}". Check spelling, or put quotes around it if it's meant to be text.`;
  }
  if (/IndentationError|expected an indented block/i.test(msg)) {
    return msg + "\nTip: lines inside an if, for, while or def block must be indented by 4 spaces.";
  }
  if (/SyntaxError/.test(msg)) {
    return msg + "\nTip: check for a missing colon (:), matching brackets or quotation marks on that line.";
  }
  return msg;
}

function harnessFor(items) {
  const lines = [
    "def __t(i, fn):",
    "    try:",
    "        ok = bool(fn())",
    "    except Exception as e:",
    "        ok = False",
    "    print('@@T|' + str(i) + '|' + ('PASS' if ok else 'FAIL'))"
  ];
  items.forEach(([t, i]) => {
    if (t.py) lines.push(`__t(${i}, lambda: (${t.py}))`);
  });
  return lines.join("\n");
}

async function execGroup(code, items) {
  const withPy = items.filter(([t]) => t.py);
  const r = await runPython(code, withPy.length ? harnessFor(withPy) : "");
  const [userOut, testOut = ""] = r.out.split("@@TESTS@@\n");
  const pyRes = {};
  testOut.split("\n").forEach(l => {
    const m = l.match(/^@@T\|(\d+)\|(PASS|FAIL)/);
    if (m) pyRes[m[1]] = (m[2] === "PASS");
  });
  const o = {
    text: userOut,
    lines: userOut.replace(/\n$/, "").split("\n").map(s => s.replace(/\s+$/, "")).filter((l, i, a) => !(l === "" && i === a.length - 1))
  };
  const results = items.map(([t, i]) => {
    if (!r.ok) return false;
    if (t.py) return !!pyRes[i];
    if (typeof t.js === "function") {
      try { return !!t.js(o, code); } catch (e) { return false; }
    }
    return false;
  });
  return { r, o, results };
}

async function evaluate(ch, code) {
  const tests = ch.mission.tests;
  const out = new Array(tests.length).fill(false);
  const groups = new Map();
  tests.forEach((t, i) => {
    const k = t.variant || null;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push([t, i]);
  });
  const baseItems = groups.get(null) || [];
  const base = await execGroup(code, baseItems);
  baseItems.forEach(([t, i], k) => { out[i] = base.results[k]; });

  let variantMissing = false;
  if (base.r.ok) {
    for (const [k, items] of groups) {
      if (k === null) continue;
      const vcode = code.replace(k.find, k.repl);
      if (vcode === code) { variantMissing = true; continue; }
      const vr = await execGroup(vcode, items);
      items.forEach(([t, i], j) => { out[i] = vr.results[j]; });
    }
  }
  return { ok: base.r.ok, err: base.r.err, out: base.o.text, results: out, o: base.o, variantMissing };
}

/* =========================================================
   SYNTAX HIGHLIGHTING & HELPERS
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function hl(code) {
  return code.split("\n").map(line => {
    let out = "";
    const re = /(#.*$)|(f?"[^"]*"|f?'[^']*')|(\b\d+\b)|(\b(?:def|return|if|elif|else|for|in|while|and|or|not|True|False|None)\b)|(\b(?:print|range|len|max|min|sum|int|str)\b)/g;
    let last = 0, m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "n" : m[4] ? "k" : "f";
      out += `<span class="tk-${cls}">${esc(m[0])}</span>`;
      last = re.lastIndex;
    }
    return out + esc(line.slice(last));
  }).join("\n");
}

function sayHTML(who, text, right) {
  const cls = who === "bolt" ? "bolt" : (who === "gridlock" ? "grid" : (who === "gridfix" ? "grid fixed" : ""));
  return `<div class="say${right ? " right" : ""}"><div class="ava">${avatar(who)}</div><div class="bubble ${cls}"><b>${esc(NAMES[who] || who)}</b>${esc(text)}</div></div>`;
}

function panelHTML(p, n) {
  return `<article class="panel${p.wide ? " wide" : ""}"><span class="pn">${n}</span><div class="art">${scene(p.scene)}</div><div class="words">${p.cap ? `<div class="caption">${esc(p.cap)}</div>` : ""}${(p.say || []).map(([w, t], i) => sayHTML(w, t, i % 2 === 1)).join("")}</div></article>`;
}

function stepsHTML(ch, phase) {
  const list = ["Story"].concat(ch.choice ? ["Choice"] : []).concat(["Manual", "Mission", "Debrief"]);
  const map = { story: "Story", choice: "Choice", lesson: "Manual", mission: "Mission", win: "Debrief" };
  const cur = list.indexOf(map[phase]);
  return `<div class="steps" aria-label="Chapter steps">${list.map((s, i) => `<span class="${i === cur ? "on" : (i < cur ? "past" : "")}">${s}</span>`).join("")}</div>`;
}

function chHead(ch, idx, phase) {
  const label = ch.boss ? "Boss chapter" : (ch.category === "expansion" ? `Expansion ${idx - 5}` : `Chapter ${idx + 1}`);
  return `<div class="ch-head"><div><div class="eyebrow">${label} · ${esc(ch.concept)}</div><h2>${esc(ch.title)}</h2></div>${stepsHTML(ch, phase)}</div>`;
}

function downloadCode(filename, content) {
  const blob = new Blob([content], { type: "text/x-python;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function go(v) {
  view = v;
  render();
  window.scrollTo(0, 0);
}

/* =========================================================
   SCREENS
   ========================================================= */
function render() {
  hud();
  const app = $("#app");
  if (view.screen === "title") return renderTitle(app);
  if (view.screen === "map") return renderMap(app);
  if (view.screen === "finale") return renderFinale(app);

  const idx = CHAPTERS.findIndex(c => c.id === view.id);
  const ch = CHAPTERS[idx];
  if (!ch) return go({ screen: "map" });

  if (view.phase === "story") return renderStory(app, ch, idx);
  if (view.phase === "choice") return renderChoice(app, ch, idx);
  if (view.phase === "lesson") return renderLesson(app, ch, idx);
  if (view.phase === "mission") return renderMission(app, ch, idx);
  if (view.phase === "win") return renderWin(app, ch, idx);
}

function renderTitle(app) {
  const started = S.done.length > 0;
  app.innerHTML = `<section class="hero">
    <div>
      <h1>Code<span>Monsoon</span></h1>
      <p class="dek">Shantipur is flooding, and the robot that could save it only understands Python. Learn the language one chapter at a time, and fix the system that let the drains fail.</p>
      <div class="meta">
        <span class="chip">Learn Python · Beginner</span>
        <span class="chip">8 Chapters + Boss</span>
        <span class="chip">~45 minutes</span>
        <span class="chip sdg">SDG 4 · 6 · 11 · 12 · 13 · 16</span>
      </div>
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
        <button class="btn" id="start">${started ? "Continue story" : "Start the story"} ▸</button>
        ${started ? `<button class="linkbtn" id="reset">Start over</button>` : ""}
      </div>
      <div class="hero-quicklinks">
        <button class="iconbtn" id="btn-pitch">Pitch &amp; SDG</button>
        <button class="iconbtn" id="btn-telem">Ward Telemetry</button>
        <button class="iconbtn" id="btn-browse-codes">Source Codes</button>
      </div>
    </div>
    <div class="hero-art">${scene("boltOn")}</div>
  </section>
  <div id="confirm"></div>`;

  $("#start").onclick = () => go(started ? { screen: "map" } : { screen: "chapter", id: "c1", phase: "story", n: 1 });
  $("#btn-pitch").onclick = openPitchModal;
  $("#btn-telem").onclick = openTelemetryModal;
  $("#btn-browse-codes").onclick = openAbout;

  const r = $("#reset");
  if (r) r.onclick = () => {
    $("#confirm").innerHTML = `<div class="choice"><h3>Start over?</h3><p>This clears your chapters, XP and saved code on this device.</p><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn small" id="yes">Clear progress</button><button class="btn small ghost" id="no">Keep playing</button></div></div>`;
    $("#yes").onclick = () => { S = fresh(); save(); go({ screen: "title" }); };
    $("#no").onclick = () => { $("#confirm").innerHTML = ""; };
  };
}

function unlocked(i) {
  if (DEMO || i === 0) return true;
  return S.done.includes(CHAPTERS[i - 1].id);
}

function floodLabel() {
  const h = S.health;
  return h < 35 ? "FLOODED" : (h < 60 ? "WATER RECEDING" : (h < 80 ? "MOSTLY DRY" : "DRY STREETS"));
}

function renderMap(app) {
  const allCampaignDone = DEMO || CHAPTERS.filter(c => c.category === "campaign").every(c => S.done.includes(c.id));
  const filteredChapters = CHAPTERS.filter(c => {
    if (activeFilter === "campaign") return c.category === "campaign";
    if (activeFilter === "expansion") return c.category === "expansion";
    return true;
  });

  app.innerHTML = `<div class="maphead">
    <div class="mh-art">
      <div class="citywrap" role="img" aria-label="Shantipur skyline: ${floodLabel()}">${scene("cityLive")}</div>
      <div class="floodtag">${floodLabel()}</div>
    </div>
  </div>
  <h2 class="sect-h">Shantipur East · Ward 14</h2>
  <p class="sect-sub">Each chapter teaches one Python idea and fixes one part of the city. Complete a chapter to unlock the next.</p>
  
  <div class="map-filters">
    <button class="filter-btn ${activeFilter === "all" ? "active" : ""}" data-f="all">All Drains (${CHAPTERS.length})</button>
    <button class="filter-btn ${activeFilter === "campaign" ? "active" : ""}" data-f="campaign">Story Campaign (1-6)</button>
    <button class="filter-btn ${activeFilter === "expansion" ? "active" : ""}" data-f="expansion">Ward 14 Expansions (7-8)</button>
  </div>

  <div class="ward">${filteredChapters.map((c) => {
    const origIdx = CHAPTERS.findIndex(item => item.id === c.id);
    const done = S.done.includes(c.id);
    const open = unlocked(origIdx);
    const st = done ? "Fixed" : (!open ? "Locked" : (c.boss ? "Boss" : (c.category === "expansion" ? "Bonus" : "Open")));
    return `<button class="node ${done ? "done" : (open ? (c.boss ? "boss" : (c.category === "expansion" ? "expansion" : "open")) : "")}" data-id="${c.id}" ${open ? "" : "disabled"} aria-label="${esc(c.title)}, ${st}">
      <span class="state">${st}</span>
      <div class="thumb">${scene(c.thumb)}</div>
      <div class="nb">
        <span class="num">${c.boss ? "BOSS" : (c.category === "expansion" ? "EXPANSION" : "CHAPTER " + (origIdx + 1))}</span>
        <h3>${esc(c.title)}</h3>
        <span class="concept">${esc(c.concept)}</span>
      </div>
    </button>`;
  }).join("")}</div>

  <div class="map-foot">
    ${allCampaignDone ? `<button class="btn" id="fin">Epilogue: Fix the System ▸</button>` : `<span class="sect-sub" style="margin:0">Epilogue unlocks after defeating Boss GRIDLOCK.</span>`}
    <button class="btn small ghost" id="map-telem">Live Telemetry</button>
  </div>`;

  app.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => { activeFilter = btn.dataset.f; renderMap(app); };
  });

  app.querySelectorAll(".node:not([disabled])").forEach(b => {
    b.onclick = () => go({ screen: "chapter", id: b.dataset.id, phase: "story", n: 1 });
  });

  const f = $("#fin");
  if (f) f.onclick = () => go({ screen: "finale", n: 1 });
  const mt = $("#map-telem");
  if (mt) mt.onclick = openTelemetryModal;
}

function renderStory(app, ch, idx) {
  const n = view.n, total = ch.panels.length;
  app.innerHTML = chHead(ch, idx, "story") + `<div class="comic">${ch.panels.slice(0, n).map((p, i) => panelHTML(p, i + 1)).join("")}</div>
    <div class="ctrl">
      <span class="count">Panel ${n} of ${total}</span>
      <button class="btn small ghost" id="map">Ward map</button>
      <button class="btn" id="next">${n < total ? "Next panel ▸" : (ch.choice ? "Your move ▸" : "Open BOLT's manual ▸")}</button>
    </div>`;

  $("#map").onclick = () => go({ screen: "map" });
  $("#next").onclick = () => {
    if (n < total) {
      view.n++;
      render();
      const ps = app.querySelectorAll(".panel");
      if (ps.length) ps[ps.length - 1].scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      go({ screen: "chapter", id: ch.id, phase: ch.choice ? "choice" : "lesson" });
    }
  };
}

function renderChoice(app, ch, idx) {
  const picked = S.choices[ch.id];
  const c = ch.choice;
  let html = chHead(ch, idx, "choice") + `<div class="comic">${panelHTML(ch.panels[ch.panels.length - 1], ch.panels.length)}</div>`;
  html += `<section class="choice"><h3>${esc(c.prompt)}</h3><p>What Meera says changes how much the community trusts her.</p>`;
  if (picked === undefined) {
    html += `<div class="opts">${c.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o.text)}</button>`).join("")}</div>`;
  } else {
    const o = c.options[picked];
    html += `<div class="result"><span class="delta ${o.trust >= 0 ? "up" : "down"}">Trust ${o.trust >= 0 ? "+" : ""}${o.trust}</span>${sayHTML("meera", o.text.replace(/^"|"$/g, ""))}${sayHTML(o.reply[0], o.reply[1], true)}</div>`;
  }
  html += `</section>`;
  if (picked !== undefined) {
    html += `<div class="comic" style="margin-top:22px">${panelHTML(c.after, ch.panels.length + 1)}</div><div class="ctrl"><button class="btn" id="next">Open BOLT's manual ▸</button></div>`;
  }
  app.innerHTML = html;

  app.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    S.choices[ch.id] = i;
    S.trust = clamp(S.trust + c.options[i].trust);
    save();
    render();
  });
  const nx = $("#next");
  if (nx) nx.onclick = () => go({ screen: "chapter", id: ch.id, phase: "lesson" });
}

function renderLesson(app, ch, idx) {
  const L = ch.lesson;
  app.innerHTML = chHead(ch, idx, "lesson") + `<div class="manual">
    <div class="manual-card"><div class="eyebrow">${esc(L.eyebrow)}</div><h3>${esc(L.title)}</h3>${L.body}</div>
    <div class="term"><div class="term-h"><i></i><i></i><i></i>&nbsp;example.py</div><pre class="code">${hl(L.code)}</pre><div class="out-lbl">Output</div><pre class="out">${esc(L.out)}</pre></div>
  </div><div class="ctrl"><button class="btn small ghost" id="back">Back to story</button><button class="btn" id="next">Start the mission ▸</button></div>`;

  $("#back").onclick = () => go({ screen: "chapter", id: ch.id, phase: "story", n: ch.panels.length });
  $("#next").onclick = () => go({ screen: "chapter", id: ch.id, phase: "mission" });
}

function wireEditor(ta, gutter, onRun, onChange) {
  const sync = () => {
    const n = ta.value.split("\n").length;
    gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n");
    gutter.scrollTop = ta.scrollTop;
  };
  ta.addEventListener("input", () => {
    sync();
    playKeyClick();
    onChange && onChange(ta.value);
  });
  ta.addEventListener("scroll", () => { gutter.scrollTop = ta.scrollTop; });
  ta.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
      return;
    }
    const s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
    if (e.key === "Tab") {
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      if (e.shiftKey) {
        const lead = v.slice(ls).match(/^ {1,4}/);
        if (lead) {
          ta.value = v.slice(0, ls) + v.slice(ls + lead[0].length);
          ta.selectionStart = ta.selectionEnd = Math.max(ls, s - lead[0].length);
        }
      } else {
        ta.value = v.slice(0, s) + "    " + v.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
      ta.dispatchEvent(new Event("input"));
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1, line = v.slice(ls, s);
      let ind = line.match(/^ */)[0];
      if (/:\s*(#.*)?$/.test(line)) ind += "    ";
      ta.value = v.slice(0, s) + "\n" + ind + v.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 1 + ind.length;
      ta.dispatchEvent(new Event("input"));
    }
  });
  sync();
}

function renderMission(app, ch, idx) {
  const M = ch.mission;
  const st = view.ms || (view.ms = { runs: 0, hints: 0, fails: 0, results: null, solved: S.done.includes(ch.id) });
  const code = S.code[ch.id] ?? M.starter;
  const bossHTML = M.boss ? `<div class="boss" id="boss"><span class="bn">GRIDLOCK</span><div class="hp" id="hp">${M.tests.map(() => `<span></span>`).join("")}</div><div class="lies" id="lies">${M.lies.map(l => `<span>${l.label}</span>`).join("")}</div></div>` : "";
  const binsHTML = M.bins ? `<div class="bins"><div style="background:#ffd0d6"><strong>RED</strong>battery, medicine strip</div><div style="background:#cdf3dc"><strong>GREEN</strong>banana peel, tea leaves, vegetable peels</div><div style="background:#d4ebfb"><strong>BLUE</strong>everything else</div></div>` : "";

  app.innerHTML = chHead(ch, idx, "mission") + bossHTML + `<div class="mission">
    <div style="min-width:0">
      <div class="brief">
        <div class="eyebrow">Mission</div>
        <h3>${esc(M.title)}</h3>
        <p>${M.brief}</p>
        ${binsHTML}
        ${M.expect ? `<pre>${esc(M.expect)}</pre>` : ""}
      </div>
      <div class="term">
        <div class="term-h"><i></i><i></i><i></i>&nbsp;bolt_${ch.id}.py</div>
        <div class="editor">
          <div class="gutter" id="gut" aria-hidden="true"></div>
          <textarea class="ed" id="ed" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Python code editor">${esc(code)}</textarea>
        </div>
        <div class="ed-bar">
          <button class="btn small run" id="run">Run ▸</button>
          <button class="btn small ghost" id="reset">Reset</button>
          <button class="btn small ghost" id="dl-py">Download .py</button>
          <span class="kbd">Ctrl/⌘ + Enter runs · Tab indents</span>
        </div>
      </div>
    </div>
    <div class="side">
      <div class="term console">
        <div class="term-h"><i></i><i></i><i></i>&nbsp;BOLT Output</div>
        <pre class="out" id="out" aria-live="polite">Press Run to execute your code.</pre>
      </div>
      <div id="viz"></div>
      <div class="checks">
        <h4>BOLT's checks</h4>
        <ul id="checks">${M.tests.map(t => `<li><i>·</i><span>${esc(t.label)}</span></li>`).join("")}</ul>
        <div class="feedback" id="fb"></div>
      </div>
      <div class="hints">
        <h4>Hints</h4>
        <ol id="hl"></ol>
        <div class="row">
          <button class="btn small ghost" id="hint">Show a hint</button>
          <span class="cost">Each hint costs 15 XP</span>
          <button class="linkbtn" id="sol" hidden>Show the solution</button>
        </div>
      </div>
      <div id="next"></div>
    </div>
  </div>`;

  const ta = $("#ed");
  wireEditor(ta, $("#gut"), () => run(), (v) => {
    S.code[ch.id] = v;
    save();
    if (M.boss) {
      const gone = !/def\s+drain_report\s*\(/.test(v);
      const fb = $("#fb");
      if (gone) {
        fb.textContent = "WARNING: GRIDLOCK controls all municipal floodgates. Deleting drain_report jams them shut. Repair the function; do not delete it.";
        st.warned = true;
      } else if (st.warned) {
        fb.textContent = "";
        st.warned = false;
      }
    }
  });

  $("#dl-py").onclick = () => downloadCode(`bolt_${ch.id}.py`, ta.value);

  const drawHints = () => {
    $("#hl").innerHTML = M.hints.slice(0, st.hints).map(h => `<li>${esc(h)}</li>`).join("");
    $("#hint").disabled = st.hints >= M.hints.length;
    $("#sol").hidden = !(st.fails >= 2 || st.hints >= M.hints.length || DEMO) || st.solved;
  };
  drawHints();

  $("#hint").onclick = () => {
    if (st.hints < M.hints.length) {
      st.hints++;
      drawHints();
    }
  };

  $("#sol").onclick = () => {
    ta.value = M.solution;
    ta.dispatchEvent(new Event("input"));
    st.usedSolution = true;
    $("#fb").textContent = "Solution loaded. Inspect line by line, then press Run.";
  };

  $("#reset").onclick = () => {
    ta.value = M.starter;
    ta.dispatchEvent(new Event("input"));
  };

  $("#run").onclick = () => run();

  const updateBoss = (results) => {
    if (!M.boss) return;
    const hp = $("#hp").children;
    results.forEach((ok, i) => hp[i].classList.toggle("down", !!ok));
    const lies = $("#lies").children;
    M.lies.forEach((l, i) => {
      const f = l.fixed(ta.value);
      lies[i].classList.toggle("fixed", f);
      lies[i].textContent = f ? l.label + " ✓" : l.label;
    });
    $("#boss").classList.toggle("beaten", results.every(Boolean));
  };

  const showResults = (res) => {
    const lis = $("#checks").children;
    if (M.viz) $("#viz").innerHTML = M.viz(res.o, res.results);
    res.results.forEach((ok, i) => {
      lis[i].className = ok ? "pass" : "fail";
      lis[i].firstElementChild.textContent = ok ? "✓" : "✗";
    });
    updateBoss(res.results);
  };

  if (st.last) {
    $("#out").innerHTML = st.last.html;
    showResults(st.last.res);
  } else if (M.viz) {
    $("#viz").innerHTML = M.viz({ lines: [] }, null);
  }

  if (st.solved) showNext();

  async function run() {
    const btn = $("#run");
    btn.disabled = true;
    btn.textContent = "Running…";
    const res = await evaluate(ch, ta.value);
    btn.disabled = false;
    btn.textContent = "Run ▸";
    st.runs++;

    let html = esc(res.out || "");
    if (!res.ok) html += `<span class="err">${esc(res.err)}</span>`;
    if (!html) html = "(BOLT ran your code. Nothing was printed.)";
    $("#out").innerHTML = html;
    showResults(res);
    st.last = { html, res };

    const all = res.results.every(Boolean);
    const fb = $("#fb");
    if (all) {
      fb.textContent = "All checks passed!";
      beep([523, 659, 784, 1046]);
      if (!st.solved) {
        st.solved = true;
        if (!S.done.includes(ch.id)) {
          const xp = st.usedSolution ? 40 : Math.max(50, 100 - st.hints * 15);
          S.done.push(ch.id);
          S.xp += xp;
          S.health = clamp(S.health + ch.reward.health);
          S.trust = clamp(S.trust + ch.reward.trust);
          st.earned = xp;
          save();
          hud();
        }
        showNext();
      }
    } else {
      st.fails++;
      beep([196, 156]);
      const tip = (res.variantMissing && "Keep BOLT's data lines intact: BOLT re-tests your code with dynamic numbers.") ||
        (M.advise && M.advise(res.o, ta.value)) ||
        (!res.ok ? "Read the red error message: it indicates the exact line where execution stopped." : "Not quite. Compare output with the expected format, then try again.");
      fb.textContent = tip;
      if (M.boss) {
        $("#boss").classList.remove("shake");
        void $("#boss").offsetWidth;
        $("#boss").classList.add("shake");
      }
      drawHints();
    }
  }

  function showNext() {
    $("#next").innerHTML = `<button class="btn" id="go">${ch.boss ? "Finish the fight ▸" : "See what happens ▸"}</button>`;
    $("#go").onclick = () => go({ screen: "chapter", id: ch.id, phase: "win", earned: st.earned });
    $("#sol").hidden = true;
  }
}

function renderWin(app, ch, idx) {
  const nextCh = CHAPTERS[idx + 1];
  const w = ch.win;
  app.innerHTML = chHead(ch, idx, "win") + `<div class="stamp">${ch.boss ? "System Repaired" : "Mission Complete"}</div>
    <div class="comic">${panelHTML(Object.assign({ wide: true }, w), ch.panels.length + (ch.choice ? 2 : 1))}</div>
    <div class="rewards">
      <span>City health +${ch.reward.health}</span>
      <span>Trust +${ch.reward.trust}</span>
      ${view.earned ? `<span>+${view.earned} XP</span>` : ""}
      <span>Learned: ${esc(ch.concept)}</span>
    </div>
    <div class="ctrl">
      <button class="btn small ghost" id="map">Ward map</button>
      ${nextCh ? `<button class="btn" id="next">Next: ${esc(nextCh.title)} ▸</button>` : `<button class="btn" id="next">Epilogue: Fix the System ▸</button>`}
    </div>`;

  $("#map").onclick = () => go({ screen: "map" });
  $("#next").onclick = () => nextCh ? go({ screen: "chapter", id: nextCh.id, phase: "story", n: 1 }) : go({ screen: "finale", n: 1 });
}

function renderFinale(app) {
  const n = view.n, total = FINALE.length;
  let html = `<div class="ch-head"><div><div class="eyebrow">Epilogue</div><h2>Fix the System</h2></div></div>
    <div class="comic">${finalePanels().slice(0, n).map((p, i) => panelHTML(p, i + 1)).join("")}</div>`;

  if (n < total) {
    html += `<div class="ctrl"><span class="count">Panel ${n} of ${total}</span><button class="btn" id="next">Next panel ▸</button></div>`;
  } else {
    html += `<div class="tagline">Don't just clean up the problem. Fix the system.</div>
    <section class="cert" id="printable-cert">
      <div>
        <div class="eyebrow" style="font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#3c6f96;font-weight:700">Shantipur East · Ward 14 Transit Board</div>
        <h3>Python Apprentice</h3>
        <p style="margin:4px 0 8px;max-width:54ch">This certifies that the candidate has mastered core Python fundamentals to hold municipal systems accountable.</p>
        <label style="font-size:12px;text-transform:uppercase;font-weight:700;color:#555;">Candidate Name:</label>
        <input type="text" id="cert-name" class="cert-name-input" value="${esc(S.studentName || "Ajinkya Kalyankar")}" aria-label="Candidate Name"/>
        <div class="skills">${CHAPTERS.map(c => `<span>${esc(c.concept)}</span>`).join("")}</div>
        <div class="cert-seal">
          <span>Official Verification: WARD14-SDG-2026</span>
          <button class="btn small ghost" id="btn-print-cert">Print / Save Certificate</button>
        </div>
      </div>
      <div class="stats">
        <div><b>${S.health}</b><small>City Health</small></div>
        <div><b>${S.trust}</b><small>Trust</small></div>
        <div><b>${S.xp}</b><small>Total XP</small></div>
      </div>
    </section>
    
    <section class="sandbox">
      <h2 class="sect-h">BOLT's Sandbox</h2>
      <p class="sect-sub">Free play terminal. Write any Python you like and run it. Try modeling a municipal floodgate sensor function!</p>
      <div class="manual">
        <div class="term">
          <div class="term-h"><i></i><i></i><i></i>&nbsp;sandbox.py</div>
          <div class="editor">
            <div class="gutter" id="gut" aria-hidden="true"></div>
            <textarea class="ed" id="ed" spellcheck="false" autocapitalize="off" aria-label="Sandbox code editor">${esc(S.code.sandbox ?? 'def rate(level):\n    if level >= 70:\n        return "HIGH"\n    elif level >= 40:\n        return "MEDIUM"\n    else:\n        return "LOW"\n\nfor level in [12, 45, 88]:\n    print(f"Drain at {level}%: {rate(level)}")\n')}</textarea>
          </div>
          <div class="ed-bar">
            <button class="btn small run" id="run">Run ▸</button>
            <button class="btn small ghost" id="dl-sandbox">Download .py</button>
            <span class="kbd">Ctrl/⌘ + Enter runs</span>
          </div>
        </div>
        <div class="term console">
          <div class="term-h"><i></i><i></i><i></i>&nbsp;Output</div>
          <pre class="out" id="out">Press Run to execute your sandbox code.</pre>
        </div>
      </div>
    </section>
    <div class="ctrl" style="margin-top:24px"><button class="btn small ghost" id="map">Ward map</button></div>`;
  }

  app.innerHTML = html;

  const nx = $("#next");
  if (nx) nx.onclick = () => {
    view.n++;
    render();
    const ps = app.querySelectorAll(".panel");
    if (ps.length) ps[ps.length - 1].scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  const mp = $("#map");
  if (mp) mp.onclick = () => go({ screen: "map" });

  if (n >= total) {
    const nameInput = $("#cert-name");
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        S.studentName = e.target.value;
        save();
      });
    }
    const printBtn = $("#btn-print-cert");
    if (printBtn) printBtn.onclick = () => window.print();

    const ta = $("#ed");
    const run = async () => {
      const r = await runPython(ta.value);
      $("#out").innerHTML = esc(r.out || "") + (r.ok ? "" : `<span class="err">${esc(r.err)}</span>`) || "(Nothing printed.)";
    };
    wireEditor(ta, $("#gut"), run, (v) => { S.code.sandbox = v; save(); });
    $("#run").onclick = run;
    $("#dl-sandbox").onclick = () => downloadCode("bolt_sandbox.py", ta.value);
  }
}

function finalePanels() {
  const t = S.trust;
  const line = t >= 65 ? FINALE[0].say[0][1] :
    (t >= 52 ? "Vantage Civic's contract is suspended pending an audit. Their penalty will pay for new drains, and from today every drain reading in this ward is public." :
      "The audit will be slow and Vantage Civic is fighting it. But from today every drain reading in this ward is public, and nobody can say a drain is clear when it isn't.");
  return FINALE.map((p, i) => i === 0 ? Object.assign({}, p, { say: [["kavya", line]] }) : p);
}

/* =========================================================
   MODALS: TELEMETRY, PITCH & SDG, ABOUT & TOOLS
   ========================================================= */
function openTelemetryModal() {
  let d = document.getElementById("telem-dlg");
  if (d) d.remove();
  d = document.createElement("dialog");
  d.id = "telem-dlg";
  d.className = "custom-dlg";

  const h = S.health;
  const drains = [
    { name: "Station Road", lvl: Math.max(15, 82 - Math.round(h * 0.6)), cap: "65 mm/hr", status: h >= 50 ? "FLOWING" : "CHOKED" },
    { name: "Ganesh Chowk", lvl: Math.max(10, 35 - Math.round(h * 0.2)), cap: "80 mm/hr", status: "CLEAR" },
    { name: "Market Lane", lvl: Math.max(20, 91 - Math.round(h * 0.7)), cap: "50 mm/hr", status: h >= 70 ? "FLOWING" : "SURGING" },
    { name: "Nehru Nagar", lvl: Math.max(18, 70 - Math.round(h * 0.5)), cap: "70 mm/hr", status: h >= 60 ? "CLEAR" : "BLOCKED" },
    { name: "River Gate", lvl: Math.max(25, 95 - Math.round(h * 0.75)), cap: "120 mm/hr", status: h >= 75 ? "FLOWING" : "OVERFLOW" },
    { name: "Old Bazaar", lvl: Math.max(12, 40 - Math.round(h * 0.3)), cap: "60 mm/hr", status: "CLEAR" }
  ];

  d.innerHTML = `<h3>Ward 14 Telemetry Control</h3>
    <p style="margin:0 0 12px">Live sensor network readings monitored by BOLT across Shantipur East.</p>
    <table>
      <thead>
        <tr><th>Location</th><th>Water Level</th><th>Capacity</th><th>Sensor Status</th></tr>
      </thead>
      <tbody>
        ${drains.map(dr => `<tr>
          <td><strong>${dr.name}</strong></td>
          <td>${dr.lvl}%</td>
          <td>${dr.cap}</td>
          <td><span style="color:${dr.status === "CLEAR" || dr.status === "FLOWING" ? "var(--leaf)" : "var(--alarm)"};font-weight:700">${dr.status}</span></td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div style="margin-top:16px;font-size:13px;color:var(--muted)">
      City Flood Index: <strong>${100 - h}%</strong> · Current Health: <strong>${h}/100</strong>
    </div>
    <div class="row"><button class="btn small" id="close-telem">Close</button></div>`;

  document.body.appendChild(d);
  $("#close-telem", d).onclick = () => d.close();
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}

function openPitchModal() {
  let d = document.getElementById("pitch-dlg");
  if (d) d.remove();
  d = document.createElement("dialog");
  d.id = "pitch-dlg";
  d.className = "custom-dlg";

  d.innerHTML = `<h3>Storyverse Round 2 · Pitch &amp; SDG Guide</h3>
    <p style="margin:0 0 10px"><strong>Grand Theme: Impact for Good (SDG-Linked Storytelling)</strong></p>
    <h4>3-Minute Presentation Script for Jury</h4>
    <ul>
      <li><strong>Minute 1 (The Narrative &amp; Conflict):</strong> Shantipur floods not merely from rain, but from choked drains and a corrupt private contractor AI (GRIDLOCK) billing ₹4.8 crore while reporting all clear. Meera and BOLT turn community frustration into computational evidence.</li>
      <li><strong>Minute 2 (Real Python In-Browser):</strong> Every concept is taught at the exact moment the story demands it: print() to wake BOLT, variables for rain arithmetic, conditionals for waste sorting, loops for sweeping 12 drains, lists for evidence, and debugging to catch three hidden lies. Real Python executes in-browser with offline Skulpt runtime.</li>
      <li><strong>Minute 3 (SDG Impact &amp; Resolution):</strong> Instead of destroying the AI, Meera repairs it (containment over destruction), unlocking public floodgates, creating separate waste collection, and empowering citizen open-data verification.</li>
    </ul>
    <h4>United Nations Sustainable Development Goals (SDGs)</h4>
    <table>
      <tr><td>SDG 4</td><td>Quality Education: Teaches real Python from scratch with instant visual feedback.</td></tr>
      <tr><td>SDG 6</td><td>Clean Water &amp; Sanitation: Overflow calculations and emergency sump drainage.</td></tr>
      <tr><td>SDG 11</td><td>Sustainable Cities: Drainage infrastructure, flood prevention, open civic data.</td></tr>
      <tr><td>SDG 12</td><td>Responsible Consumption: Household waste source segregation (Red/Green/Blue).</td></tr>
      <tr><td>SDG 13</td><td>Climate Action: Building community resilience against severe monsoon deluges.</td></tr>
      <tr><td>SDG 16</td><td>Peace, Justice &amp; Strong Institutions: Data forensics exposing corruption.</td></tr>
    </table>
    <label class="demo">
      <input type="checkbox" id="pitch-demo" ${DEMO ? "checked" : ""}>
      <span><strong>Judge Demo Mode:</strong> Instantly unlock all 8 chapters and enable one-click solution preview for quick jury walkthroughs.</span>
    </label>
    <div class="row"><button class="btn small" id="close-pitch">Close</button></div>`;

  document.body.appendChild(d);
  $("#close-pitch", d).onclick = () => d.close();
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  $("#pitch-demo", d).onchange = (e) => {
    DEMO = e.target.checked;
    render();
  };
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}

function openAbout() {
  let d = document.getElementById("about-dlg");
  if (d) d.remove();
  d = document.createElement("dialog");
  d.id = "about-dlg";
  d.className = "custom-dlg";

  d.innerHTML = `<h3>Code Monsoon</h3>
    <p style="margin:0 0 6px"><strong>Don't just clean up the problem. Fix the system.</strong> A comic-style narrative coding adventure that teaches Python to complete beginners. Built for Storyverse (Round 2: Build the World) by Ajinkya Kalyankar.</p>
    <h4>Technical Highlights</h4>
    <ul>
      <li>In-browser Python execution via Skulpt engine with full offline fallback from <code>codes/vendor/</code>.</li>
      <li>Zero external framework dependencies: Vanilla HTML5, CSS3, JavaScript, SVG, and Web Audio API.</li>
      <li>Comprehensive test harness with dynamic variant re-testing to prevent hard-coding.</li>
      <li>Full modular source files located in the <code>codes/</code> folder, including 10 standalone Python solutions.</li>
    </ul>
    <h4>Tool Disclosures</h4>
    <ul>
      <li>Skulpt (open-source Python-in-browser interpreter).</li>
      <li>Google Fonts: Bangers, Hind, Kalam, JetBrains Mono.</li>
      <li>Original handcrafted SVG vector artwork rendered via procedural JavaScript.</li>
      <li>Anthropic Claude &amp; Google Gemini AI coding assistants for narrative refinement and code generation.</li>
    </ul>
    <label class="demo">
      <input type="checkbox" id="about-demo" ${DEMO ? "checked" : ""}>
      <span><strong>Judge Demo Mode:</strong> Unlocks every chapter and always allows solution reveal for fast jury review.</span>
    </label>
    <div class="row">
      <button class="btn small ghost" id="about-open-pitch">Pitch Script</button>
      <button class="btn small" id="close-about">Close</button>
    </div>`;

  document.body.appendChild(d);
  $("#close-about", d).onclick = () => d.close();
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  $("#about-open-pitch", d).onclick = () => { d.close(); openPitchModal(); };
  $("#about-demo", d).onchange = (e) => {
    DEMO = e.target.checked;
    render();
  };
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}

/* =========================================================
   EVENT WIRING & INITIALIZATION
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  $("#home").onclick = () => go({ screen: S.done.length ? "map" : "title" });
  $("#about").onclick = openAbout;
  $("#pitch").onclick = openPitchModal;
  $("#telem").onclick = openTelemetryModal;

  const sndBtn = $("#snd");
  if (sndBtn) {
    sndBtn.onclick = () => {
      SND = !SND;
      sndBtn.textContent = SND ? "Sound on" : "Sound off";
      sndBtn.setAttribute("aria-pressed", String(SND));
      sndBtn.classList.toggle("active", SND);
      if (SND) {
        initAudio();
        beep([660, 880]);
      }
    };
  }

  setEngine();
  render();

  /* Ambient Canvas Rain */
  (function () {
    const cv = document.getElementById("rain");
    if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cx = cv.getContext("2d");
    let W, H, drops = [];
    const size = () => {
      W = cv.width = innerWidth;
      H = cv.height = innerHeight;
      drops = Array.from({ length: Math.round(W / 9) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        l: 8 + Math.random() * 14,
        v: 6 + Math.random() * 7
      }));
    };
    size();
    addEventListener("resize", size);
    (function tick() {
      cx.clearRect(0, 0, W, H);
      cx.strokeStyle = "rgba(150, 190, 255, .55)";
      cx.lineWidth = 1;
      cx.beginPath();
      for (const d of drops) {
        cx.moveTo(d.x, d.y);
        cx.lineTo(d.x - d.l * .25, d.y + d.l);
        d.y += d.v;
        d.x -= d.v * .25;
        if (d.y > H) {
          d.y = -20;
          d.x = Math.random() * W * 1.1;
        }
      }
      cx.stroke();
      requestAnimationFrame(tick);
    })();
  })();
});
