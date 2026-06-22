'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiMapPin, FiArrowRight, FiStar, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/76927137?v=4';

const TECH_STACK = [
  'React', 'TypeScript', 'Bun', 'Node.js', 'MongoDB', 'Next.js',
  'Framer Motion', 'Docker', 'C++', 'PostgreSQL', 'GitHub Actions', 'Vite'
];

const FEATURED = [
  {
    label: 'Flagship Project',
    title: 'Unified College Interaction System',
    desc: 'Central architecture supporting 1,000+ students & faculty. Real-time data sync, secure auth, 40% reduction in manual admin queries.',
    tech: ['React', 'Node.js', 'MongoDB'],
    image: '/projects/ucis_01_home.png',
    github: 'https://github.com/harshitj183/unified-college-interaction-system-web',
    color: '#6366f1',
  },
  {
    label: 'AI Tooling',
    title: 'AI Skills — Global Context Library',
    desc: 'Open-source CLI module for LLM agents with automated CI/CD pipelines. Significantly reduces token consumption in AI-assisted coding.',
    tech: ['Node.js', 'CLI', 'GitHub Actions'],
    image: '/projects/ai_skills_hero.png',
    github: 'https://github.com/harshitj183/ai-skills',
    color: '#10b981',
  },
  {
    label: 'Full Stack',
    title: 'Real-time Chat Application',
    desc: 'High-concurrency messaging with WebSockets, JWT auth, online/offline indicators and under 10ms message delivery.',
    tech: ['React', 'Socket.io', 'MongoDB'],
    image: '/projects/chat_realtime.png',
    github: 'https://github.com/harshitj183/realtime-chat-app',
    color: '#f59e0b',
  },
];

const Home = () => {
  const [lcSolved, setLcSolved] = useState<string>('350+');
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    fetch('https://alfa-leetcode-api.onrender.com/userProfile/harshitj183')
      .then(r => r.json())
      .then(d => {
        const allStats = d.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === 'All');
        if (allStats) {
          setLcSolved(String(allStats.count));
        }
      })
      .catch(() => {
        fetch('https://leetcode-stats-api.herokuapp.com/harshitj183')
          .then(r => r.json())
          .then(d => { if (d.status === 'success') setLcSolved(String(d.totalSolved)); })
          .catch(() => {});
      });
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setSlide(s => (s + 1) % FEATURED.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number) => {
    setDir(i > slide ? 1 : -1);
    setSlide(i);
  };

  const proj = FEATURED[slide];
  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Available Badge */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          Available for full-time & freelance roles
        </span>
      </div>

      {/* Hero Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '900px' }}>
          Harshit Jaiswal
          <br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.55em' }}>
            SDE | AI Agent Engineer | Freelancer | Author
          </span>
        </h1>
      </div>

      {/* Hero content row */}
      <div className="hero-content-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            <FiMapPin size={16} />
            Gurugram, Delhi NCR
          </div>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            <strong style={{ color: '#fff', fontWeight: 600 }}>Project Manager</strong> specializing in Full Stack Web Development (MERN Stack).
            Delivered <strong style={{ color: '#fff', fontWeight: 600 }}>24+ production systems</strong> and solved <strong style={{ color: '#fff', fontWeight: 600 }}>{lcSolved} LeetCode problems</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              className="pill accent"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
            >
              Get in touch <FiArrowRight size={16} />
            </Link>
            <a
              href="/resume.pdf"
              download="Harshit_Jaiswal_Resume.pdf"
              className="pill"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.9rem', background: '#1e1e24', color: '#fff', textDecoration: 'none' }}
              title="Download CV"
            >
              Download CV
            </a>
            <a
              href="https://github.com/harshitj183"
              target="_blank"
              rel="noreferrer"
              className="pill"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
            >
              <FiGithub size={18} /> GitHub
            </a>
          </div>
        </div>

        {/* Avatar card */}
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '300px', width: '100%', borderRadius: '12px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            {/* Thought/Dream Bubble */}
            <div style={{
              position: 'absolute',
              top: '-32px',
              right: '-32px',
              background: 'var(--accent)',
              color: '#fff',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
              boxShadow: '0 0 15px var(--accent-glow)',
              whiteSpace: 'nowrap',
              zIndex: 3
            }}>
              harshitj183
              {/* Little floating bubble trail */}
              <span style={{
                position: 'absolute',
                bottom: '-6px',
                right: '28px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent-glow)'
              }} />
              <span style={{
                position: 'absolute',
                bottom: '-14px',
                right: '22px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent-glow)'
              }} />
            </div>
            <img
              src={GITHUB_AVATAR}
              alt="Harshit Jaiswal"
              style={{
                width: '120px', height: '120px', borderRadius: '12px',
                objectFit: 'cover', border: '1px solid var(--border-color)',
                display: 'block'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {[
              { val: '24+', label: 'Projects' },
              { val: lcSolved, label: 'LeetCode' },
              { val: '4+ Yrs', label: 'Experience' },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Available for hire
          </div>
        </div>
      </div>

      {/* Tech Stack Ticker (Now a clean static list) */}
      <div style={{ marginBottom: '5rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 600 }}>
          Tech Stack
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {TECH_STACK.map((tech) => (
            <span key={tech} className="pill" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Project Showcase */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <FiStar className="text-accent" /> Featured Work
      </h2>

      <div className="glass-panel featured-showcase-panel" style={{ marginBottom: '5rem', borderRadius: '12px', overflow: 'hidden', position: 'relative', minHeight: '280px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide}
            custom={dir}
            initial={{ x: dir * 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="featured-project-grid"
          >
            <div>
              <span className="pill accent" style={{ marginBottom: '1.5rem', display: 'inline-block', fontSize: '0.75rem', background: proj.color, border: 'none' }}>
                {proj.label}
              </span>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', lineHeight: '1.2' }}>{proj.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem' }}>{proj.desc}</p>
              <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {proj.tech.map(t => <span key={t} className="pill" style={{ fontSize: '0.75rem' }}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/projects" className="nav-item active" style={{ display: 'inline-flex', width: 'auto', gap: '0.6rem', fontSize: '0.85rem' }}>
                  Case Study <FiArrowRight />
                </Link>
                <a href={proj.github} target="_blank" rel="noreferrer" className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', padding: '0.6rem 1.2rem' }}>
                  <FiGithub /> GitHub
                </a>
              </div>
            </div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '2rem' }}>
          {FEATURED.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === slide ? '24px' : '8px', height: '8px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: i === slide ? proj.color : 'var(--border-color)',
              transition: 'all 0.3s ease', padding: 0,
            }} />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          key={`bar-${slide}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '2px', width: '100%',
            background: proj.color,
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Browse All CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link
          href="/projects"
          className="nav-item"
          style={{ display: 'inline-flex', padding: '1rem 2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', gap: '0.8rem' }}
        >
          Browse All Projects <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Home;
