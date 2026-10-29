import { C, MONO, SANS, frame, text, box, dot, wrap } from "./kit.mjs";

const W = 580, H = 258;

export function card(p) {
  const badgeW = 14 + p.badge.length * 6.6;
  const lines = wrap(p.blurb, 62, 3);
  const inner = `
${box(24, 22, badgeW, 22, { fill: "#0E2A22", stroke: "#1C4D3E", r: 6 })}
${text(24 + badgeW / 2, 37, p.badge, { size: 9.5, weight: 700, fill: C.accent2, anchor: "middle", spacing: 1.3 })}
${text(24, 78, p.name, { size: 24, weight: 700, fill: C.text, font: SANS })}

${lines.map((l, i) => text(24, 108 + i * 18, l, { size: 12, fill: C.muted, font: SANS })).join("\n")}

<path d="M24 172 H556" stroke="${C.line}" stroke-width="1"/>
${dot(30, 194, C.warn)}
${text(44, 198, p.metric, { size: 12.5, weight: 700, fill: C.text })}
${text(24, 218, p.proof, { size: 10.5, fill: C.dim })}

${(() => {
  let x = 24;
  return p.stack
    .map((s) => {
      const w = 12 + s.length * 6.4;
      const el = `${box(x, 228, w, 20, { fill: C.panel2, r: 5 })}
${text(x + w / 2, 242, s, { size: 9.5, fill: C.muted, anchor: "middle" })}`;
      x += w + 8;
      return el;
    })
    .join("\n");
})()}`;
  return { name: `card-${p.slug}.svg`, w: W, h: H, svg: frame(W, H, inner) };
}

export function cards(d) {
  return d.projects.map(card);
}

/** Live scoreboard: LeetCode breakdown + language mix. */
export function scoreboard(d) {
  const w = 1200, h = 300;
  const lc = d.leetcode, gh = d.github;

  const bar = (x, y, pct, color, width = 420) =>
    `${box(x, y, width, 8, { fill: C.panel2, r: 4, stroke: C.panel2 })}
<rect x="${x}" y="${y}" width="${Math.max(4, (width * pct) / 100)}" height="8" rx="4" fill="${color}"/>`;

  const langs = (gh.languages || []).slice(0, 5);
  const palette = [C.accent, C.accent2, C.warn, "#A371F7", "#F778BA"];

  const inner = `
${text(44, 48, "// live", { size: 12, fill: C.accent2 })}
${box(44, 66, 520, 198, { fill: C.panel2, r: 12 })}
${text(68, 100, "LEETCODE", { size: 11, weight: 700, fill: C.muted, spacing: 1.6 })}
${text(68, 150, lc.solved ? `${lc.solved}+` : "—", { size: 46, weight: 700, fill: C.accent2 })}
${text(68, 172, "problems solved", { size: 11.5, fill: C.dim })}
${text(300, 124, lc.rating ?? "—", { size: 30, weight: 700, fill: C.warn })}
${text(300, 142, "CONTEST RATING · KNIGHT", { size: 9.5, weight: 600, fill: C.muted, spacing: 1.1 })}
${lc.contests != null ? text(300, 176, `${lc.contests} contests`, { size: 11, fill: C.dim }) : ""}
${text(68, 212, "Deliberate practice, not a streak.", { size: 11, fill: C.dim })}
${text(68, 234, "Graphs, DP, heaps — the same shapes as the schedulers.", { size: 11, fill: C.dim })}

${box(596, 66, 560, 198, { fill: C.panel2, r: 12 })}
${text(620, 100, "LANGUAGE MIX", { size: 11, weight: 700, fill: C.muted, spacing: 1.6 })}
${langs
  .map((l, i) => {
    const y = 126 + i * 26;
    return `${text(620, y + 7, l.name, { size: 11.5, fill: C.text })}
${bar(712, y, l.pct, palette[i % palette.length], 380)}
${text(1132, y + 7, `${l.pct}%`, { size: 10.5, fill: C.muted, anchor: "end" })}`;
  })
  .join("\n")}`;
  return { name: "scoreboard.svg", w, h, svg: frame(w, h, inner) };
}
