/* "By the numbers" as a panel instead of a markdown table.
 *
 * One headline result across the top, then four tiles, each of which acts
 * out the figure it reports: a pulse that crosses the rail in no time, a
 * drawdown bar that stops short, a grid of solved problems filling in, a
 * marker climbing a leaderboard. Everything shares one 6s beat.
 */
import { C, MONO, SANS, frame, text, box } from "./kit.mjs";

const W = 1200, H = 352;
const CYCLE = 6;

const PAD = 44;
const INNER = W - PAD * 2;        // 1112
const TW = (INNER - 60) / 4;      // 263
const TY = 184, TH = 140;
const tx = (i) => PAD + i * (TW + 20);

/* ---------------------------------------------------------- headline */
function headline() {
  const x = PAD, y = 90, w = INNER, h = 78;
  return `${box(x, y, w, h, { fill: C.panel2, r: 12 })}
<g clip-path="url(#hcap)">
  <rect x="${x}" y="${y}" width="170" height="${h}" fill="url(#gold)">
    <animate attributeName="x" values="${x - 170};${x + w}" dur="${CYCLE}s"
      repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
  </rect>
</g>
${box(x + 22, y + 24, 108, 22, { fill: "#2A2210", stroke: "#4D3E1C", r: 5 })}
${text(x + 76, y + 39, "GRAND PRIZE", { size: 9.5, weight: 700, fill: C.warn, anchor: "middle", spacing: 1.3 })}
${text(x + 148, y + 35, "Contata NCR Hackathon 2026", { size: 16, weight: 700, fill: C.text, font: SANS })}
${text(x + 148, y + 55, "PS-01 · TaskFlow Pro · first of the cohort", { size: 11, fill: C.muted, font: SANS })}
<rect x="${x + 148}" y="${y + 62}" width="0" height="1.6" rx="1" fill="${C.warn}" opacity="0.75">
  <animate attributeName="width" values="0;250" dur="1.2s" begin="0.3s" fill="freeze"
    calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
</rect>`;
}

/* --------------------------------------------------- tile scaffolding */
function tile(i, { big, bigFill, unit, line, sub, art }) {
  const x = tx(i);
  return `${box(x, TY, TW, TH, { fill: C.panel2, r: 12 })}
${text(x + 20, TY + 50, big, { size: 34, weight: 700, fill: bigFill })}
${unit ? text(x + 20 + big.length * 20.5, TY + 50, unit, { size: 13, fill: C.dim }) : ""}
${text(x + 20, TY + 72, line, { size: 11.5, fill: C.text, font: SANS })}
${text(x + 20, TY + 89, sub, { size: 10, fill: C.dim })}
${art(x)}`;
}

/* 01 — latency: a pulse crosses the rail before the eye catches it */
function latencyArt(x) {
  const rx = x + 20, ry = TY + 112, rw = TW - 40;
  const ticks = Array.from({ length: 9 }, (_, k) =>
    `<rect x="${(rx + (k * rw) / 8).toFixed(1)}" y="${ry - 4}" width="1" height="8" fill="${C.line}"/>`
  ).join("");
  return `<rect x="${rx}" y="${ry - 1}" width="${rw}" height="2" rx="1" fill="${C.line}"/>
${ticks}
<rect x="${rx}" y="${ry - 4}" width="22" height="8" rx="4" fill="${C.accent2}">
  <animate attributeName="x" values="${rx};${rx};${rx + rw - 22};${rx + rw - 22}"
    keyTimes="0;0.08;0.13;1" dur="${CYCLE}s" repeatCount="indefinite"
    calcMode="spline" keySplines="0 0 1 1;0.2 0.8 0.2 1;0 0 1 1"/>
  <animate attributeName="opacity" values="0;1;1;0.25;0.25;0"
    keyTimes="0;0.07;0.14;0.5;0.94;1" dur="${CYCLE}s" repeatCount="indefinite"/>
</rect>`;
}

/* 02 — drawdown: the protected book stops well short of the drop */
function drawdownArt(x) {
  const base = TY + 112, h = 32;
  const bx = x + TW - 92;
  const bar = (dx, hh, fill) =>
    `<rect x="${bx + dx}" y="${base}" width="22" height="0" rx="3" fill="${fill}">
  <animate attributeName="height" values="0;0;${hh};${hh};0" keyTimes="0;0.05;0.35;0.9;1"
    dur="${CYCLE}s" repeatCount="indefinite" calcMode="spline"
    keySplines="0 0 1 1;0.25 0.1 0.25 1;0 0 1 1;0.4 0 1 1"/>
  <animate attributeName="y" values="${base};${base};${base - hh};${base - hh};${base}"
    keyTimes="0;0.05;0.35;0.9;1" dur="${CYCLE}s" repeatCount="indefinite" calcMode="spline"
    keySplines="0 0 1 1;0.25 0.1 0.25 1;0 0 1 1;0.4 0 1 1"/>
</rect>`;
  return `<rect x="${bx - 8}" y="${base + 1}" width="78" height="1" fill="${C.line}"/>
${bar(0, h, C.warn)}
${bar(32, h * 0.41, C.accent2)}
${text(bx + 11, base + 15, "before", { size: 8, fill: C.dim, anchor: "middle" })}
${text(bx + 43, base + 15, "after", { size: 8, fill: C.accent2, anchor: "middle" })}`;
}

