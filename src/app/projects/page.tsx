'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiExternalLink, FiCpu, FiLayout, FiSearch,
  FiActivity, FiX, FiLayers, FiTerminal, FiCheckCircle,
  FiGithub, FiFilter, FiMessageSquare
} from 'react-icons/fi';
import Image from 'next/image';
import ReadmeViewer from '@/components/ReadmeViewer';
import TiltCard from '@/components/TiltCard';

const PROJECTS = [
  {
    id: 1,
    title: 'Unified College Interaction System',
    desc: 'Developed as part of a Project-Based Learning (PBL) program via Projexa AI, focusing on real-world system design for 1,000+ students and faculty. Integrated secure user authentication and real-time data fetching using RESTful APIs, reducing manual administrative queries by 40%.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    tags: ['fullstack', 'backend'],
    icon: <FiLayout />,
    github: 'https://github.com/harshitj183/unified-college-interaction-system-web',
    live: 'https://unified-college-interaction-system.vercel.app/',
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
    live: 'https://www.npmjs.com/package/@harshitj183/ai-skills',
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
    live: 'https://microsoftedge.microsoft.com/addons/detail/cmimnpbpmcjioggbiodfcocnbgeidfjk',
    featured: false,
    image: '/projects/multisearch_widget_ui.png',
    challenges: "Synchronizing multi-tab injections and rendering responses side-by-side without hitting search engine rate limits.",
    solution: "Designed an asynchronous request interceptor and custom iframe layout manager.",
    metrics: ["4.5+ average rating on Store", "5+ search engines simultaneously", "20% user productivity increase"],
    gallery: ['/projects/multisearch_widget_ui.png', '/projects/multisearch_widget_custom.png', '/projects/multisearch_demo.gif']
  },
  {
    id: 5,
    title: 'Video Speed Controller',
    desc: 'Developed a custom browser extension and web utility that allows precise, granular control over HTML5 video playback speeds, bypassing standard platform limitations. Enhanced user media consumption efficiency by 35%.',
    tech: ['JavaScript', 'DOM API', 'HTML5'],
    tags: ['tools', 'extension', 'frontend'],
    icon: <FiActivity />,
    github: 'https://github.com/harshitj183/video-speed-controller',
    live: null,
    featured: false,
    image: '',
    challenges: "Injecting playback rate overrides securely into third-party iframes without triggering CORS or security blocks.",
    solution: "Used a content script injection strategy with isolated world execution to manipulate the HTML5 Video element properties directly.",
    metrics: ["Works on 95%+ of video players", "Precise 0.1x step increments", "Keyboard shortcut integration"],
    gallery: []
  },
  {
    id: 6,
    title: 'Real-time Image Detection',
    desc: 'Built a highly optimized computer vision application leveraging TensorFlow.js in the browser for real-time object detection via webcam. Can identify up to 80 different object classes with sub-200ms latency without relying on server-side processing.',
    tech: ['React', 'TensorFlow.js', 'WebRTC'],
    tags: ['ai', 'frontend'],
    icon: <FiCpu />,
    github: 'https://github.com/harshitj183/image-detection-ai',
    live: null,
    featured: true,
    image: '',
    challenges: "Achieving high frame rate processing on client-side hardware without crashing the browser or causing extreme CPU spikes.",
    solution: "Implemented WebGL backend for TensorFlow.js to offload matrix multiplications to the GPU, and used requestAnimationFrame for non-blocking render loops.",
    metrics: ["Sub-200ms inference time", "80+ detectable classes", "100% client-side processing for privacy"],
    gallery: []
  }
];

const TAGS: string[] = ['all', ...Object.entries(
  PROJECTS.reduce((acc, p) => {
    p.tags.forEach(t => acc[t] = (acc[t] || 0) + 1);
    return acc;
  }, {} as Record<string, number>)
).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0])];

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
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}

const ProjectCard = ({ project, onOpen, isActive, cardRef }: ProjectCardProps) => (
  <TiltCard
    ref={cardRef}
    data-project-id={project.id}
    data-project-title={project.title}
    onClick={() => onOpen(project)}
    className={`glass-panel ${isActive ? 'project-highlight' : ''}`}
    style={{ display: 'flex', flexDirection: 'column', padding: '1.8rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    tiltAngle={10}
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
          fill
          style={{ objectFit: 'cover' }} 
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
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ 
              color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s', fontWeight: 500
            }}
            title="Source Code"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <FiGithub size={14} /> Code
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ 
              color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(99,102,241,0.15)', padding: '0.4rem 0.8rem', borderRadius: '100px',
              border: '1px solid rgba(99,102,241,0.3)', transition: 'all 0.2s', fontWeight: 500
            }}
            title="Live Demo"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
          >
            <FiExternalLink size={14} /> Live
          </a>
        )}
      </div>
    </div>
  </TiltCard>
);

