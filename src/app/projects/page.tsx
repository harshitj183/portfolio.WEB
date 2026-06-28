'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FiExternalLink, FiCpu, FiLayout, FiSearch,
  FiActivity, FiX, FiLayers, FiTerminal, FiCheckCircle,
  FiGithub, FiFilter, FiMessageSquare
} from 'react-icons/fi';

const PROJECTS = [
  {
    id: 1,
    title: 'Unified College Interaction System',
    desc: 'Developed as part of a Project-Based Learning (PBL) program via Projexa AI, focusing on real-world system design for 1,000+ students and faculty. Integrated secure user authentication and real-time data fetching using RESTful APIs, reducing manual administrative queries by 40%.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    tags: ['fullstack', 'backend'],
    icon: <FiLayout />,
    github: 'https://github.com/harshitj183/unified-college-interaction-system-web',
    live: null,
    featured: true,
    image: '/projects/ucis_01_home.png',
    challenges: "Synchronizing high-concurrency data across student and faculty tiers while maintaining <500ms latency.",
    solution: "Implemented a distributed MongoDB architecture with optimized indexing and Node.js-powered high-performance middleware.",
    metrics: ["Real-world system for 1,000+ users", "40% reduction in manual admin queries", "99.9% uptime with <500ms latency"],
    gallery: ['/projects/ucis_01_home.png', '/projects/ucis_02_login.png', '/projects/ucis_03_clubs.png']
  },
  {
    id: 2,
    title: 'AI Skills - Global Context Library',
    desc: 'Developed an open-source CLI module to provide optimized context for LLM agents, utilizing automated CI/CD pipelines via GitHub Actions to maintain consistent releases. Showcased the utility to the developer community, facilitating streamlined IDE configurations for AI-assisted coding and significantly reducing token consumption in LLM prompts.',
    tech: ['Node.js', 'CLI', 'GitHub Actions'],
    tags: ['ai', 'tools'],
    icon: <FiLayers />,
    github: 'https://github.com/harshitj183/ai-skills',
    live: null,
    featured: true,
    image: '/projects/ai_skills_hero.png',
    challenges: "Creating highly portable and context-optimized skill sets that fit within LLM token constraints.",
    solution: "Structured skills in a modular JSON/Markdown manifest system with active validation and compression.",
    metrics: ["Open-source CLI module", "Automated CI/CD release pipeline", "Reduced token consumption in LLM prompts"],
    gallery: ['/projects/ai_skills_hero.png', '/projects/ai_skills_architecture.png']
  },
  {
    id: 3,
    title: 'Real-time Chat Application',
    desc: 'Engineered an instantaneous, high-concurrency messaging application using React frontend and Node.js back-end integration with WebSockets via Socket.io. Enabled real-time private messaging, automated user online/offline indicators, and secure session management with token-based JWT authentication.',
    tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    tags: ['fullstack', 'backend'],
    icon: <FiMessageSquare />,
    github: 'https://github.com/harshitj183/realtime-chat-app',
    live: null,
    featured: true,
    image: '/projects/chat_realtime.png',
    challenges: "Maintaining persistent connection state and scaling WebSockets to handle high-concurrency connections without memory leaks.",
    solution: "Implemented a heartbeat check system, used Redis adapter for scaling WebSocket instances, and structured database indexing for rapid query delivery.",
    metrics: ["JWT token session safety", "Under 10ms message delivery", "High-concurrency socket channels"],
    gallery: ['/projects/chat_realtime.png', '/projects/chat_login.png', '/projects/chat_signup.png']
  },
  {
    id: 4,
    title: 'Multi-Search Extension',
    desc: 'Conceptualized a productivity-improving browser extension enabling users to perform simultaneous queries across 5+ search engines. Boosted search efficiency by aggregating results in a single click, achieving a 4.5+ average rating and increasing user productivity by 20%.',
    tech: ['JavaScript', 'Browser API', 'HTML/CSS'],
    tags: ['extension', 'tools'],
    icon: <FiSearch />,
    github: 'https://github.com/harshitj183/MultiSearch.Extension',
    live: null,
    featured: false,
    image: '/projects/multisearch_widget_ui.png',
    challenges: "Synchronizing multi-tab injections and rendering responses side-by-side without hitting search engine rate limits.",
    solution: "Designed an asynchronous request interceptor and custom iframe layout manager.",
    metrics: ["4.5+ average rating on Store", "5+ search engines simultaneously", "20% user productivity increase"],
    gallery: ['/projects/multisearch_widget_ui.png', '/projects/multisearch_widget_custom.png', '/projects/multisearch_demo.gif']
  }
];

const TAGS: string[] = ['all', 'fullstack', 'frontend', 'backend', 'ai', 'extension', 'tools'];

interface Project {
  id: number;
  title: string;
  desc: string;
  tech: string[];
  tags: string[];
  icon: React.ReactNode;
  github?: string;
  live?: string | null;
  featured: boolean;
  image?: string;
  challenges: string;
  solution: string;
  metrics: string[];
  gallery?: string[];
}

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
}

