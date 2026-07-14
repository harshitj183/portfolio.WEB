import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate at most every hour
export const runtime = 'edge'; // Deploy to Edge CDN for maximum speed

async function fetchWithTimeout(url: string, options: any = {}, timeout = 3000): Promise<Response> {
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

export async function GET() {
  try {
    // Github Fetch
    const ghResPromise = fetchWithTimeout('https://api.github.com/users/harshitj183', { next: { revalidate: 3600 } }, 3000)
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}));
    
    const reposResPromise = fetchWithTimeout('https://api.github.com/users/harshitj183/repos?per_page=100', { next: { revalidate: 3600 } }, 3000)
      .then(r => r.ok ? r.json() : [])
      .catch(() => []);
    
    const ghHeatmapPromise = fetchWithTimeout('https://github-contributions-api.deno.dev/harshitj183.json', { next: { revalidate: 3600 } }, 3000)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    // LeetCode Fetch
    const lcResPromise = fetchWithTimeout('https://alfa-leetcode-api.onrender.com/userProfile/harshitj183', { next: { revalidate: 3600 } }, 3000)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .catch(() => fetchWithTimeout('https://leetcode-api-faisalshohag.vercel.app/harshitj183', { next: { revalidate: 3600 } }, 3000)
        .then(r => r.ok ? r.json() : {})
        .catch(() => ({}))
      );
    
    const lcBadgesPromise = fetchWithTimeout('https://alfa-leetcode-api.onrender.com/harshitj183/badges', { next: { revalidate: 3600 } }, 3000)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    // Wait for all to resolve in parallel for maximum performance
    const [ghData, repos, ghHeatmapData, lcData, bData] = await Promise.all([
      ghResPromise, reposResPromise, ghHeatmapPromise, lcResPromise, lcBadgesPromise
    ]);

    // Parse GitHub Heatmap
    let ghHeatmap = Array(364).fill(0);
    if (ghHeatmapData?.contributions) {
      const flat = ghHeatmapData.contributions.flat();
      const last364 = flat.slice(-364).map((d: any) => d.contributionCount);
      if (last364.length > 0) ghHeatmap = last364;
    }

    const totalStars = repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
    const lcBadges = bData?.badges || [];

    // Parse Leetcode Calendar
    const parseCalendar = (calendarObj: any) => {
      if (!calendarObj) return null;
      try {
        const calendar = typeof calendarObj === 'string' ? JSON.parse(calendarObj) : calendarObj;
        const heatmap = Array(364).fill(0);
        const now = new Date();
        now.setHours(0,0,0,0);
        const msInDay = 24 * 60 * 60 * 1000;
        for (const [timestamp, count] of Object.entries(calendar)) {
          const date = new Date(parseInt(timestamp) * 1000);
          date.setHours(0,0,0,0);
          const diffDays = Math.floor((now.getTime() - date.getTime()) / msInDay);
          if (diffDays >= 0 && diffDays < 364) {
            heatmap[363 - diffDays] += count as number;
          }
        }
        return heatmap;
      } catch(e) { return null; }
    };

    const lCSolved = lcData.totalSolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'All')?.count) || 0;
    const lcEasy = lcData.easySolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'Easy')?.count) || 0;
    const lcMedium = lcData.mediumSolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'Medium')?.count) || 0;
    const lcHard = lcData.hardSolved || (lcData.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'Hard')?.count) || 0;

    return NextResponse.json({
      github: {
        stats: {
          repos: (ghData as any).public_repos || 30,
          followers: (ghData as any).followers || 12,
          stars: totalStars,
          streak: 42
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
