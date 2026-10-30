/* The link bar.
 *
 * Four chips, one SVG file each, so each one can be wrapped in its own <a>
 * in the README. Served straight from the repo, so the animation survives
 * GitHub's image proxy. A sheen crosses each chip on the same 4.6s cycle
 * with a per-chip offset, so the four read as one wave travelling right.
 *
 * Glyphs are plain geometry, never a company's mark.
 */
import { C, MONO, SANS, esc } from "./kit.mjs";

const W = 288;
const H = 60;
const CYCLE = 4.6;

/* -- glyphs, drawn inside a 22x22 box at the origin ------------------- */
const GLYPH = {
  site: (c) => `<rect x="0.9" y="2.4" width="20.2" height="17.2" rx="3.2" fill="none" stroke="${c}" stroke-width="1.6"/>
<path d="M0.9 7.6H21.1" stroke="${c}" stroke-width="1.6"/>
<circle cx="4.2" cy="5" r="1" fill="${c}"/><circle cx="7.4" cy="5" r="1" fill="${c}"/>`,

  person: (c) => `<circle cx="11" cy="7.4" r="4.1" fill="none" stroke="${c}" stroke-width="1.6"/>
<path d="M2.8 20.2a8.2 8.2 0 0 1 16.4 0" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`,

  code: (c) => `<path d="M7.4 5.6 1.8 11l5.6 5.4" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6 5.6 20.2 11l-5.6 5.4" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="11" cy="11" r="1.5" fill="${c}"/>`,

  mail: (c) => `<rect x="1.2" y="4" width="19.6" height="14" rx="2.6" fill="none" stroke="${c}" stroke-width="1.6"/>
<path d="M1.9 5.9 11 12.4l9.1-6.5" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
};

function chip({ slug, label, sub, glyph, accent, step }) {
  const begin = (step * CYCLE) / 8; // 0, 0.575, 1.15, 1.725s
  const g = GLYPH[glyph](accent);

  return {
    name: `link-${slug}.svg`,
    w: W,
    h: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<defs>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
    <stop offset="45%" stop-color="${accent}" stop-opacity="0.22"/>
    <stop offset="55%" stop-color="${accent}" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${C.panel}"/>
    <stop offset="100%" stop-color="${C.panel2}"/>
  </linearGradient>
  <clipPath id="body"><rect x="0" y="0" width="${W}" height="${H}" rx="12"/></clipPath>
</defs>

<g clip-path="url(#body)">
  <rect width="${W}" height="${H}" fill="url(#face)"/>

  <!-- the travelling sheen -->
  <rect x="0" y="0" width="150" height="${H}" fill="url(#sheen)">
    <animate attributeName="x" values="${-150};${W}" dur="${CYCLE}s" begin="${begin}s"
      repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.2 1"/>
  </rect>

  <!-- accent rail, drawn on load -->
  <rect x="0" y="${H}" width="3.5" height="0" fill="${accent}">
    <animate attributeName="y" values="${H};0" dur="0.7s" begin="${begin}s" fill="freeze"
      calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
    <animate attributeName="height" values="0;${H}" dur="0.7s" begin="${begin}s" fill="freeze"
      calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
  </rect>
</g>

<rect x="0.6" y="0.6" width="${W - 1.2}" height="${H - 1.2}" rx="12" fill="none" stroke="${C.line}"/>

<g transform="translate(22 19)" opacity="0.9">
  ${g}
  <animateTransform attributeName="transform" type="translate"
    values="22 19; 22 17.4; 22 19; 22 19" dur="${CYCLE}s" begin="${begin}s"
    repeatCount="indefinite" calcMode="spline" keyTimes="0;0.07;0.16;1"
    keySplines="0.3 0 0.2 1;0.3 0 0.2 1;0 0 1 1"/>
</g>

<text x="62" y="27" font-family="${SANS}" font-size="13.5" font-weight="700"
  fill="${C.text}" letter-spacing="1.4">${esc(label)}</text>
<text x="62" y="44" font-family="${MONO}" font-size="10" fill="${C.dim}">${esc(sub)}</text>

<circle cx="${W - 20}" cy="${H / 2}" r="3" fill="${accent}" opacity="0.35">
  <animate attributeName="opacity" values="0.25;0.95;0.25" dur="${CYCLE}s"
    begin="${begin}s" repeatCount="indefinite"/>
  <animate attributeName="r" values="2.6;4;2.6" dur="${CYCLE}s"
    begin="${begin}s" repeatCount="indefinite"/>
</circle>
</svg>`,
  };
}

export function links(d) {
  const lc = d.leetcode || {};
  const rating = lc.rating ? `Knight · ${lc.rating}` : "problems, daily";

  return [
    chip({ slug: "portfolio", label: "PORTFOLIO", sub: "the live site", glyph: "site", accent: C.accent, step: 0 }),
    chip({ slug: "linkedin", label: "LINKEDIN", sub: "in/kushagarwal0805", glyph: "person", accent: "#58A6FF", step: 1 }),
    chip({ slug: "leetcode", label: "LEETCODE", sub: rating, glyph: "code", accent: C.warn, step: 2 }),
    chip({ slug: "email", label: "EMAIL", sub: "kushagarwal0805@gmail.com", glyph: "mail", accent: C.accent2, step: 3 }),
  ];
}