const ProjectCard = ({ project, onOpen }: ProjectCardProps) => (
  <div
    onClick={() => onOpen(project)}
    className="glass-panel"
    style={{ display: 'flex', flexDirection: 'column', padding: '1.8rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
  >
    {project.featured && (
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem',
        background: 'var(--accent)', border: '1px solid var(--accent)',
        borderRadius: '4px', padding: '0.3rem 0.8rem', fontSize: '0.65rem',
        color: '#fff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        zIndex: 2
      }}>
        Featured
      </div>
    )}

    {project.image && (
      <div style={{ 
        width: '100%', 
        height: '160px', 
        borderRadius: '10px', 
        overflow: 'hidden', 
        marginBottom: '1.5rem', 
        border: '1px solid var(--glass-border)',
        position: 'relative'
      }}>
        <Image 
          src={project.image} 
          alt={project.title} 
          width={600} height={400}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    )}

    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem' }}>
      <div style={{
        background: 'rgba(99,102,241,0.1)', padding: '0.7rem',
        borderRadius: '10px', color: 'var(--accent)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {project.icon}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {project.tech.slice(0, 3).map(t => (
          <span key={t} className="pill" style={{ fontSize: '0.62rem', padding: '0.2rem 0.6rem' }}>{t}</span>
        ))}
      </div>
    </div>

    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem', lineHeight: 1.25, flex: 0 }}>{project.title}</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.8rem', flex: 1 }}>{project.desc}</p>

    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em' }}>
        VIEW CASE STUDY →
      </span>
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            aria-label="GitHub Repository"
            style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1 }}
            title="Source Code"
          >
            <FiGithub />
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            aria-label="Live Demo"
            style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1 }}
            title="Live Demo"
          >
            <FiExternalLink />
          </a>
        )}
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string>('all');

  useEffect(() => {
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { action, technology, project_name } = customEvent.detail || {};
      if (action === 'filter_projects' && technology) {
        setActiveTag(technology.toLowerCase());
      }
      if (action === 'highlight_project' && project_name) {
        const found = PROJECTS.find(p => p.title.toLowerCase().includes(project_name.toLowerCase()));
        if (found) setSelected(found);
      }
    };
    window.addEventListener('portfolio-action', handleAction);
    return () => window.removeEventListener('portfolio-action', handleAction);
  }, []);

  const filtered = activeTag === 'all' ? PROJECTS : PROJECTS.filter(p => p.tags.includes(activeTag));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '2rem 0' }}
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem', letterSpacing: '-0.04em' }}
      >
        Engineering Dossiers
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{ color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.7 }}
      >
        Technical breakdowns of high-performance solutions across web architecture, AI, and developer tooling.
      </motion.p>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '4rem', alignItems: 'center' }}
      >
        <FiFilter style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`pill${activeTag === tag ? ' accent' : ''}`}
            style={{
              fontSize: '0.75rem', padding: '0.5rem 1.2rem', cursor: 'pointer',
              fontWeight: activeTag === tag ? 700 : 400, border: 'none', textTransform: 'capitalize'
            }}
          >
            {tag}
          </button>
        ))}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        </span>
      </motion.div>

      {/* Grid */}
      <div id="projects-grid" className="grid">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={setSelected} index={0} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              zIndex: 10000, backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="glass-panel case-study-modal"
              style={{ maxWidth: '860px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
            >
              <button
                onClick={() => setSelected(null)}
                className="modal-close-btn"
                aria-label="Close Modal"
              >
                <FiX size={28} />
              </button>

              {/* Header */}
              <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--accent)', color: '#fff', padding: '1.2rem', borderRadius: '20px', fontSize: '1.8rem', flexShrink: 0 }}>
                  {selected.icon}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '1rem', lineHeight: 1.2 }}>{selected.title}</h2>
                  <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                    {selected.tech.map(t => <span key={t} className="pill accent" style={{ fontSize: '0.7rem' }}>{t}</span>)}
                  </div>
                </div>
              </div>

              {/* Showcase Image */}
              {selected.gallery && selected.gallery.length > 0 ? (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  overflowX: 'auto',
                  marginBottom: '2.5rem',
                  paddingBottom: '1rem',
                  scrollSnapType: 'x mandatory'
                }}>
                  {selected.gallery.map((img, i) => (
                    <div key={i} className="gallery-image-container">
                      <Image src={img} alt={`${selected.title} screenshot ${i + 1}`} width={800} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              ) : selected.image && (
                <div className="single-image-container">
                  <Image src={selected.image} alt={selected.title} width={800} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '3rem', fontSize: '1.05rem' }}>
                {selected.desc}
              </p>

              <div className="grid" style={{ gap: '2.5rem', marginBottom: '3.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <FiTerminal className="text-accent" /> Engineering Log
                  </h3>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                      <span style={{ color: '#f87171', fontWeight: 700 }}>[CHALLENGE] </span>{selected.challenges}
                      <br /><br />
                      <span style={{ color: '#34d399', fontWeight: 700 }}>[SOLUTION] </span>{selected.solution}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <FiActivity className="text-accent" /> System Metrics
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selected.metrics.map(m => (
                      <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        <FiCheckCircle className="text-accent" /> {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                <a href={selected.github} target="_blank" rel="noreferrer" aria-label="GitHub Repository" className="pill accent" style={{ padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.7rem' }}>
                  <FiGithub /> Source Code
                </a>
                {selected.live && (
                  <a href={selected.live} aria-label="Live Demo" className="pill" style={{ padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                    <FiExternalLink /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
