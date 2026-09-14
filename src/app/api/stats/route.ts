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

    // 4. LeetCode Stats
    const lcResPromise = fetchWithTimeout('https://leetcode-api-faisalshohag.vercel.app/harshitj183', { next: { revalidate: 3600 } }, 5000)
      .then(r => r.ok ? r.json() : {})
      .catch(() =>
        fetchWithTimeout('https://alfa-leetcode-api.onrender.com/userProfile/harshitj183', { next: { revalidate: 3600 } }, 5000)
          .then(r => r.ok ? r.json() : {})
          .catch(() => ({}))
      );

    // 5. LeetCode Badges
    const lcBadgesPromise = fetchWithTimeout('https://alfa-leetcode-api.onrender.com/harshitj183/badges', { next: { revalidate: 3600 } }, 4000)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    // Wait for all to resolve in parallel for maximum performance
    const [ghData, repos, ghContribData, lcData, bData] = await Promise.all([
      ghResPromise, reposResPromise, ghContributionsPromise, lcResPromise, lcBadgesPromise
    ]);

    // Parse GitHub Heatmap & Stats
    const ghHeatmap = ghContribData?.heatmap || Array(364).fill(0);
    const totalStars = Array.isArray(repos) ? repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0) : 0;
    const totalContributions = ghContribData?.totalContributions || 3229;
    const calculatedStreak = ghContribData?.currentStreak || (ghContribData?.longestStreak ? Math.min(ghContribData.longestStreak, 42) : 42);

    // Parse Leetcode Calendar
    const parseCalendar = (calendarObj: any) => {
      if (!calendarObj) return null;
      try {
        const calendar = typeof calendarObj === 'string' ? JSON.parse(calendarObj) : calendarObj;
        const heatmap = Array(364).fill(0);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const msInDay = 24 * 60 * 60 * 1000;
        for (const [timestamp, count] of Object.entries(calendar)) {
          const date = new Date(parseInt(timestamp) * 1000);
          date.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((now.getTime() - date.getTime()) / msInDay);
          if (diffDays >= 0 && diffDays < 364) {
            heatmap[363 - diffDays] += count as number;
          }
        }
        return heatmap;
      } catch (e) {
        return null;
      }
    };

    const lCSolved = lcData.totalSolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'All')?.count) || 400;
    const lcEasy = lcData.easySolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'Easy')?.count) || 150;
    const lcMedium = lcData.mediumSolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'Medium')?.count) || 200;
    const lcHard = lcData.hardSolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'Hard')?.count) || 50;
    const lcBadges = bData?.badges || [];

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
        stats: {
          solved: lCSolved,
          easySolved: lcEasy,
          mediumSolved: lcMedium,
          hardSolved: lcHard,
          totalEasy: (lcData as any).totalEasy || 800,
          totalMedium: (lcData as any).totalMedium || 1700,
          totalHard: (lcData as any).totalHard || 700,
          totalQ: (lcData as any).totalQuestions || 3300
        },
        heatmap: parseCalendar(lcData.submissionCalendar) || Array(364).fill(0),
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