const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [visibleProjectId, setVisibleProjectId] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selected?.gallery && selected.gallery.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % selected.gallery!.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selected]);

  useEffect(() => {
    if (selected) setCurrentImageIndex(0);
  }, [selected]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pid = Number(entry.target.getAttribute('data-project-id'));
            const ptitle = entry.target.getAttribute('data-project-title');
            
            // Only update and dispatch if the visible project actually changes
            setVisibleProjectId((prev) => {
              if (prev !== pid) {
                window.dispatchEvent(
                  new CustomEvent('project-view', { detail: { id: pid, title: ptitle } })
                );
                return pid;
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.6 }
    );

    projectRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [activeTag]);

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

      {/* Premium Animated Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ 
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '4rem', 
          alignItems: 'center', background: 'rgba(255,255,255,0.03)', 
          padding: '0.6rem 1rem', borderRadius: '100px', width: 'fit-content', 
          border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <FiFilter size={16} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem', marginLeft: '0.5rem' }} />
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            style={{
              position: 'relative',
              fontSize: '0.85rem', padding: '0.5rem 1.2rem', cursor: 'pointer',
              fontWeight: activeTag === tag ? 600 : 400, border: 'none', background: 'transparent',
              color: activeTag === tag ? '#fff' : 'var(--text-secondary)',
              textTransform: 'capitalize', zIndex: 1, transition: 'color 0.2s',
              outline: 'none'
            }}
          >
            {activeTag === tag && (
              <motion.div
                layoutId="active-filter"
                style={{ position: 'absolute', inset: 0, background: 'var(--accent)', borderRadius: '100px', zIndex: -1, boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tag}
          </button>
        ))}
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 0.8rem' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '0.8rem', fontWeight: 500 }}>
          <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 12px #34d399' }} />
          {filtered.length} found
        </span>
      </motion.div>

      {/* Grid */}
      <div id="projects-grid" className="grid">
        {filtered.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onOpen={setSelected} 
            index={index} 
            isActive={visibleProjectId === project.id}
            cardRef={(el) => { projectRefs.current[index] = el; }}
          />
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
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 100000, backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              className="project-drawer"
            >
              <div className="drawer-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, flex: 1, minWidth: '200px' }}>{selected.title}</h2>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  {selected.github && (
                    <a href={selected.github} target="_blank" rel="noreferrer" className="premium-action-btn premium-action-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      <FiGithub size={16} /> Source Code
                    </a>
                  )}
                  {selected.live && (
                    <a href={selected.live} target="_blank" rel="noreferrer" className="premium-action-btn premium-action-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      <FiExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '0.2rem' }}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="drawer-content">
                {/* Hero Images Animated Slider */}
                {selected.gallery && selected.gallery.length > 0 ? (
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px', marginTop: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'absolute', inset: 0, cursor: 'zoom-in' }}
                        onClick={() => setLightboxImage(selected.gallery![currentImageIndex])}
                      >
                        <Image src={selected.gallery[currentImageIndex]} alt={`${selected.title} screenshot ${currentImageIndex + 1}`} fill style={{ objectFit: 'cover' }} />
                      </motion.div>
                    </AnimatePresence>
                    {selected.gallery.length > 1 && (
                      <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
                        {selected.gallery.map((_, i) => (
                          <div 
                            key={i} 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }} 
                            style={{ 
                              width: i === currentImageIndex ? '20px' : '8px', 
                              height: '8px', 
                              borderRadius: '4px', 
                              background: i === currentImageIndex ? 'var(--accent)' : 'rgba(255,255,255,0.5)', 
                              cursor: 'pointer', 
                              transition: 'all 0.3s ease' 
                            }} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : selected.image && (
                  <div className="single-image-container" style={{ width: '100%', height: 'auto', aspectRatio: '16/9', marginTop: '1.5rem', marginBottom: '2rem', position: 'relative' }}>
                    <Image src={selected.image} alt={selected.title} fill style={{ objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                )}


                <div style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Technologies</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selected.tech.map(t => <span key={t} className="pill accent" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>{t}</span>)}
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.1rem' }}>
                  {selected.desc}
                </p>
                
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiTerminal className="text-accent" /> Engineering Log
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>[CHALLENGE] </span>{selected.challenges}
                    <br /><br />
                    <span style={{ color: '#34d399', fontWeight: 700 }}>[SOLUTION] </span>{selected.solution}
                  </p>
                </div>

                {selected.github && (
                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiActivity className="text-accent" /> Architecture Deep Dive
                    </h3>
                    <ReadmeViewer githubUrl={selected.github} onImageClick={setLightboxImage} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
              zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.1)',
                border: 'none', color: '#fff', borderRadius: '50%', width: '48px', height: '48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2
              }}
            >
              <FiX size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', width: '90vw', height: '80vh', maxWidth: '1200px' }}
            >
              <Image src={lightboxImage} alt="Fullscreen screenshot" fill style={{ objectFit: 'contain' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
