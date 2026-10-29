import { C, MONO, SANS, frame, text, box, dot, wrap } from "./kit.mjs";

const W = 1200, H = 440;

function statCol(x, y, value, label, sub, color) {
  const empty = value === null || value === undefined || value === "\u2014";
  return [
    text(x, y, empty ? "n/a" : value, { size: empty ? 22 : 34, weight: 700, fill: empty ? C.dim : color, font: MONO }),
    text(x, y + 22, label, { size: 11, weight: 600, fill: C.muted, spacing: 1.6 }),
    sub ? text(x, y + 38, sub, { size: 11, fill: C.dim }) : "",
  ].join("\n");
}

/** A small node-graph on the right: how the pieces connect. */
function diagram(ox, oy) {
  const n = (x, y, w, h, title, sub, accent) =>
    `${box(ox + x, oy + y, w, h, { fill: C.panel2, r: 8 })}
${dot(ox + x + w - 12, oy + y + 12, accent)}
${text(ox + x + 12, oy + y + 17, title, { size: 11.5, weight: 700, fill: C.text })}
${text(ox + x + 12, oy + y + 32, sub, { size: 10, fill: C.muted })}`;

  const wire = (d) =>
    `<path d="${d}" fill="none" stroke="#2B3A4D" stroke-width="1.4"/>`;

  return `
${wire(`M${ox + 150} ${oy + 36} H${ox + 212} V${oy + 118}`)}
${wire(`M${ox + 150} ${oy + 126} H${ox + 212}`)}
${wire(`M${ox + 150} ${oy + 216} H${ox + 212} V${oy + 134}`)}
${wire(`M${ox + 340} ${oy + 126} H${ox + 392}`)}
${wire(`M${ox + 392} ${oy + 126} V${oy + 36} H${ox + 448}`)}
${wire(`M${ox + 392} ${oy + 126} V${oy + 216} H${ox + 448}`)}
${n(0, 18, 150, 44, "Producers", "services emit", C.accent)}
${n(0, 104, 150, 44, "Redis Streams", "durable log", C.accent2)}
${n(0, 198, 150, 44, "Scheduler", "DAG order", C.warn)}
${box(ox + 212, oy + 96, 128, 60, { fill: C.panel, r: 10 })}
${text(ox + 276, oy + 120, "CONSUMER", { size: 10, weight: 700, fill: C.muted, anchor: "middle", spacing: 1.4 })}
${text(ox + 276, oy + 138, "GROUP", { size: 10, weight: 700, fill: C.muted, anchor: "middle", spacing: 1.4 })}
${n(448, 18, 150, 44, "Postgres", "state of record", C.accent)}
${n(448, 198, 150, 44, "FAISS", "similar incidents", C.accent2)}
${text(ox + 212, oy + 250, "add a consumer → throughput goes up", { size: 10.5, fill: C.dim })}`;
}

export function hero(d) {
  const { identity: id, leetcode: lc, github: gh } = d;
  const inner = `
${text(64, 60, id.comment, { size: 13, fill: C.accent2 })}
${text(62, 126, id.name, { size: 52, weight: 700, fill: C.text, font: SANS, spacing: 2 })}
${text(64, 158, id.role, { size: 15, weight: 600, fill: C.accent })}
${wrap(id.tagline, 74, 2).map((l, i) => text(64, 188 + i * 19, l, { size: 12.5, fill: C.muted, font: SANS })).join("\n")}

${statCol(64, 286, lc.solved ? `${lc.solved}+` : "—", "LEETCODE", "problems solved", C.accent2)}
${statCol(206, 286, lc.rating ?? "—", "RATING", "Knight", C.warn)}
${statCol(330, 286, gh.publicRepos ?? "—", "REPOS", "public", C.accent)}
${statCol(446, 286, gh.contributions ?? "—", "COMMITS", "last 12 months", C.accent)}

<path d="M64 352 H596" stroke="${C.line}" stroke-width="1"/>
${text(64, 376, `Rebuilt by GitHub Actions · last run ${d.builtAt}`, { size: 10.5, fill: C.dim })}
${diagram(600, 96)}`;
  return { name: "hero.svg", w: W, h: H, svg: frame(W, H, inner) };
}
