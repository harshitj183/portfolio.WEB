'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCommand, FiUser, FiLayout, FiActivity, FiMessageSquare, FiBook, FiCpu
} from 'react-icons/fi';
import { useAvatar } from '../context/AvatarContext';

const mobileNavItems = [
  { to: '/',          name: 'Home',     icon: FiCommand       },
  { to: '/about',     name: 'About',    icon: FiUser          },
  { to: '/projects',  name: 'Projects', icon: FiLayout        },
  { to: '/dashboard', name: 'Stats',    icon: FiActivity      },
  { to: '/contact',   name: 'Contact',  icon: FiMessageSquare },
  { to: '/blog',      name: 'Blog',     icon: FiBook          },
];

/* ── Individual nav pill ── */
function NavItem({
  to, name, Icon, isActive, onClick,
}: {
  to: string; name: string; Icon: React.ElementType;
  isActive: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={to}
      className={`mnb-item${isActive ? ' mnb-active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="mnb-pill"
          className="mnb-pill"
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        />
      )}
      <motion.span
        className="mnb-icon"
        whileTap={{ scale: 0.72, rotate: -8 }}
        whileHover={{ scale: 1.18 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      >
        <Icon size={19} />
      </motion.span>
      <motion.span
        className="mnb-label"
        animate={{ opacity: isActive ? 1 : 0.55, y: isActive ? 0 : 1 }}
        transition={{ duration: 0.22 }}
      >
        {name}
      </motion.span>
    </Link>
  );
}

/* ── AI / Search action button ── */
function ActionBtn({
  id, label, isActive, onClick, children,
}: {
  id: string; label: string; isActive?: boolean;
  onClick: () => void; children: React.ReactNode;
}) {
  return (
    <motion.button
      id={id}
      className={`mnb-item mnb-action${isActive ? ' mnb-active mnb-ai-active' : ''}`}
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.78, rotate: 6 }}
      whileHover={{ scale: 1.12 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
    >
      {isActive && (
        <motion.div
          layoutId="mnb-pill"
          className="mnb-pill"
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        />
      )}
      {children}
    </motion.button>
  );
}

/* ── Main Component ── */
export default function MobileNavbar() {
  const pathname = usePathname();
  const { logActivity, isAIModeOpen, toggleAIMode } = useAvatar();

  return (
    /*
     * IMPORTANT: The outer <div> is the fixed-position centering shell.
     * We keep transform:translateX(-50%) here in CSS (.mnb-root).
     *
     * The inner motion.div handles ONLY the spring-entrance animation (y + opacity)
     * so Framer's inline transform never conflicts with the centering translateX.
     */
    <nav className="mnb-root" aria-label="Mobile Navigation">
      {/* Liquid shimmer layer */}
      <div className="mnb-shimmer" aria-hidden />

      <motion.div
        className="mnb-inner"
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0,  opacity: 1, scale: 1  }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.2 }}
        style={{ display: 'contents' }}
      >
        {mobileNavItems.map((item) => {
          const cur      = pathname || '';
          const isActive = !isAIModeOpen &&
            (item.to === '/' ? cur === '/' : cur.startsWith(item.to));
          return (
            <NavItem
              key={item.to}
              to={item.to}
              name={item.name}
              Icon={item.icon}
              isActive={isActive}
              onClick={() => logActivity(`User clicked ${item.name} in mobile navbar.`)}
            />
          );
        })}

        {/* AI Agent toggle */}
        <ActionBtn
          id="mnb-ai-btn"
          label="Toggle AI Agent Mode"
          isActive={isAIModeOpen}
          onClick={() => {
            logActivity(isAIModeOpen ? 'User exited AI Mode.' : 'User entered AI Mode.');
            toggleAIMode();
          }}
        >
          <motion.span
            className="mnb-icon"
            animate={{
              color: isAIModeOpen ? '#c084fc' : 'var(--accent)',
              filter: isAIModeOpen
                ? 'drop-shadow(0 0 8px #a855f7) drop-shadow(0 0 20px #7c3aed88)'
                : 'none',
            }}
            transition={{ duration: 0.3 }}
          >
            <FiCpu size={19} />
          </motion.span>
          <motion.span
            className="mnb-label"
            animate={{
              opacity: 1,
              fontWeight: isAIModeOpen ? 700 : 600,
              color: isAIModeOpen ? '#e9d5ff' : undefined,
            }}
          >
            {isAIModeOpen ? 'Exit AI' : 'AI Agent'}
          </motion.span>
        </ActionBtn>
      </motion.div>
    </nav>
  );
}
