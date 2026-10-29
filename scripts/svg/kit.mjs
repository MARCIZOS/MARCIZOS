// Shared SVG helpers: palette, fonts, primitives.

export const C = {
  bg: "#0D1117",
  panel: "#111822",
  panel2: "#0B1119",
  line: "#1F2A38",
  accent: "#58A6FF",
  accent2: "#2DD4A0",
  warn: "#F0A33E",
  text: "#E6EDF3",
  muted: "#7D8DA1",
  dim: "#4A5B6E",
};

export const MONO =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
export const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function frame(w, h, inner, extra = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<defs>
  <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
    <path d="M28 0H0V28" fill="none" stroke="${C.line}" stroke-width="1" opacity="0.35"/>
  </pattern>
  <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.14"/>
    <stop offset="60%" stop-color="${C.accent2}" stop-opacity="0.04"/>
    <stop offset="100%" stop-color="${C.bg}" stop-opacity="0"/>
  </linearGradient>
  ${extra}
</defs>
<rect width="${w}" height="${h}" rx="14" fill="${C.bg}"/>
<rect width="${w}" height="${h}" rx="14" fill="url(#grid)"/>
<rect width="${w}" height="${h}" rx="14" fill="url(#fade)"/>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="14" fill="none" stroke="${C.line}"/>
${inner}
</svg>`;
}

export const text = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.font || MONO}" font-size="${o.size || 14}" ` +
  `fill="${o.fill || C.text}" font-weight="${o.weight || 400}" ` +
  `${o.anchor ? `text-anchor="${o.anchor}" ` : ""}${o.spacing ? `letter-spacing="${o.spacing}" ` : ""}` +
  `>${esc(s)}</text>`;

export const box = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 10}" ` +
  `fill="${o.fill || C.panel}" stroke="${o.stroke || C.line}" stroke-width="1"/>`;

export const dot = (x, y, fill) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${fill}"/>`;

/** Wrap text to a character budget, returning tspan lines. */
export function wrap(s, max, limit = 3) {
  const words = String(s).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      lines.push(cur.trim());
      cur = w;
      if (lines.length === limit) break;
    } else cur += " " + w;
  }
  if (lines.length < limit && cur.trim()) lines.push(cur.trim());
  return lines.slice(0, limit);
}
