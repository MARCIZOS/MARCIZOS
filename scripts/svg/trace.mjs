/* The contribution year as a scheduler trace.
 *
 * Seven weekday lanes, one column per week, a block per day sized and coloured
 * by that day's commits. A playhead sweeps the year left to right and each week
 * lights as it passes, the way a profiler replays a captured timeline.
 * Falls back to a flat year when no calendar is available.
 */
import { C, MONO, SANS, frame, text, box } from "./kit.mjs";

const W = 1200, H = 322;
const X0 = 56, Y0 = 118;        // grid origin
const CELL = 14, GAP = 3.6;    // day cell
const LANES = 7;
const CYCLE = 9;               // seconds per sweep

const BUCKET = ["#121B26", "#174A3A", "#1F7A58", "#2DD4A0", "#7BF5C9"];

const bucket = (n, max) => {
  if (!n) return 0;
  const r = n / Math.max(1, max);
  if (r > 0.66) return 4;
  if (r > 0.38) return 3;
  if (r > 0.15) return 2;
  return 1;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function trace(d) {
  const weeks = (d.github && d.github.calendar) || [];
  const hasData = weeks.length > 0;

  // Synthesised quiet year when the calendar is unavailable, so the panel
  // still renders rather than collapsing.
  const grid = hasData
    ? weeks
    : Array.from({ length: 53 }, () => Array.from({ length: 7 }, () => ({ date: "", level: 0 })));

  const levels = grid.flat().map((x) => x.level || 0);
  const active = levels.filter((l) => l > 0).length;
  const total = (d.github && d.github.contributions) ?? null;

  let best = 0, run = 0;
  for (const day of grid.flat()) {
    run = (day.level || 0) > 0 ? run + 1 : 0;
    if (run > best) best = run;
  }

  const nWeeks = grid.length;
  const colW = CELL + GAP;
  const gridW = nWeeks * colW;

  // day cells, grouped per week so one animation drives a whole column
  const cols = grid
    .map((week, w) => {
      const x = X0 + w * colW;
      const cells = week
        .map((day, i) => {
          const y = Y0 + i * colW;
          const b = Math.min(4, Math.max(0, day.level || 0));
          return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${BUCKET[b]}"/>`;
        })
        .join("");
      const at = w / nWeeks;
      // brief lift as the playhead crosses this column
      const glow = `<rect x="${x - 1}" y="${Y0 - 1}" width="${CELL + 2}" height="${LANES * colW}" rx="4"
  fill="${C.accent2}" opacity="0">
  <animate attributeName="opacity" values="0;0;0.22;0;0"
    keyTimes="0;${Math.max(0, at - 0.012).toFixed(4)};${at.toFixed(4)};${Math.min(1, at + 0.03).toFixed(4)};1"
    dur="${CYCLE}s" repeatCount="indefinite"/>
</rect>`;
      return cells + glow;
    })
    .join("\n");

  const playhead = `<g>
  <animateTransform attributeName="transform" type="translate" values="0 0;${gridW} 0" dur="${CYCLE}s" repeatCount="indefinite"/>
  <line x1="${X0}" y1="${Y0 - 10}" x2="${X0}" y2="${Y0 + LANES * colW + 4}" stroke="${C.accent2}" stroke-width="1.4" opacity="0.85"/>
  <circle cx="${X0}" cy="${Y0 - 14}" r="3" fill="${C.accent2}"/>
</g>`;

  // month ruler
  let months = "";
  if (hasData) {
    let last = -1;
    grid.forEach((week, w) => {
      const first = week.find((x) => x.date);
      if (!first) return;
      const m = new Date(first.date).getUTCMonth();
      if (m !== last) {
        months += text(X0 + w * colW, Y0 - 16, MONTHS[m], { size: 9.5, fill: C.dim });
        last = m;
      }
    });
  }

  const lanes = ["M", "T", "W", "T", "F", "S", "S"]
    .map((l, i) => text(X0 - 14, Y0 + i * colW + 11, l, { size: 9, fill: C.dim, anchor: "middle" }))
    .join("");

  const stat = (x, value, label) =>
    `${text(x, 288, value, { size: 24, weight: 700, fill: C.accent2, font: MONO })}
${text(x, 306, label, { size: 9.5, fill: C.dim, spacing: 1.1 })}`;

  const readout = hasData
    ? `${stat(X0, total == null ? "\u2014" : String(total), "CONTRIBUTIONS, 12 MONTHS")}
${stat(X0 + 250, String(best), "LONGEST STREAK, DAYS")}
${stat(X0 + 450, String(active), "ACTIVE DAYS")}`
    : text(X0, 292, "calendar unavailable on this run", { size: 11, fill: C.dim });

  const legend = `${text(W - 196, Y0 + LANES * colW - 2, "less", { size: 9, fill: C.dim })}
${BUCKET.map((c, i) => `<rect x="${W - 166 + i * 15}" y="${Y0 + LANES * colW - 12}" width="11" height="11" rx="2.5" fill="${c}"/>`).join("")}
${text(W - 86, Y0 + LANES * colW - 2, "more", { size: 9, fill: C.dim })}`;

  const inner = `
${text(44, 44, "// the year, replayed", { size: 12, fill: C.accent2 })}
${text(44, 68, "Contribution trace", { size: 19, weight: 700, fill: C.text, font: SANS })}
${text(228, 68, "seven lanes, one column per week · playhead sweeps the year", { size: 10.5, fill: C.dim })}
${months}${lanes}${cols}${playhead}${legend}
<path d="M${X0} 262 H${W - 56}" stroke="${C.line}" stroke-width="1"/>
${readout}`;

  return { name: "trace.svg", w: W, h: H, svg: frame(W, H, inner) };
}
