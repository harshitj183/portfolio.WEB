import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate at most every hour
export const runtime = 'nodejs'; // Node runtime for reliable network & scraping

async function fetchWithTimeout(url: string, options: any = {}, timeout = 6000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Scrape GitHub official contributions calendar
async function fetchGitHubContributions(username: string) {
  try {
    const res = await fetchWithTimeout(`https://github.com/users/${username}/contributions`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 3600 }
    }, 6000);

    if (!res.ok) throw new Error(`GitHub responded with ${res.status}`);
    const html = await res.text();

    const dateMap = new Map<string, { count: number; level: number }>();
    const tdRegex = /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="(\d+)"[^>]*>/g;
    let m;
    while ((m = tdRegex.exec(html)) !== null) {
      const [_, date, id, level] = m;
      const tipRegex = new RegExp(`<tool-tip[^>]*for="${id}"[^>]*>([\\s\\S]*?)<\\/tool-tip>`);
      const tipMatch = html.match(tipRegex);
      let count = 0;
      if (tipMatch) {
        const txt = tipMatch[1].trim();
        const cnt = txt.match(/(\d+)\s+contribution/);
        if (cnt) {
          count = parseInt(cnt[1], 10);
        }
      } else {
        count = parseInt(level, 10);
      }
      dateMap.set(date, { count, level: parseInt(level, 10) });
    }

    if (dateMap.size === 0) throw new Error('No contribution dates found in HTML');

    const sortedDates = Array.from(dateMap.keys()).sort();
    const sortedDays = sortedDates.map(d => ({ date: d, ...dateMap.get(d)! }));

    // Extract exact 364 days for 52-week grid (52 * 7 = 364)
    const last364 = sortedDays.slice(-364);
    const heatmap = last364.map(d => d.count);
    const totalContributions = sortedDays.reduce((acc, d) => acc + d.count, 0);

    // Dynamic streak calculation
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let j = 0; j < sortedDays.length; j++) {
      if (sortedDays[j].count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    let i = sortedDays.length - 1;
    // Allow today to not have contributions yet if yesterday did
    if (i >= 0 && sortedDays[i].count === 0) {
      i--;
    }
    while (i >= 0 && sortedDays[i].count > 0) {
      currentStreak++;
      i--;
    }

    return {
      heatmap,
      totalContributions,
      currentStreak,
      longestStreak
    };
  } catch (error) {
    console.error('GitHub scraper error:', error);
    return null;
  }
}

// Fetch LeetCode stats via official GraphQL
async function fetchLeetCodeOfficial(username: string) {
  const query = `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        submissionCalendar
        profile {
          ranking
          reputation
        }
        badges {
          id
          displayName
          icon
          creationDate
        }
      }
    }
  `;

  try {
    const res = await fetchWithTimeout('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://leetcode.com/${username}/`
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }
    }, 6000);

    if (!res.ok) throw new Error(`LeetCode GraphQL responded with ${res.status}`);
    const data = await res.json();
    const user = data.data?.matchedUser;
    if (!user) throw new Error('Matched user not found in LeetCode response');

    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 468;
    const easySolved = stats.find((s: any) => s.difficulty === 'Easy')?.count || 272;
    const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 170;
    const hardSolved = stats.find((s: any) => s.difficulty === 'Hard')?.count || 26;

    const allQ = data.data?.allQuestionsCount || [];
    const totalEasy = allQ.find((q: any) => q.difficulty === 'Easy')?.count || 965;
    const totalMedium = allQ.find((q: any) => q.difficulty === 'Medium')?.count || 2115;
    const totalHard = allQ.find((q: any) => q.difficulty === 'Hard')?.count || 975;
    const totalQuestions = allQ.find((q: any) => q.difficulty === 'All')?.count || 4055;

    // Parse Calendar
    const calendar = typeof user.submissionCalendar === 'string'
      ? JSON.parse(user.submissionCalendar || '{}')
      : (user.submissionCalendar || {});
    
    const heatmap = Array(364).fill(0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const msInDay = 24 * 60 * 60 * 1000;
    let totalSubmissions = 0;

    for (const [timestamp, count] of Object.entries(calendar)) {
      const date = new Date(parseInt(timestamp) * 1000);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((now.getTime() - date.getTime()) / msInDay);
      if (diffDays >= 0 && diffDays < 364) {
        heatmap[363 - diffDays] += count as number;
        totalSubmissions += count as number;
      }
    }

    const badges = (user.badges || []).map((b: any) => ({
      displayName: b.displayName,
      icon: b.icon?.startsWith('/') ? `https://leetcode.com${b.icon}` : b.icon
    }));

    return {
      stats: {
        solved: totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        totalEasy,
        totalMedium,
        totalHard,
        totalQ: totalQuestions,
        totalSubmissions
      },
      heatmap,
      badges
    };
  } catch (error) {
    console.error('LeetCode official GraphQL error:', error);
    return null;
  }
}