/* 03 — the solved grid filling in, left to right */
function solvedArt(x) {
  const cols = 16, rows = 3, gx = x + 20, gy = TY + 102, s = 5.2, gap = 3.4;
  let out = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c;
      const a = (0.08 + (c / cols) * 0.42 + r * 0.012).toFixed(4);
      out += `<rect x="${(gx + c * (s + gap)).toFixed(1)}" y="${(gy + r * (s + gap)).toFixed(1)}" width="${s}" height="${s}" rx="1.4" fill="${C.accent2}" opacity="0.12">
  <animate attributeName="opacity" values="0.12;0.12;0.95;0.95;0.12"
    keyTimes="0;${a};${(Number(a) + 0.02).toFixed(4)};0.92;1" dur="${CYCLE}s"
    repeatCount="indefinite" begin="${(i % 3) * 0.01}s"/>
</rect>`;
    }
  }
  return out;
}

/* 04 — the climb up a leaderboard */
function rankArt(x) {
  const n = 6, step = 8, w = 48;
  const lx = x + TW - 76, top = TY + 88;
  const rungs = Array.from({ length: n }, (_, k) =>
    `<rect x="${lx}" y="${(top + k * step).toFixed(1)}" width="${w}" height="2.4" rx="1.2" fill="${k === 0 ? C.warn : C.line}" opacity="${k === 0 ? 0.9 : 1}"/>`
  ).join("");
  // The marker starts on the bottom rung and steps up to the top.
  const ys = Array.from({ length: n }, (_, k) => (top + (n - 1 - k) * step + 1.2).toFixed(1));
  const seq = [...ys, ys[n - 1]].join(";");
  return `<rect x="${lx - 11}" y="${top}" width="1.4" height="${(n - 1) * step + 2.4}" fill="${C.line}"/>
${rungs}
<circle cx="${lx - 10.3}" cy="${ys[0]}" r="3.6" fill="${C.warn}">
  <animate attributeName="cy" values="${seq}" keyTimes="0;0.1;0.2;0.3;0.4;0.5;1"
    dur="${CYCLE}s" repeatCount="indefinite" calcMode="discrete"/>
</circle>`;
}

export function numbers(d) {
  const lc = d.leetcode || {};
  const solved = lc.solved ? `${lc.solved}+` : "540+";
  const rating = lc.rating ?? 1938;

  const inner = `
${text(PAD, 44, "// what it adds up to", { size: 12, fill: C.accent2 })}
${text(PAD, 68, "By the numbers", { size: 19, weight: 700, fill: C.text, font: SANS })}
${text(PAD + 188, 68, "each figure measured in a test or a benchmark, not asserted", { size: 10.5, fill: C.dim })}

${headline()}

${tile(0, {
    big: "< 1", bigFill: C.accent2, unit: "ms",
    line: "to re-plan 1,000 tasks",
    sub: "3,000 links · 94% coverage",
    art: latencyArt,
  })}
${tile(1, {
    big: "59", bigFill: C.accent, unit: "%",
    line: "less stressed drawdown",
    sub: "ARAIA · simulated shock",
    art: drawdownArt,
  })}
${tile(2, {
    big: solved, bigFill: C.warn, unit: "",
    line: "DSA problems solved",
    sub: `LeetCode Knight · ${rating}`,
    art: solvedArt,
  })}
${tile(3, {
    big: "Top 10", bigFill: C.text, unit: "",
    line: "of 120+ teams",
    sub: "HackO'Clock · national",
    art: rankArt,
  })}`;

  const defs = `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.warn}" stop-opacity="0"/>
    <stop offset="50%" stop-color="${C.warn}" stop-opacity="0.13"/>
    <stop offset="100%" stop-color="${C.warn}" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="hcap"><rect x="${PAD}" y="90" width="${INNER}" height="78" rx="12"/></clipPath>`;

  return { name: "numbers.svg", w: W, h: H, svg: frame(W, H, inner, defs) };
}
