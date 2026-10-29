// Per-project "live function" demos: small SMIL animations that act out what
// each project actually does. Rendered inside the project cards.
import { C, MONO, text, box, dot } from "./kit.mjs";

const W = 532, H = 150; // demo panel inner size

const panel = (inner, label) => `
${box(24, 112, W, H, { fill: "#070D0B", r: 10, stroke: "#17222E" })}
<g transform="translate(24,112)">
${inner}
${label ? `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.45;0.6;1" dur="6s" repeatCount="indefinite"/>
  ${box(W - 214, H - 30, 198, 20, { fill: "#11202B", r: 5, stroke: "#1E3446" })}
  ${text(W - 115, H - 16, label, { size: 9.5, fill: C.accent2, anchor: "middle", weight: 600 })}
</g>` : ""}
</g>`;

/* ---------------------------------------------------------------- TaskFlow */
/* A Gantt row slips; dependents shift by the same amount, and the task fed by
   two paths shifts once, not twice. That is the whole point of the engine. */
function taskflow() {
  const rows = [
    { n: "Schema", x: 16, w: 86, y: 18, shift: 0, grow: true },
    { n: "API", x: 110, w: 70, y: 48, shift: 1 },
    { n: "UI", x: 110, w: 64, y: 78, shift: 1 },
    { n: "Launch", x: 196, w: 58, y: 108, shift: 1, crit: true },
  ];
  const SLIP = 34;
  const bars = rows
    .map((r) => {
      const fill = r.crit ? C.warn : r.grow ? C.accent : C.accent2;
      const grow = r.grow
        ? `<animate attributeName="width" values="${r.w};${r.w};${r.w + SLIP};${r.w + SLIP}" keyTimes="0;0.18;0.3;1" dur="6s" repeatCount="indefinite"/>`
        : "";
      const move = r.shift
        ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${SLIP} 0;${SLIP} 0" keyTimes="0;${r.crit ? 0.42 : 0.3};${r.crit ? 0.54 : 0.42};1" dur="6s" repeatCount="indefinite" additive="sum"/>`
        : "";
      return `<g>${move}
<rect x="${r.x}" y="${r.y}" width="${r.w}" height="14" rx="4" fill="${fill}" opacity="0.85">${grow}</rect>
${text(r.x + 6, r.y + 11, r.n, { size: 9, fill: "#061014", weight: 700 })}</g>`;
    })
    .join("\n");

  const slipTag = `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.2;0.3;0.9;1" dur="6s" repeatCount="indefinite"/>
  ${text(118, 14, "+3d", { size: 10, fill: C.accent, weight: 700 })}</g>`;

  const gridlines = [0, 1, 2, 3, 4]
    .map((i) => `<line x1="${16 + i * 64}" y1="8" x2="${16 + i * 64}" y2="128" stroke="#13202C" stroke-width="1"/>`)
    .join("");

  return panel(`${gridlines}${bars}${slipTag}`, "shared path counted once");
}

/* -------------------------------------------------------------- Log analyzer */
/* Messages flow through the stream to three consumers. One dies holding an
   unacked entry; a healthy consumer reclaims it. */
function logs() {
  const streamY = 30;
  const workers = [
    { x: 60, label: "W1" },
    { x: 220, label: "W2", dies: true },
    { x: 380, label: "W3" },
  ];

  const msgs = [0, 1, 2]
    .map(
      (i) => `<circle r="4" fill="${C.accent2}">
  <animateMotion path="M8 ${streamY} H500" dur="3s" begin="${i * 1}s" repeatCount="indefinite"/>
</circle>`
    )
    .join("\n");

  const boxes = workers
    .map((w) => {
      const dying = w.dies
        ? `<animate attributeName="fill" values="${C.panel};${C.panel};#2A1416;#2A1416" keyTimes="0;0.4;0.5;1" dur="6s" repeatCount="indefinite"/>`
        : "";
      const strokeAnim = w.dies
        ? `<animate attributeName="stroke" values="#1E3446;#1E3446;#7A2B2B;#7A2B2B" keyTimes="0;0.4;0.5;1" dur="6s" repeatCount="indefinite"/>`
        : "";
      return `<rect x="${w.x}" y="78" width="72" height="34" rx="7" fill="${C.panel}" stroke="#1E3446">${dying}${strokeAnim}</rect>
${text(w.x + 36, 99, w.label, { size: 11, fill: C.text, anchor: "middle", weight: 700 })}
<line x1="${w.x + 36}" y1="${streamY + 8}" x2="${w.x + 36}" y2="76" stroke="#1B2A38" stroke-width="1"/>`;
    })
    .join("\n");

  // the stranded entry: sits on W2, pulses, then travels to W1
  const stranded = `<circle r="4.5" fill="${C.warn}" opacity="0">
  <animate attributeName="opacity" values="0;0;1;1;1;0" keyTimes="0;0.38;0.45;0.62;0.9;1" dur="6s" repeatCount="indefinite"/>
  <animateMotion path="M256 68 L256 68 L96 68" keyTimes="0;0.62;1" keyPoints="0;0;1" calcMode="linear" dur="6s" repeatCount="indefinite"/>
</circle>`;

  return panel(
    `<line x1="8" y1="${streamY}" x2="500" y2="${streamY}" stroke="#1B2A38" stroke-width="2"/>
${text(8, 18, "redis stream", { size: 9, fill: C.dim })}
${msgs}
${boxes}
${stranded}`,
    "W2 died → XAUTOCLAIM reclaimed"
  );
}