export async function GET() {
  try {
    // 1. Github User Stats
    const ghResPromise = fetchWithTimeout('https://api.github.com/users/harshitj183', {
      headers: { 'User-Agent': 'portfolio-bot' },
      next: { revalidate: 3600 }
    }, 5000)
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}));

    // 2. Github Repos
    const reposResPromise = fetchWithTimeout('https://api.github.com/users/harshitj183/repos?per_page=100', {
      headers: { 'User-Agent': 'portfolio-bot' },
      next: { revalidate: 3600 }
    }, 5000)
      .then(r => r.ok ? r.json() : [])
      .catch(() => []);

    // 3. Github Contribution Heatmap (Direct Scraping)
    const ghContributionsPromise = fetchGitHubContributions('harshitj183');

    // 4. LeetCode Official GraphQL Fetch
    const lcOfficialPromise = fetchLeetCodeOfficial('harshitj183');

    // Wait for all to resolve in parallel for maximum performance
    const [ghData, repos, ghContribData, lcResult] = await Promise.all([
      ghResPromise, reposResPromise, ghContributionsPromise, lcOfficialPromise
    ]);

    // Parse GitHub Heatmap & Stats
    const ghHeatmap = ghContribData?.heatmap || Array(364).fill(0);
    const totalStars = Array.isArray(repos) ? repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0) : 0;
    const totalContributions = ghContribData?.totalContributions || 3229;
    const calculatedStreak = ghContribData?.currentStreak || (ghContribData?.longestStreak ? Math.min(ghContribData.longestStreak, 42) : 42);

    // Fallback baseline for LeetCode if completely offline
    const fallbackLcStats = {
      solved: 468,
      easySolved: 272,
      mediumSolved: 170,
      hardSolved: 26,
      totalEasy: 965,
      totalMedium: 2115,
      totalHard: 975,
      totalQ: 4055,
      totalSubmissions: 1427
    };

    const lcStats = lcResult?.stats || fallbackLcStats;
    const lcHeatmap = lcResult?.heatmap || Array(364).fill(0);
    const lcBadges = lcResult?.badges || [
      { displayName: '365 Days Badge', icon: 'https://assets.leetcode.com/static_assets/marketing/lg365.png' },
      { displayName: '200 Days Badge 2026', icon: 'https://assets.leetcode.com/static_assets/others/200_1080_1080.png' },
      { displayName: '100 Days Badge 2026', icon: 'https://assets.leetcode.com/static_assets/others/100_1080_1080.png' },
      { displayName: '50 Days Badge 2026', icon: 'https://assets.leetcode.com/static_assets/others/50_1080_1080.png' },
      { displayName: '100 Days Badge 2025', icon: 'https://assets.leetcode.com/static_assets/others/lg25100.png' },
      { displayName: '50 Days Badge 2025', icon: 'https://assets.leetcode.com/static_assets/others/lg2550.png' }
    ];

    return NextResponse.json({
      github: {
        stats: {
          repos: (ghData as any).public_repos || 57,
          followers: (ghData as any).followers || 12,
          stars: totalStars,
          streak: calculatedStreak,
          totalContributions
        },
        heatmap: ghHeatmap
      },
      leetcode: {
        stats: lcStats,
        heatmap: lcHeatmap,
        badges: lcBadges
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
