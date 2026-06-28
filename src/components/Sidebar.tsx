'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiCode, FiCommand, FiUser, FiLayout, FiActivity, FiMessageSquare, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/76927137?v=4';

interface NavItem {
  to: string;
  name: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  const navItems: NavItem[] = [
    { to: '/', name: 'Home', icon: <FiCommand size={20} /> },
    { to: '/dashboard', name: 'Dashboard', icon: <FiActivity size={20} /> },
    { to: '/projects', name: 'Projects', icon: <FiLayout size={20} /> },
    { to: '/about', name: 'About', icon: <FiUser size={20} /> },
    { to: '/contact', name: 'Contact', icon: <FiMessageSquare size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="profile-card">
        <img
          src={GITHUB_AVATAR}
          alt="Harshit Jaiswal"
          className="avatar"
          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
        />
        <div className="profile-info">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', color: '#fff' }}>Harshit Jaiswal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>SDE | AI Agent Engineer | Freelancer | Author</p>
          <div className="status-indicator">
            <span className="status-dot"></span>
            Active
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>

        <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {open ? <FiX size={26} color="#fff" /> : <FiMenu size={26} color="#fff" />}
        </button>
      </div>

      <nav className={`nav-links${open ? ' open' : ''}`}>
        {navItems.map((item) => {
          const currentPath = pathname || '';
          const isActive = item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to);
          return (
            <Link 
              key={item.to}
              href={item.to} 
              className={isActive ? 'nav-item active' : 'nav-item'} 
              onClick={close}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', zIndex: -1, boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)' }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="nav-icon" style={{ zIndex: 1 }}>{item.icon}</span>
              <span className="nav-text" style={{ marginLeft: '1rem', zIndex: 1 }}>{item.name}</span>
            </Link>
          );
        })}
        {/* Mobile social links inside drawer */}
        <div className="mobile-social-links">
          <a href="https://github.com/harshitj183" target="_blank" rel="noreferrer" title="GitHub" style={{ color: 'var(--text-secondary)' }}><FiGithub size={24} /></a>
          <a href="https://linkedin.com/in/harshitj183" target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: 'var(--text-secondary)' }}><FiLinkedin size={24} /></a>
          <a href="https://leetcode.com/u/harshitj183/" target="_blank" rel="noreferrer" title="LeetCode" style={{ color: 'var(--text-secondary)' }}><FiCode size={24} /></a>
          <a href="mailto:harshitj183@gmail.com" title="Email" style={{ color: 'var(--text-secondary)' }}><FiMail size={24} /></a>
        </div>
      </nav>

      <div className="desktop-social-container" style={{ marginTop: 'auto' }}>
        <div className="social-links" style={{ display: 'flex', gap: '1.2rem' }}>
          <a href="https://github.com/harshitj183" target="_blank" rel="noreferrer" title="GitHub" style={{ color: 'var(--text-secondary)' }}><FiGithub size={20} /></a>
          <a href="https://linkedin.com/in/harshitj183" target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: 'var(--text-secondary)' }}><FiLinkedin size={20} /></a>
          <a href="https://leetcode.com/u/harshitj183/" target="_blank" rel="noreferrer" title="LeetCode" style={{ color: 'var(--text-secondary)' }}><FiCode size={20} /></a>
          <a href="mailto:harshitj183@gmail.com" title="Email" style={{ color: 'var(--text-secondary)' }}><FiMail size={20} /></a>
        </div>
      </div>
    </aside>

  );
};

export default Sidebar;
