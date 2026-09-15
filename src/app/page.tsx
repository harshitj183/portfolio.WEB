'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiGithub, FiMapPin, FiArrowRight, FiStar, FiExternalLink, FiLayers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import TiltCard from '@/components/TiltCard';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/76927137?v=4';

const TECH_STACK = [
  'MCP (Model Context Protocol)', 'LangGraph', 'LangChain', 'RAG & Vector DBs',
  'OpenAI SDK / Gemini', 'AI Harness', 'Multi-Agent Systems',
  'TypeScript', 'Python', 'C++', 'React', 'Next.js',
  'Node.js', 'Bun.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Docker', 'Tailwind CSS'
];

const FEATURED = [
  {
    label: 'AI Platform',
    title: 'ConceptCraft AI',
    desc: 'Multi-agent educational platform translating complex theoretical concepts into interactive D3.js sandboxes. Features a 5-agent pipeline and adaptive quiz engine.',
    tech: ['Next.js', 'FastAPI', 'LangGraph', 'Docker'],
    image: '/projects/conceptcraft_landing.png',
    github: 'https://github.com/harshitj183/ConceptCraft-AI',
    color: '#a855f7',
  },
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
  const [lcSolved, setLcSolved] = useState<string>('400+');
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => {
        if (d?.leetcode?.stats?.solved) {
          setLcSolved(String(d.leetcode.stats.solved));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let t: NodeJS.Timeout;
    
    const startInterval = () => {
      t = setInterval(() => {
        setDir(1);
        setSlide(s => (s + 1) % FEATURED.length);
      }, 5000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(t);
      } else {
        startInterval();
      }
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const goTo = (i: number) => {
    setDir(i > slide ? 1 : -1);
    setSlide(i);
  };

  const proj = FEATURED[slide];
  return (
    <main style={{ padding: '2rem 0' }}>
      {/* Available Badge */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', 
          background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.25rem', borderRadius: '100px', 
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)', fontWeight: 500 
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 12px #10b981' }} />
          Available for full-time & freelance roles
        </span>
      </div>

      {/* Hero Section */}
      <header id="hero-section" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '900px' }}>
          Harshit Jaiswal
          <br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.55em' }}>
            SDE | AI Agent Engineer | Freelancer | Author
          </span>
        </h1>
      </header>

      {/* Hero content row */}
      <section aria-label="Introduction and Links" className="hero-content-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            <FiMapPin size={16} />
            Gurugram, Delhi NCR
          </div>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            <strong style={{ color: '#fff', fontWeight: 600 }}>Full Stack Software Developer & AI Agent Engineer</strong>.
            Delivered <strong style={{ color: '#fff', fontWeight: 600 }}>20+ freelance web applications</strong> and solved <strong style={{ color: '#fff', fontWeight: 600 }}>{lcSolved} LeetCode problems</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              className="premium-action-btn premium-action-primary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem', width: 'auto', flex: 'none' }}
              aria-label="Get in touch with Harshit Jaiswal for hiring or freelance"
            >
              Get in touch <FiArrowRight size={16} />
            </Link>
            <a
              href="/resume.pdf"
              download="Harshit_Jaiswal_Resume.pdf"
              className="premium-action-btn premium-action-secondary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem', width: 'auto', flex: 'none' }}
              title="Download Harshit Jaiswal's CV"
              aria-label="Download Harshit Jaiswal's CV PDF"
            >
              Download CV
            </a>
            <a
              href="https://github.com/harshitj183"
              target="_blank"
              rel="noreferrer"
              className="premium-action-btn premium-action-secondary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem', width: 'auto', flex: 'none' }}
              aria-label="View Harshit Jaiswal's GitHub Profile"
            >
              <FiGithub size={18} /> GitHub
            </a>
          </div>
        </div>

        {/* Avatar card Container */}
        <div style={{ perspective: '1000px', display: 'flex', justifyContent: 'center' }}>
          <motion.div 
            id="profile-card" 
            className="glass-panel" 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              padding: '2.5rem', 
              textAlign: 'center', 
              maxWidth: '300px', 
              width: '100%',
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          >
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem', transform: "translateZ(50px)" }}>
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
            <Image
              src={GITHUB_AVATAR}
              alt="Harshit Jaiswal - Full Stack Software Development Engineer and AI Architect profile picture"
              width={120}
              height={120}
              priority
              quality={75}
              sizes="120px"
              style={{
                borderRadius: '12px',
                objectFit: 'cover', border: '1px solid var(--border-color)',
                display: 'block'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {[
              { val: '20+', label: 'Projects' },
              { val: lcSolved, label: 'LeetCode' },
              { val: '3+ Yrs', label: 'Experience' },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600, transform: "translateZ(30px)" }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 12px #10b981' }} />
            Available for hire
          </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Ticker (Now a clean static list) */}
      <section id="tech-stack" aria-label="Technology Stack" style={{ marginBottom: '5rem' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 600 }}>
          Tech Stack
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {TECH_STACK.map((tech) => (
            <span key={tech} className="pill" style={{ fontSize: '0.85rem' }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Project Showcase */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <FiLayers size={14} /> Curated Showcase
          </span>
          <h2 id="featured-work" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
            <FiStar className="text-accent" /> Featured Engineering Systems
          </h2>
        </div>

        {/* Next / Prev Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => goTo((slide - 1 + FEATURED.length) % FEATURED.length)}
            aria-label="Previous Project"
            className="pill"
            style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}
          >
            <FiChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '45px', textAlign: 'center', fontFamily: 'monospace' }}>
            0{slide + 1} / 0{FEATURED.length}
          </span>
          <button
            onClick={() => goTo((slide + 1) % FEATURED.length)}
            aria-label="Next Project"
            className="pill"
            style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Interactive Project Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {FEATURED.map((item, idx) => (
          <button
            key={item.title}
            onClick={() => goTo(idx)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: idx === slide ? `1px solid ${item.color}` : '1px solid rgba(255,255,255,0.06)',
              background: idx === slide ? `${item.color}18` : 'rgba(255,255,255,0.02)',
              color: idx === slide ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: idx === slide ? `0 0 20px ${item.color}30` : 'none',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, boxShadow: idx === slide ? `0 0 8px ${item.color}` : 'none' }} />
            {item.title}
          </button>
        ))}
      </div>

      {/* Main 3D Showcase Card */}
      <section
        aria-labelledby="featured-work"
        className="glass-panel"
        style={{
          marginBottom: '5rem',
          position: 'relative',
          padding: '2.5rem',
          borderRadius: '24px',
          overflow: 'hidden',
          border: `1px solid ${proj.color}40`,
          boxShadow: `0 25px 60px -15px ${proj.color}25, 0 0 40px ${proj.color}15, inset 0 1px 0 rgba(255,255,255,0.15)`,
          transition: 'border-color 0.5s ease, box-shadow 0.5s ease'
        }}
      >
        {/* Dynamic Aurora Ambient Backlight */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${proj.color}35 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
            transition: 'all 0.6s ease'
          }}
        />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -60, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Left Content Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '100px',
                    background: `${proj.color}25`,
                    color: '#ffffff',
                    border: `1px solid ${proj.color}60`,
                    boxShadow: `0 0 15px ${proj.color}40`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px #fff' }} />
                  {proj.label}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  FEATURED // 0{slide + 1}
                </span>
              </div>

              <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', lineHeight: '1.15', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {proj.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '2rem', maxWidth: '520px' }}>
                {proj.desc}
              </p>

              {/* Tech Stack Chips */}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                {proj.tech.map(t => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#e4e4e7',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Interactive Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/projects"
                  className="premium-action-btn premium-action-primary"
                  style={{
                    padding: '0.85rem 1.8rem',
                    fontSize: '0.9rem',
                    background: `linear-gradient(135deg, ${proj.color}, #6366f1)`,
                    boxShadow: `0 4px 20px ${proj.color}50`
                  }}
                >
                  Explore Case Study <FiArrowRight size={16} />
                </Link>
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noreferrer"
                  className="premium-action-btn premium-action-secondary"
                  style={{ padding: '0.85rem 1.6rem', fontSize: '0.9rem' }}
                >
                  <FiGithub size={17} /> GitHub Repo
                </a>
              </div>
            </div>

            {/* Right 3D Perspective Device Mockup */}
            <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.03, rotateY: -6, rotateX: 4 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  background: 'rgba(10, 10, 15, 0.95)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderTop: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.9), 0 0 30px ${proj.color}30`,
                  overflow: 'hidden',
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer'
                }}
              >
                {/* 3D Window Title Bar */}
                <div
                  style={{
                    padding: '0.75rem 1.2rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace', opacity: 0.8 }}>
                    {proj.title.toLowerCase().replace(/\s+/g, '-')}.app
                  </span>
                  <span style={{ width: '10px' }} />
                </div>

                {/* Screenshot Container with Reflection and Glow */}
                <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={slide === 0}
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />

                  {/* Scanline & Glare Gradient */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Floating 3D Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '100px',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${proj.color}80`,
                      boxShadow: `0 0 15px ${proj.color}50`,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: proj.color }} />
                    Active Architecture
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Animated Progress Bar */}
        <motion.div
          key={`bar-${slide}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: '100%',
            background: `linear-gradient(90deg, ${proj.color}, #6366f1, #10b981)`,
            boxShadow: `0 0 10px ${proj.color}`,
            transformOrigin: 'left',
          }}
        />
      </section>

      {/* Browse All CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link
          href="/projects"
          className="nav-item"
          style={{ display: 'inline-flex', padding: '1rem 2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', gap: '0.8rem' }}
          aria-label="Browse All Projects by Harshit Jaiswal"
        >
          Browse All Projects <FiArrowRight />
        </Link>
      </div>
    </main>
  );
};

export default Home;
