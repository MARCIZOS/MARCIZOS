// Orchestrator: fetch live stats, fall back to seed, render SVGs, rewrite README.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { githubStats, leetcodeStats, contributionCalendar } from "./fetch.mjs";
import { hero } from "./svg/hero.mjs";
import { cards, scoreboard } from "./svg/cards.mjs";
import { trace } from "./svg/trace.mjs";
import { renderReadme } from "./readme.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const ASSETS = join(root, "assets");

const GH_USER = process.env.GH_USER || "MARCIZOS";
const LC_USER = process.env.LC_USER || "kush0809";
const OFFLINE = process.env.OFFLINE === "1";

const seed = JSON.parse(readFileSync(join(here, "seed.json"), "utf8"));

const data = {
  ...seed,
  builtAt: new Date().toISOString().slice(0, 10),
  sources: {},
};

if (!OFFLINE) {
  try {
    const gh = await githubStats(GH_USER);
    data.github = {
      ...seed.github,
      publicRepos: gh.publicRepos,
      stars: gh.stars,
      contributions: gh.contributions ?? seed.github.contributions,
      languages: gh.languages.length ? gh.languages : seed.github.languages,
      calendar: await contributionCalendar(GH_USER),
    };
    data.sources.github = "live";
  } catch (e) {
    data.sources.github = `seed (${e.message})`;
  }

  const lc = await leetcodeStats(LC_USER);
  if (lc.ok) {
    data.leetcode = {
      ...seed.leetcode,
      solved: lc.solved ?? seed.leetcode.solved,
      rating: lc.rating ?? seed.leetcode.rating,
      easy: lc.easy, medium: lc.medium, hard: lc.hard,
      contests: lc.contests,
    };
    data.sources.leetcode = "live";
  } else {
    data.sources.leetcode = `seed (${lc.error})`;
  }
} else {
  data.sources = { github: "offline", leetcode: "offline" };
}

mkdirSync(ASSETS, { recursive: true });

const out = [hero(data), scoreboard(data), trace(data), ...cards(data)];
for (const f of out) {
  writeFileSync(join(ASSETS, f.name), f.svg);
  console.log(`  ${f.name.padEnd(22)} ${f.w}x${f.h}`);
}

writeFileSync(join(root, "README.md"), renderReadme(data));
console.log("  README.md");
console.log("sources:", JSON.stringify(data.sources));
