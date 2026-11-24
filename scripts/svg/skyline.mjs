/* The year as a skyline.
 *
 * One tower per repository, in the order it was first pushed. Every storey is
 * a real layer of that project's stack, so a tower's height is the depth of
 * what it runs on rather than a number anyone picked. The month under each
 * tower is its repository's creation date, read live at build time.
 *
 * On load the storeys rise out of the ground and the windows come on, left to
 * right across the year. After that a slow light crosses the skyline.
 */
import { C, MONO, SANS, frame, text } from "./kit.mjs";

const W = 1200, H = 396;
const PAD = 56;
const GROUND = 320;               // the street
const FLOOR = 33;                 // storey height
const TOWER = 126;                // storey width
const PLINTH = 13;
const ROOF = 11;
const CYCLE = 9;                  // seconds per light sweep

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TINT = ["#58A6FF", "#2DD4A0", "#F0A33E", "#A371F7", "#F778BA", "#5BC8E8"];

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Lit and unlit windows along one storey. */
function windows(x, y, tint, rnd) {
  const n = 5;
  const gap = (TOWER - 22) / n;
  let out = "";
  for (let i = 0; i < n; i += 1) {
    const lit = rnd() > 0.38;
    const wx = (x + 15 + i * gap).toFixed(1);
    const at = (0.3 + rnd() * 0.45).toFixed(3);   // when this one comes on
    out += `<rect x="${wx}" y="${(y + 17).toFixed(1)}" width="6" height="7.5" rx="1"
  fill="${lit ? tint : C.panel2}" opacity="${lit ? 0.9 : 0.85}">${
      lit
        ? `<animate attributeName="opacity" values="0;0;0.9" keyTimes="0;${at};1" dur="2.8s" fill="freeze"/>`
        : ""
    }</rect>`;
  }
  return out;
}

export function skyline(d) {
  const projects = (d.projects || []).slice(0, 6);
  if (!projects.length) {
    return { name: "skyline.svg", w: W, h: H, svg: frame(W, H, text(PAD, 180, "no projects in seed.json", { size: 12, fill: C.dim })) };
  }

  // Oldest repository first, so the skyline reads as the year did.
  const order = projects
    .map((p, i) => ({ ...p, tint: TINT[i % TINT.length], when: p.shipped || "" }))
    .sort((a, b) => String(a.when).localeCompare(String(b.when)));

  const slot = (W - PAD * 2) / order.length;
  const years = new Set(order.map((p) => p.when.slice(0, 4)).filter(Boolean));

  const towers = order
    .map((p, i) => {
      const cx = PAD + slot * (i + 0.5);
      const x = cx - TOWER / 2;
      const rnd = mulberry(9176 + i * 2311);
      const floors = p.stack.slice(0, 6);
      const topY = GROUND - PLINTH - floors.length * FLOOR - ROOF;

      // Storeys, ground floor first, each rising out of the street.
      const storeys = floors
        .map((tech, k) => {
          const y = GROUND - PLINTH - (k + 1) * FLOOR;
          const rise = GROUND - y;                       // how far it climbs
          // Staggered by duration rather than by begin, so the storey is already
          // in place for anyone whose renderer ignores SMIL.
          const dur = (0.75 + i * 0.16 + k * 0.11).toFixed(2);
          const shade = k % 2 ? C.panel : "#0E1620";
          return `<g>
  <animateTransform attributeName="transform" type="translate" values="0 ${rise.toFixed(1)};0 0"
    dur="${dur}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.85 0.3 1"/>
  <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${TOWER}" height="${FLOOR}" fill="${shade}" stroke="${C.line}" stroke-width="1"/>
  ${text(x + 9, y + 11.5, tech, { size: 8.5, fill: C.muted, font: MONO, spacing: 0.4 })}
  ${windows(x, y, p.tint, rnd)}
</g>`;
        })
        .join("");

      return `<g>
  <!-- plinth -->
  <rect x="${(x - 7).toFixed(1)}" y="${(GROUND - PLINTH).toFixed(1)}" width="${TOWER + 14}" height="${PLINTH}" rx="2" fill="#0B1119" stroke="${C.line}" stroke-width="1"/>

  ${storeys}

  <!-- parapet and beacon -->
  <g>
    <rect x="${(x - 5).toFixed(1)}" y="${topY.toFixed(1)}" width="${TOWER + 10}" height="${ROOF}" rx="2" fill="${C.panel}" stroke="${C.line}" stroke-width="1"/>
    <rect x="${(cx - 0.9).toFixed(1)}" y="${(topY - 13).toFixed(1)}" width="1.8" height="13" fill="${C.line}"/>
    <circle cx="${cx.toFixed(1)}" cy="${(topY - 15).toFixed(1)}" r="2.6" fill="${p.tint}">
      <animate attributeName="opacity" values="1;0.25;1" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    ${text(cx, topY - 25, p.badge, { size: 8, weight: 700, fill: p.tint, anchor: "middle", spacing: 1, font: MONO })}
  </g>

  <!-- street level -->
  ${text(cx, GROUND + 26, p.name, { size: 12.5, weight: 700, fill: C.text, anchor: "middle", font: SANS })}
  ${text(cx, GROUND + 43, p.when ? `${MONTHS[Number(p.when.slice(5, 7)) - 1]} ${p.when.slice(0, 4)}` : "—", { size: 9.5, fill: C.dim, anchor: "middle", spacing: 0.9 })}
</g>`;
    })
    .join("\n");

  // One light crossing the skyline, the way the sun does.
  const sweep = `<rect x="${-260}" y="90" width="260" height="${GROUND - 90}" fill="url(#dawn)" opacity="0.5">
  <animate attributeName="x" values="${-260};${W}" dur="${CYCLE}s" repeatCount="indefinite"
    calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.3 1"/>
</rect>`;

  const defs = `<linearGradient id="dawn" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.accent}" stop-opacity="0"/>
    <stop offset="50%" stop-color="${C.accent}" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
  </linearGradient>`;

  const spanLabel = order.length
    ? `${MONTHS[Number(order[0].when.slice(5, 7)) - 1]} → ${MONTHS[Number(order[order.length - 1].when.slice(5, 7)) - 1]} ${[...years].pop()}`
    : "";

  const inner = `
${text(PAD, 44, "// the year, built", { size: 12, fill: C.accent2 })}
${text(PAD, 68, "What I shipped in ${YEAR}".replace("${YEAR}", [...years][0] || ""), { size: 19, weight: 700, fill: C.text, font: SANS })}
${text(PAD + 232, 68, "one tower per repository · every storey is a layer of its stack", { size: 10.5, fill: C.dim })}
${text(W - PAD, 68, spanLabel, { size: 10.5, fill: C.muted, anchor: "end", font: MONO })}

${sweep}
${towers}
<path d="M${PAD - 10} ${GROUND} H${W - PAD + 10}" stroke="${C.accent2}" stroke-width="1.4" opacity="0.5"/>
<path d="M${PAD - 10} ${GROUND + 3.5} H${W - PAD + 10}" stroke="${C.line}" stroke-width="1"/>`;

  return { name: "skyline.svg", w: W, h: H, svg: frame(W, H, inner, defs) };
}
