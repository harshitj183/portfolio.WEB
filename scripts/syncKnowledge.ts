import fs from 'fs';
import path from 'path';

async function fetchGitHubData() {
  try {
    const res = await fetch('https://api.github.com/users/harshitj183/repos?sort=updated&per_page=10');
    if (!res.ok) return null;
    const repos = await res.json();
    return repos.map((r: any) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url
    }));
  } catch (e) {
    console.error("GitHub fetch failed", e);
    return null;
  }
}


async function fetchLeetCodeData() {
  try {
    const res = await fetch('https://alfa-leetcode-api.onrender.com/userProfile/harshitj183');
    if (!res.ok) return null;
    const data = await res.json();
    const allStats = data.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'All');
    return {
      totalSolved: allStats ? allStats.count : 0,
      ranking: data.profile?.ranking || "N/A",
      reputation: data.profile?.reputation || 0,
    };
  } catch (e) {
    console.error("LeetCode fetch failed", e);
    return null;
  }
}

const staticProfile = {
  name: "Harshit Jaiswal",
  location: "Gurugram, Haryana, India (Delhi NCR)",
  role: "SDE | AI Agent Engineer",
  bio: "A Computer Science Engineering student with a focus on building scalable industrial-grade web architectures. Bridges technical rigor with strategic project management — turning complex problems into elegant, production-ready systems.",
  education: [
    {
      university: "KR Mangalam University",
      degree: "B.Tech in Computer Science Engineering",
      duration: "2023 - 2027",
      highlights: ["Project-Based Learning Recognition (PBL) Certified for 'Unified College Interaction System' by Projexa AI (May 2026)", "Ranked among top-performing students in AMCAT Assessment"]
    },
    {
      university: "S Tulsi Inter College, Rajapur, UP",
      degree: "Higher Secondary Certificate (12th Grade Science)",
      duration: "2021 - 2022"
    }
  ],
  experience: [
    {
      company: "SenpaiHost (Remote)",
      role: "Project Manager Intern",
      period: "Jun 2025 – Aug 2025",
      description: "Orchestrated web development lifecycles for 10+ concurrent projects, translating client requirements into technical execution plans, improving delivery efficiency by 20%. Directed project timelines across a 5-member team. Conducted code reviews resulting in a 15% decrease in post-deployment bugs."
    },
    {
      company: "SenpaiHost (Remote)",
      role: "WordPress Developer Intern",
      period: "Aug 2024 – Sep 2024",
      description: "Built dynamic WordPress websites, integrating custom themes. Upgraded website performance and caching, reducing load times by 40%. Collaborated on responsive layouts increasing mobile user engagement by 25%."
    },
    {
      company: "Self-Employed",
      role: "Freelance Web Developer",
      period: "Jan 2020 – Present",
      description: "Produced 24+ full-stack web projects for diverse clients. Spearheaded SEO strategies and DNS management across 15+ domains, boosting organic search traffic by 30%."
    }
  ],
  skills: {
    languages: ["C++ (Intermediate)", "JavaScript (ES6+)", "TypeScript", "Python", "SQL"],
    frontend: ["React", "Next.js", "Node.js", "Bun.js", "HTML5", "CSS3", "Tailwind CSS", "WordPress"],
    backend: ["PostgreSQL", "MongoDB", "MySQL", "Firebase Authentication", "REST APIs"],
    tools: ["Git", "GitHub", "VS Code", "Postman", "Linux (Basic)", "Bash / Shell", "CLI", "Cloudflare"],
    exploring: ["AI Engineering", "DevOps Fundamentals (Docker, AWS, CI/CD)", "System Design"],
    core: ["Data Structures and Algorithms (DSA)", "Object-Oriented Programming (OOP)", "SDLC", "SEO", "Prompt Engineering"]
  },
  credentials_and_achievements: [
    "Project-Based Learning Recognition (PBL) - Projexa AI",
    "Research Paper Publication - 'Innovative Systems and Ethical Data Practices' in IJSREM (Oct 2024)",
    "Cybersecurity Analyst Job Simulation - Tata Group (Forage, Apr 2025)",
    "Top performer in AMCAT Assessment"
  ],
  quick_facts: [
    "Runs on Bun, not Node",
    "Peak productivity: midnight",
    "Chess player (blitz)",
    "Fascinated by distributed systems"
  ],
  contact: {
    email: "hello@harshitj183.in",
    linkedin: "https://linkedin.com/in/harshitj183",
    github: "https://github.com/harshitj183"
  }
};

async function syncKnowledge() {
  console.log("Starting knowledge base sync...");

  const githubData = await fetchGitHubData();
  const leetcodeData = await fetchLeetCodeData();

  const graph = {
    lastUpdated: new Date().toISOString(),
    profile: staticProfile,
    github: githubData || "Data unavailable",
    leetcode: leetcodeData || "Data unavailable"
  }; d

  const outputPath = path.join(process.cwd(), 'knowledge_base', 'harshit_graph.json');
  fs.writeFileSync(outputPath, JSON.stringify(graph, null, 2));

  console.log(`Knowledge base successfully synced to ${outputPath}`);
}

syncKnowledge();