/* --------------------------------------------------------------------- ARAIA */
/* Four holdings look independent; under a macro shock the correlations
   converge and the effective number of bets collapses. */
function araia() {
  const pts = [
    [120, 36], [300, 36],
    [120, 100], [300, 100],
  ];
  const nodes = pts
    .map(
      ([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.accent}" opacity="0.9">
  <animate attributeName="fill" values="${C.accent};${C.accent};${C.warn};${C.warn}" keyTimes="0;0.4;0.55;1" dur="6s" repeatCount="indefinite"/>
</circle>`
    )
    .join("\n");

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3], [0, 3], [1, 2],
  ]
    .map(([a, b]) => {
      const [x1, y1] = pts[a], [x2, y2] = pts[b];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#223447" stroke-width="1">
  <animate attributeName="stroke-width" values="1;1;3.4;3.4" keyTimes="0;0.4;0.55;1" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="stroke" values="#223447;#223447;${C.warn};${C.warn}" keyTimes="0;0.4;0.55;1" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0.5;0.5;0.85;0.85" keyTimes="0;0.4;0.55;1" dur="6s" repeatCount="indefinite"/>
</line>`;
    })
    .join("\n");

  const enbHigh = `<g><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.4;0.5;1" dur="6s" repeatCount="indefinite"/>
${text(400, 72, "ENB", { size: 9.5, fill: C.dim })}
${text(400, 96, "3.85", { size: 22, fill: C.accent2, weight: 700 })}</g>`;
  const enbLow = `<g opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.6;1" dur="6s" repeatCount="indefinite"/>
${text(400, 72, "ENB", { size: 9.5, fill: C.dim })}
${text(400, 96, "1.42", { size: 22, fill: C.warn, weight: 700 })}</g>`;

  const shock = `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.4;0.47;0.6;1" dur="6s" repeatCount="indefinite"/>
  ${text(16, 24, "MACRO SHOCK", { size: 10, fill: C.warn, weight: 700, spacing: 1.2 })}</g>`;

  return panel(`${edges}${nodes}${enbHigh}${enbLow}${shock}`, "correlations converge under stress");
}

