'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiCommand, FiUser, FiLayout, FiActivity, FiMessageSquare, FiSearch
} from 'react-icons/fi';
import { useAvatar } from '../context/AvatarContext';

const mobileNavItems = [
  { to: '/',          name: 'Home',      icon: <FiCommand size={19} /> },
  { to: '/about',     name: 'About',     icon: <FiUser size={19} /> },
  { to: '/projects',  name: 'Projects',  icon: <FiLayout size={19} /> },
  { to: '/dashboard', name: 'Stats',     icon: <FiActivity size={19} /> },
  { to: '/contact',   name: 'Contact',   icon: <FiMessageSquare size={19} /> },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  const { logActivity } = useAvatar();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {mobileNavItems.map((item) => {
        const cur = pathname || '';
        const isActive = item.to === '/' ? cur === '/' : cur.startsWith(item.to);

        return (
          <Link
            key={item.to}
            href={item.to}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => logActivity(`User clicked ${item.name} in mobile navbar.`)}
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

      <button
        className="mobile-nav-item mobile-nav-search-btn"
        onClick={() => {
          logActivity('User opened command palette search from mobile navbar.');
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }}
        aria-label="Search"
      >
        <motion.span whileTap={{ scale: 0.85 }} className="mobile-nav-icon">
          <FiSearch size={19} />
        </motion.span>
        <span className="mobile-nav-label">Search</span>
      </button>
    </nav>
  );
}
