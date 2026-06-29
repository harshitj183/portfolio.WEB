'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGithub, FiLinkedin, FiMail, FiCode, FiCommand, FiUser,
  FiLayout, FiActivity, FiMessageSquare, FiMenu, FiX, FiFileText,
  FiBook, FiCpu, FiEdit3, FiPackage, FiStar, FiGitCommit
} from 'react-icons/fi';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/76927137?v=4';

interface NavItem {
  to: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  soon?: boolean;
}

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  const mainNav: NavItem[] = [
    { to: '/',          name: 'Home',      icon: <FiCommand size={17} />,      desc: 'Overview'        },
    { to: '/dashboard', name: 'Dashboard', icon: <FiActivity size={17} />,     desc: 'Stats & Metrics' },
    { to: '/projects',  name: 'Projects',  icon: <FiLayout size={17} />,       desc: 'Work Portfolio'  },
    { to: '/about',     name: 'About',     icon: <FiUser size={17} />,         desc: 'Background'      },
    { to: '/contact',   name: 'Contact',   icon: <FiMessageSquare size={17}/>, desc: "Let's Talk"      },
  ];

  const comingSoonNav: NavItem[] = [
    { to: '/guest-book',    name: 'Guest Book',    icon: <FiBook size={17} />,      desc: 'Leave a message', soon: true },
    { to: '/under-the-hood',name: 'Under the Hood',icon: <FiCpu size={17} />,       desc: 'How this is built',soon: true },
    { to: '/blog',          name: 'Blog',          icon: <FiEdit3 size={17} />,      desc: 'Thoughts & Notes',soon: true },
    { to: '/uses',          name: 'Uses',          icon: <FiPackage size={17} />,    desc: 'My Stack & Setup', soon: true },
    { to: '/changelog',     name: 'Changelog',     icon: <FiGitCommit size={17} />,  desc: 'Site Updates',    soon: true },
    { to: '/hall-of-fame',  name: 'Hall of Fame',  icon: <FiStar size={17} />,       desc: 'Achievements',    soon: true },
  ];

  const socialLinks = [
    { href: 'https://github.com/harshitj183',      icon: <FiGithub size={16} />,   label: 'GitHub'  },
    { href: 'https://linkedin.com/in/harshitj183', icon: <FiLinkedin size={16} />, label: 'LinkedIn'},
    { href: 'https://leetcode.com/u/harshitj183/', icon: <FiCode size={16} />,     label: 'LeetCode'},
    { href: 'mailto:harshitj183@gmail.com',        icon: <FiMail size={16} />,     label: 'Email'   },
    { href: '/resume.pdf',                         icon: <FiFileText size={16}/>,  label: 'Resume'  },
  ];

  const renderNavLink = (item: NavItem, idx: number) => {
    const cur = pathname || '';
    const isActive = !item.soon && (item.to === '/' ? cur === '/' : cur.startsWith(item.to));

    const inner = (
      <div
        className={item.soon ? 'nav-item nav-item-soon' : isActive ? 'nav-item active' : 'nav-item'}
        style={{ cursor: 'pointer', opacity: item.soon ? 0.5 : 1 }}
        onClick={item.soon ? () => alert('This page is currently under construction and will be available soon!') : close}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            style={{
              position: 'absolute', inset: 0, borderRadius: '12px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderLeft: '4px solid var(--accent)',
              zIndex: -1,
            }}
            transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
          />
        )}

        <span style={{
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.2s',
        }}>
          {item.icon}
        </span>

        <div style={{ lineHeight: 1.2, flex: 1 }}>
          <div style={{ fontSize: '0.87rem', fontWeight: isActive ? 600 : 500 }}>{item.name}</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', opacity: 0.65, marginTop: '2px' }}>{item.desc}</div>
        </div>

        {item.soon && (
          <span style={{
            fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--accent)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '4px', padding: '1px 5px',
            background: 'rgba(99,102,241,0.08)',
            flexShrink: 0,
          }}>
            Soon
          </span>
        )}
      </div>
    );

    return (
      <motion.div
        key={item.to}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.045, duration: 0.25 }}
      >
        {item.soon ? inner : <Link href={item.to} style={{ textDecoration: 'none' }}>{inner}</Link>}
      </motion.div>
    );
  };

  return (
    <aside className="sidebar">
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        opacity: 0.6, zIndex: 2,
      }} />

      {/* ── Profile ── */}
      <div className="desktop-profile" style={{ marginBottom: '1.8rem', position: 'relative' }}>
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ position: 'relative', display: 'inline-block', marginBottom: '1.1rem' }}
        >
          <div style={{
            position: 'absolute', inset: '-3px', borderRadius: '12px',
            background: 'var(--accent)', opacity: 0.22, filter: 'blur(6px)',
          }} />
          <Image
            src={GITHUB_AVATAR}
            alt="Harshit Jaiswal"
            width={76} height={76} priority quality={75} sizes="76px"
            style={{ width: '76px', height: '76px', borderRadius: '10px', objectFit: 'cover', display: 'block', border: '1px solid rgba(99,102,241,0.3)', position: 'relative' }}
          />
        </motion.div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>Harshit Jaiswal</h2>
        <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.9rem' }}>SDE · AI Engineer · Author</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'block', width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.67rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Open to Work</span>
        </div>
      </div>

      <div className="desktop-profile" style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1rem' }} />

      {/* Mobile Header Title */}
      <div className="mobile-header-title">
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Harshit Jaiswal</span>
      </div>

      {/* Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><FiX    size={24} color="#fff" /></motion.div>
              : <motion.div key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><FiMenu size={24} color="#fff" /></motion.div>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className={`nav-links${open ? ' open' : ''}`} style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
        {/* Main section */}
        <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', opacity: 0.5, marginBottom: '0.6rem', paddingLeft: '0.5rem' }}>
          Main
        </div>
        {mainNav.map((item, idx) => renderNavLink(item, idx))}

        {/* Other section */}
        <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', opacity: 0.5, margin: '1.2rem 0 0.6rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Other
          <span style={{ fontSize: '0.5rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--accent)', borderRadius: '4px', padding: '0px 4px', letterSpacing: '0.05em' }}>Coming</span>
        </div>
        {comingSoonNav.map((item, idx) => renderNavLink(item, mainNav.length + idx))}

        {/* Mobile social */}
        <div className="mobile-social-links">
          {socialLinks.map(({ href, icon, label }) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" title={label} style={{ color: 'var(--text-secondary)' }}>{icon}</a>
          ))}
        </div>
      </nav>

      {/* ── Bottom ── */}
      <div className="desktop-social-container" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1.4rem' }} />
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {socialLinks.map(({ href, icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer" title={label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.02)',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; }}
            >
              {icon}
            </motion.a>
          ))}
        </div>
        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          harshitj183.in · 2026
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