/* ------------------------------------------------------------------ HealGrid */
/* Signalling through the server, then the media path goes peer-to-peer. */
function healgrid() {
  const sx = 266, sy = 26;
  const px = 70, dx = 462, py = 104;

  const sig = (from, to, delay) =>
    `<circle r="3.5" fill="${C.accent}" opacity="0.9">
  <animateMotion path="M${from} ${py} Q${sx} ${sy + 20} ${to} ${sy + 10}" dur="1.1s" begin="${delay}s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="1;1;0" dur="1.1s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

  const p2p = `<line x1="${px + 22}" y1="${py}" x2="${dx - 22}" y2="${py}" stroke="${C.accent2}" stroke-width="2.5"
  stroke-dasharray="370" stroke-dashoffset="370">
  <animate attributeName="stroke-dashoffset" values="370;370;0;0" keyTimes="0;0.45;0.62;1" dur="6s" repeatCount="indefinite"/>
</line>
<circle r="4" fill="${C.accent2}" opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.62;0.68;1" dur="6s" repeatCount="indefinite"/>
  <animateMotion path="M${px + 22} ${py} H${dx - 22}" keyTimes="0;0.68;1" keyPoints="0;0;1" calcMode="linear" dur="6s" repeatCount="indefinite"/>
</circle>`;

  const node = (x, label, sub) =>
    `${box(x - 42, py - 20, 84, 40, { fill: C.panel, r: 8, stroke: "#1E3446" })}
${text(x, py - 3, label, { size: 10.5, fill: C.text, anchor: "middle", weight: 700 })}
${text(x, py + 11, sub, { size: 8.5, fill: C.dim, anchor: "middle" })}`;

  return panel(
    `${box(sx - 54, sy - 10, 108, 30, { fill: "#0E1A24", r: 7, stroke: "#1E3446" })}
${text(sx, sy + 9, "signalling", { size: 9.5, fill: C.muted, anchor: "middle" })}
<line x1="${px}" y1="${py - 22}" x2="${sx - 56}" y2="${sy + 12}" stroke="#1B2A38" stroke-dasharray="3 3"/>
<line x1="${dx}" y1="${py - 22}" x2="${sx + 56}" y2="${sy + 12}" stroke="#1B2A38" stroke-dasharray="3 3"/>
${sig(px, sx - 60, 0)}${sig(dx, sx + 60, 0.55)}
${p2p}
${node(px, "Patient", "browser")}
${node(dx, "Doctor", "browser")}`,
    "media goes peer-to-peer"
  );
}


/* ------------------------------------------------------------------- FairFix */
/* A service bill is read line by line and each item checked against the
   official schedule; the one that is not due gets flagged with its evidence. */
function fairfix() {
  const rows = [
    { n: "Engine oil 5W-30", p: "1,240", ok: true },
    { n: "Oil filter", p: "   380", ok: true },
    { n: "Throttle body clean", p: "2,100", ok: false },
    { n: "Air filter", p: "   640", ok: true },
  ];
  const lines = rows
    .map((r, i) => {
      const y = 26 + i * 25;
      const flag = !r.ok
        ? `<rect x="10" y="${y - 13}" width="340" height="22" rx="4" fill="${C.warn}" opacity="0">
  <animate attributeName="opacity" values="0;0;0.16;0.16" keyTimes="0;0.5;0.6;1" dur="6s" repeatCount="indefinite"/>
</rect>`
        : "";
      return `${flag}
${text(20, y, r.n, { size: 10, fill: r.ok ? C.muted : C.text })}
${text(330, y, r.p, { size: 10, fill: C.dim, anchor: "end" })}`;
    })
    .join("\n");

  const scan = `<rect x="10" y="10" width="340" height="2" fill="${C.accent}" opacity="0.7">
  <animate attributeName="y" values="10;120;120" keyTimes="0;0.42;1" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0.7;0.7;0;0" keyTimes="0;0.42;0.5;1" dur="6s" repeatCount="indefinite"/>
</rect>`;

  const verdict = `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.55;0.68;1" dur="6s" repeatCount="indefinite"/>
  ${box(366, 30, 150, 64, { fill: "#2A1D0E", r: 7, stroke: "#5B4418" })}
  ${text(378, 50, "NOT DUE", { size: 10, fill: C.warn, weight: 700, spacing: 1.1 })}
  ${text(378, 68, "schedule: 60,000 km", { size: 8.5, fill: C.muted })}
  ${text(378, 83, "odometer: 31,400 km", { size: 8.5, fill: C.muted })}
</g>`;

  return panel(
    `${box(10, 8, 340, 126, { fill: "#0A1016", r: 7, stroke: "#17222E" })}
${lines}${scan}${verdict}`,
    "every flag shows its evidence"
  );
}

/* ------------------------------------------------------------- Exam generator */
/* A scanned page is read by OCR, a question is drafted from it, and a
   submitted answer comes back scored. */
function examgen() {
  const page = `${box(16, 16, 108, 118, { fill: "#0A1016", r: 6, stroke: "#17222E" })}
${[0, 1, 2, 3, 4, 5]
    .map((i) => `<rect x="28" y="${32 + i * 16}" width="${i % 3 === 0 ? 70 : 84}" height="5" rx="2.5" fill="#1C2B3A"/>`)
    .join("")}
<rect x="18" y="18" width="104" height="3" fill="${C.accent2}" opacity="0.85">
  <animate attributeName="y" values="18;128;128" keyTimes="0;0.3;1" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0.85;0.85;0;0" keyTimes="0;0.3;0.38;1" dur="6s" repeatCount="indefinite"/>
</rect>
${text(16, 146, "scanned page", { size: 8.5, fill: C.dim })}`;

  const arrow = (x) => `<path d="M${x} 72 H${x + 26}" stroke="#223447" stroke-width="1.4"/>
<path d="M${x + 21} 68 L${x + 27} 72 L${x + 21} 76 Z" fill="#223447"/>`;

  const q = `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.38;0.5;1" dur="6s" repeatCount="indefinite"/>
  ${box(166, 28, 180, 60, { fill: C.panel, r: 7, stroke: "#1E3446" })}
  ${text(178, 48, "Q. Define idempotency", { size: 9.5, fill: C.text })}
  ${text(178, 64, "and give an example.", { size: 9.5, fill: C.text })}
  ${text(178, 80, "generated \u00b7 2 marks", { size: 8, fill: C.dim })}
</g>`;

  const score = `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.62;0.74;1" dur="6s" repeatCount="indefinite"/>
  ${box(388, 44, 120, 56, { fill: "#0E2A22", r: 7, stroke: "#1C4D3E" })}
  ${text(448, 72, "1.5 / 2", { size: 20, fill: C.accent2, weight: 700, anchor: "middle" })}
  ${text(448, 90, "auto-evaluated", { size: 8.5, fill: C.dim, anchor: "middle" })}
</g>`;

  return panel(`${page}${arrow(132)}${q}${arrow(352)}${q ? "" : ""}${score}`, "page \u2192 question \u2192 score");
}

/* ----------------------------------------------------------------- Rank Radar */
/* A wicket falls mid-over; points recompute and the fantasy rank moves. */
function rankradar() {
  const ball = (i) => {
    const x = 24 + i * 34;
    const wicket = i === 4;
    return `<circle cx="${x}" cy="34" r="10" fill="${wicket ? "#2A1416" : C.panel}" stroke="${wicket ? "#7A2B2B" : "#1E3446"}" opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${0.08 + i * 0.07};${0.14 + i * 0.07};1" dur="6s" repeatCount="indefinite"/>
</circle>
${text(x, 38, wicket ? "W" : String([1, 4, 0, 2, 0, 6][i] ?? 1), { size: 9.5, fill: wicket ? C.warn : C.muted, anchor: "middle", weight: 700, })}`;
  };
  const balls = [0, 1, 2, 3, 4, 5].map(ball).join("\n");

  const rankRow = (y, label, from, to, at) => `
${text(20, y, label, { size: 10, fill: C.muted })}
<g>
  <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 ${to} " keyTimes="0;${at};${at + 0.08}" dur="6s" repeatCount="indefinite" additive="sum" fill="freeze"/>
  ${text(300, y, from, { size: 10, fill: C.text, anchor: "end" })}
</g>`;

  const rankCard = `${box(16, 62, 300, 72, { fill: "#0A1016", r: 7, stroke: "#17222E" })}
${text(28, 80, "YOUR RANK", { size: 8.5, fill: C.dim, spacing: 1.2 })}
<g>
  <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.52;0.6;1" dur="6s" repeatCount="indefinite"/>
  ${text(28, 112, "#1,482", { size: 24, fill: C.muted, weight: 700 })}
</g>
<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.6;0.68;1" dur="6s" repeatCount="indefinite"/>
  ${text(28, 112, "#914", { size: 24, fill: C.accent2, weight: 700 })}
  ${text(118, 112, "\u25b2 568", { size: 11, fill: C.accent2, weight: 700 })}
</g>
${text(170, 80, "captain pts", { size: 8.5, fill: C.dim })}
<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.55;0.64;1" dur="6s" repeatCount="indefinite"/>
  ${text(170, 104, "+25", { size: 16, fill: C.warn, weight: 700 })}
</g>`;

  const wicketTag = `<g opacity="0">
  <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.45;0.52;0.9;1" dur="6s" repeatCount="indefinite"/>
  ${text(250, 38, "WICKET", { size: 10, fill: C.warn, weight: 700, spacing: 1.2 })}</g>`;

  return panel(
    `${text(16, 16, "over 14.5", { size: 8.5, fill: C.dim })}
${balls}${wicketTag}${rankCard}`,
    "live points, live rank"
  );
}

export const DEMOS = { taskflow, logs, araia, healgrid, fairfix, examgen, rankradar };
export const DEMO_H = H + 24;
