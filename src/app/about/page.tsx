'use client';

import { motion } from 'framer-motion';
import { FiTerminal, FiBriefcase, FiAward, FiBook, FiActivity, FiCode, FiHeart, FiMapPin, FiCalendar, FiLayout, FiDatabase, FiCpu, FiCompass, FiBookOpen } from 'react-icons/fi';

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: <FiCode size={18} />,
    skills: ['C++ (Intermediate)', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL']
  },
  {
    title: 'Web Development',
    icon: <FiLayout size={18} />,
    skills: ['React', 'Next.js', 'Node.js', 'Bun.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'WordPress']
  },
  {
    title: 'Backend & Databases',
    icon: <FiDatabase size={18} />,
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase Authentication', 'REST APIs']
  },
  {
    title: 'Tools & Platforms',
    icon: <FiCpu size={18} />,
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Linux (Basic)', 'Bash / Shell', 'CLI', 'Cloudflare']
  },
  {
    title: 'Currently Exploring',
    icon: <FiCompass size={18} />,
    skills: ['AI Engineering', 'DevOps Fundamentals (Docker, AWS, CI/CD)', 'System Design']
  },
  {
    title: 'Core Concepts',
    icon: <FiBookOpen size={18} />,
    skills: ['Data Structures and Algorithms (DSA)', 'Object-Oriented Programming (OOP)', 'SDLC', 'SEO', 'Prompt Engineering']
  }
];

interface TimelineItemProps {
  role: string;
  company: string;
  date: string;
  desc: string[];
  isLast: boolean;
}

const TimelineItem = ({ role, company, date, desc, isLast }: TimelineItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    style={{ position: 'relative', paddingLeft: '3rem', marginBottom: isLast ? 0 : '3.5rem' }}
  >
    {/* Dot */}
    <div style={{
      position: 'absolute', left: '-9px', top: '4px',
      width: '16px', height: '16px', borderRadius: '50%',
      background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)',
      border: '3px solid var(--bg-color)'
    }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
      <span className="pill" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <FiCalendar size={11} /> {date}
      </span>
      <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>{company}</span>
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{role}</h3>
    <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.9', fontSize: '0.95rem' }}>
      {desc.map((d, i) => <li key={i}>{d}</li>)}
    </ul>
  </motion.div>
);

const About = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
  };

  const experiences = [
    {
      role: 'Project Manager Intern',
      company: 'SenpaiHost (Remote)',
      date: 'Jun 2025 – Aug 2025',
      desc: [
        'Orchestrated web development lifecycles for 10+ concurrent projects, translating client requirements into technical execution plans, improving delivery efficiency by 20%.',
        'Directed project timelines and resources across a 5-member team, ensuring 100% on-time delivery of scalable web solutions.',
        'Conducted comprehensive code reviews and quality assurance checks, resulting in a 15% decrease in post-deployment bug reports.'
      ]
    },
    {
      role: 'WordPress Developer Intern',
      company: 'SenpaiHost (Remote)',
      date: 'Aug 2024 – Sep 2024',
      desc: [
        'Built dynamic WordPress websites, integrating custom themes and plugins for 5+ major client accounts.',
        'Upgraded website performance and caching mechanisms, reducing page load times by 40% and significantly boosting SEO rankings.',
        'Collaborated with cross-functional teams to implement responsive layouts, increasing mobile user engagement by 25%.'
      ]
    },
    {
      role: 'Freelance Web Developer',
      company: 'Self-Employed',
      date: 'Jan 2020 – Present',
      desc: [
        'Produced 24+ full-stack web projects for diverse clients, creating custom features and accelerating business processes by 25%.',
        'Spearheaded SEO strategies and DNS management across 15+ domains, boosting organic search traffic by 30% and ensuring 99.9% server uptime.'
      ]
    }
  ];

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="visible"
      style={{ padding: '2rem 0' }}
    >
      {/* Hero */}
      <motion.div variants={itemVars} style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
          <FiMapPin className="text-accent" size={16} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Delhi NCR, India · KR Mangalam University, 2023–2027</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1 }}>
          The Architect
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.85', maxWidth: '780px' }}>
          A Computer Science Engineering student with a focus on building{' '}
          <span className="text-accent" style={{ fontWeight: 600 }}>scalable industrial-grade web architectures</span>.
          I bridge technical rigor with strategic project management — turning complex problems into
          elegant, production-ready systems.
        </p>
      </motion.div>

      {/* Skills */}
      <motion.div variants={itemVars} style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FiTerminal className="text-accent" /> Arsenal Intensity
        </h2>
        <div className="grid">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.title} className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ marginBottom: '2rem', color: 'var(--accent)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {cat.icon} {cat.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {cat.skills.map((skill) => (
                  <span key={skill} className="pill" style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', background: '#1e1e24', border: '1px solid var(--border-color)', color: '#fff' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Experience Timeline */}
      <motion.div variants={itemVars} style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FiBriefcase className="text-accent" /> Field Records
        </h2>
        <div className="glass-panel" style={{ padding: '2.5rem 3rem' }}>
          <div style={{ borderLeft: '2px solid var(--glass-border)', paddingLeft: '0.5rem' }}>
            {experiences.map((exp, idx) => (
              <TimelineItem key={idx} {...exp} isLast={idx === experiences.length - 1} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Credentials + Education */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="grid"
        style={{ marginBottom: '5rem' }}
      >
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FiAward className="text-accent" /> Credentials
          </h2>
          {[
            { icon: '🏆', title: 'Project-Based Learning Recognition (PBL)', sub: 'Certified for "Unified College Interaction System" by Projexa AI (May 2026)' },
            { icon: '📄', title: 'Research Paper Publication', sub: '"Innovative Systems and Ethical Data Practices" issued in IJSREM (Oct 2024)' },
            { icon: '🛡️', title: 'Cybersecurity Analyst Job Simulation', sub: 'Tata Group (Forage, Apr 2025)' },
            { icon: '📈', title: 'AMCAT Assessment', sub: 'Ranked among the top-performing students in the AMCAT Assessment' },
          ].map(({ icon, title, sub }) => (
            <motion.div key={title} whileHover={{ x: 6 }} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', marginBottom: '2rem', padding: '1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.3rem' }}>{title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FiBook className="text-accent" /> Academic
          </h2>
          {[
            { icon: '🎓', title: 'B.Tech in Computer Science and Engineering', sub: 'KR Mangalam University, Gurugram, Delhi NCR', period: 'Aug 2023 – Jun 2027' },
            { icon: '📚', title: 'Higher Secondary Certificate (12th Grade Science)', sub: 'S Tulsi Inter College, Rajapur, Near Prayagraj, UP', period: 'Apr 2021 – Mar 2022' },
          ].map(({ icon, title, sub, period }) => (
            <motion.div key={title} whileHover={{ x: 6 }} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', marginBottom: '2rem', padding: '1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.2rem' }}>{title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.2rem' }}>{sub}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{period}</p>
              </div>
            </motion.div>
          ))}

          {/* Fun facts */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.82rem' }}>
              <FiHeart className="text-accent" size={14} /> Quick Facts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                '⚡ Runs on Bun, not Node',
                '🌙 Peak productivity: midnight',
                '♟ Chess player (blitz)',
                '🔭 Fascinated by distributed systems',
              ].map((fact) => (
                <p key={fact} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>{fact}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
