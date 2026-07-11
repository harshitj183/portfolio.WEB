'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCommand, FiUser, FiActivity, FiLayout, FiMessageSquare, FiExternalLink } from 'react-icons/fi';

interface Command {
  id: string;
  name: string;
  icon: React.ReactNode;
  section: string;
  shortcut?: string;
  path: string;
  external?: boolean;
}

const COMMANDS: Command[] = [
  { id: 'home', name: 'Go to Home', icon: <FiCommand />, section: 'Navigation', shortcut: 'H', path: '/' },
  { id: 'dashboard', name: 'View Dashboard', icon: <FiActivity />, section: 'Navigation', shortcut: 'D', path: '/dashboard' },
  { id: 'projects', name: 'Engineering Dossiers', icon: <FiLayout />, section: 'Navigation', shortcut: 'P', path: '/projects' },
  { id: 'about', name: 'The Architect (About)', icon: <FiUser />, shortcut: 'A', section: 'Navigation', path: '/about' },
  { id: 'contact', name: 'Initialize Connection', icon: <FiMessageSquare />, shortcut: 'C', section: 'Navigation', path: '/contact' },
  { id: 'github', name: 'View External GitHub', icon: <FiExternalLink />, section: 'External', path: 'https://github.com/harshitj183', external: true },
  { id: 'linkedin', name: 'Connect on LinkedIn', icon: <FiExternalLink />, section: 'External', path: 'https://linkedin.com/in/harshitj183', external: true },
];

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleToggle);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase()) || 
    cmd.section.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: Command) => {
    if (cmd.external) {
      window.open(cmd.path, '_blank');
    } else {
      router.push(cmd.path);
    }
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      if (filteredCommands[activeIndex]) handleSelect(filteredCommands[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              zIndex: 20000
            }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed', top: '20%', left: '50%', x: '-50%',
              width: '100%', maxWidth: '600px', zIndex: 20001, padding: '0 2rem'
            }}
          >
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1.2rem', borderBottom: '1px solid var(--border-color)' }}>
                <FiSearch style={{ color: 'var(--text-secondary)', marginRight: '1rem' }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type a command or search..."
                  style={{
                    flex: 1, background: 'none', border: 'none', color: '#fff',
                    fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-primary)'
                  }}
                />
                <div className="pill" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>ESC</div>
              </div>

              {/* Commands List */}
              {filteredCommands.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '0.5rem' }}>
                  {filteredCommands.map((cmd, idx) => (
                    <div
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.8rem 1rem', borderRadius: '6px', cursor: 'pointer',
                        background: activeIndex === idx ? 'var(--accent)' : 'transparent',
                        color: activeIndex === idx ? '#fff' : 'var(--text-primary)',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>{cmd.icon}</span>
                        <span style={{ fontSize: '0.95rem' }}>{cmd.name}</span>
                      </div>
                      {cmd.shortcut && (
                        <span
                          style={{
                            fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                            background: activeIndex === idx ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                            color: activeIndex === idx ? '#fff' : 'var(--text-secondary)',
                            fontWeight: 600
                          }}
                        >
                          {cmd.shortcut}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
