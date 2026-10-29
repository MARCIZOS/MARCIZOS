// Pulls live stats: GitHub (REST + GraphQL) and LeetCode (public GraphQL).
// No dependencies — Node 20+ global fetch only.

const GH = "https://api.github.com";

const headers = () => {
  const h = { Accept: "application/vnd.github+json", "User-Agent": "profile-builder" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
};

async function json(url, init) {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

export async function githubStats(user) {
  const [profile, repos] = await Promise.all([
    json(`${GH}/users/${user}`, { headers: headers() }),
    json(`${GH}/users/${user}/repos?per_page=100&type=owner`, { headers: headers() }),
  ]);

  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((a, r) => a + (r.stargazers_count || 0), 0);

  const langBytes = {};
  await Promise.all(
    own.slice(0, 30).map(async (r) => {
      try {
        const l = await json(r.languages_url, { headers: headers() });
        for (const [k, v] of Object.entries(l)) langBytes[k] = (langBytes[k] || 0) + v;
      } catch {}
    })
  );
  const total = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langBytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({ name, pct: +((bytes / total) * 100).toFixed(1) }));

  let contributions = null;
  let calendar = [];
  if (process.env.GITHUB_TOKEN) {
    try {
      const q = {
        query: `query($u:String!){user(login:$u){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`,
        variables: { u: user },
      };
      const g = await json(`${GH}/graphql`, {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify(q),
      });
      const cal = g?.data?.user?.contributionsCollection?.contributionCalendar;
      contributions = cal?.totalContributions ?? null;
      calendar = (cal?.weeks || []).map((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
      );
    } catch {}
  }

  return {
    name: profile.name || user,
    followers: profile.followers || 0,
    publicRepos: own.length,
    stars,
    languages,
    contributions,
    calendar,
  };
}

export async function leetcodeStats(user) {
  const query = `query($u:String!){
    matchedUser(username:$u){
      submitStatsGlobal{acSubmissionNum{difficulty count}}
    }
    userContestRanking(username:$u){rating attendedContestsCount topPercentage}
  }`;
  try {
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query, variables: { u: user } }),
    });
    if (!r.ok) throw new Error(`leetcode ${r.status}`);
    const d = await r.json();
    const nums = d?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const by = Object.fromEntries(nums.map((n) => [n.difficulty, n.count]));
    const cr = d?.data?.userContestRanking;
    return {
      ok: true,
      solved: by.All ?? null,
      easy: by.Easy ?? null,
      medium: by.Medium ?? null,
      hard: by.Hard ?? null,
      rating: cr?.rating ? Math.round(cr.rating) : null,
      contests: cr?.attendedContestsCount ?? null,
      topPercent: cr?.topPercentage ? +cr.topPercentage.toFixed(1) : null,
    };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

/** Contribution calendar from the public profile fragment (no token needed).
 *  Returns weeks[week][weekday] = { date, level } with level 0-4. */
export async function contributionCalendar(user) {
  try {
    const r = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "User-Agent": "profile-builder", Accept: "text/html" },
    });
    if (!r.ok) throw new Error(`contributions ${r.status}`);
    const html = await r.text();
    const re = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="contribution-day-component-(\d+)-(\d+)"[^>]*data-level="(\d+)"/g;
    const weeks = [];
    let m;
    while ((m = re.exec(html))) {
      const [, date, row, col, level] = m;
      const w = Number(col);
      if (!weeks[w]) weeks[w] = [];
      weeks[w][Number(row)] = { date, level: Number(level) };
    }
    return weeks
      .filter(Boolean)
      .map((wk) => Array.from({ length: 7 }, (_, i) => wk[i] || { date: "", level: 0 }));
  } catch {
    return [];
  }
}
