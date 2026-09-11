'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiCommand, FiUser, FiLayout, FiActivity, FiMessageSquare, FiSearch, FiCpu
} from 'react-icons/fi';
import { useAvatar } from '../context/AvatarContext';

const mobileNavItems = [
  { to: '/',          name: 'Home',      icon: <FiCommand size={18} /> },
  { to: '/about',     name: 'About',     icon: <FiUser size={18} /> },
  { to: '/projects',  name: 'Projects',  icon: <FiLayout size={18} /> },
  { to: '/dashboard', name: 'Stats',     icon: <FiActivity size={18} /> },
  { to: '/contact',   name: 'Contact',   icon: <FiMessageSquare size={18} /> },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  const { logActivity, isAIModeOpen, toggleAIMode } = useAvatar();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {mobileNavItems.map((item) => {
        const cur = pathname || '';
        const isActive = !isAIModeOpen && (item.to === '/' ? cur === '/' : cur.startsWith(item.to));

        return (
          <Link
            key={item.to}
            href={item.to}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              logActivity(`User clicked ${item.name} in mobile navbar.`);
            }}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active-pill"
                className="mobile-nav-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            <motion.span
              whileTap={{ scale: 0.85 }}
              className="mobile-nav-icon"
            >
              {item.icon}
            </motion.span>
            <span className="mobile-nav-label">{item.name}</span>
          </Link>
        );
      })}

      {/* AI Mode Toggle Button */}
      <button
        className={`mobile-nav-item mobile-nav-ai-btn ${isAIModeOpen ? 'active ai-active' : ''}`}
        onClick={() => {
          logActivity(isAIModeOpen ? 'User exited AI Mode.' : 'User entered AI Mode.');
          toggleAIMode();
        }}
        aria-label="Toggle AI Agent Mode"
        style={{
          background: isAIModeOpen ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(168, 85, 247, 0.35))' : 'transparent',
          borderRadius: '9999px',
        }}
      >
        {isAIModeOpen && (
          <motion.div
            layoutId="mobile-nav-active-pill"
            className="mobile-nav-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        )}
        <motion.span
          whileTap={{ scale: 0.85 }}
          className="mobile-nav-icon"
          style={{ color: isAIModeOpen ? '#a855f7' : 'var(--accent)' }}
        >
          <FiCpu size={18} />
        </motion.span>
        <span className="mobile-nav-label" style={{ fontWeight: 700, color: isAIModeOpen ? '#fff' : 'var(--text-secondary)' }}>
          {isAIModeOpen ? 'Exit AI' : 'AI Agent'}
        </span>
      </button>

      {/* Search Button */}
      <button
        className="mobile-nav-item mobile-nav-search-btn"
        onClick={() => {
          logActivity('User opened command palette search from mobile navbar.');
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }}
        aria-label="Search"
      >
        <motion.span whileTap={{ scale: 0.85 }} className="mobile-nav-icon">
          <FiSearch size={18} />
        </motion.span>
        <span className="mobile-nav-label">Search</span>
      </button>
    </nav>
  );
}
