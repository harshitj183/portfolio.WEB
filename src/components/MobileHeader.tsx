'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCommand } from 'react-icons/fi';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/76927137?v=4';

const ROLES = ['SDE', 'AI Engineer', 'Author', 'Open Source'];

export default function MobileHeader() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Header blur/opacity intensifies on scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0.72, 0.94]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.06, 0.14]);

  // Cycle roles every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setRoleIdx(i => (i + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Track scroll for subtle shadow
  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 10));
    return () => unsub();
  }, [scrollY]);

  return (
    <motion.header
      className={`mobile-header${scrolled ? ' mobile-header--scrolled' : ''}`}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30, delay: 0.08 }}
      style={{ '--mh-bg-opacity': bgOpacity, '--mh-border-opacity': borderOpacity } as React.CSSProperties}
    >
      {/* ── Shimmer sweep (matches MobileNavbar shimmer) ── */}
      <div className="mh-shimmer" aria-hidden>
        <div className="mh-shimmer-line" />
      </div>

      {/* ── Brand / Logo ── */}
      <Link href="/" className="mh-brand" aria-label="Go to homepage">

        {/* Avatar with glow ring */}
        <motion.div
          className="mh-avatar-wrap"
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          {/* Accent glow ring */}
          <motion.div
            className="mh-avatar-glow"
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Image
            src={GITHUB_AVATAR}
            alt="Harshit Jaiswal"
            width={36}
            height={36}
            priority
            quality={80}
            sizes="36px"
            className="mh-avatar-img"
          />
          {/* Live green dot */}
          <motion.span
            className="mh-live-dot"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        </motion.div>

        {/* Name + cycling role */}
        <div className="mh-text">
          <motion.span
            className="mh-name"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Harshit Jaiswal
          </motion.span>

          <div className="mh-meta">
            {/* Username */}
            <motion.span
              className="mh-username"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              @harshitj183
            </motion.span>

            <span className="mh-meta-sep">·</span>

            {/* Animated role cycling */}
            <div className="mh-role-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIdx}
                  className="mh-role"
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {ROLES[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Right side: Available pill ── */}
      <motion.div
        className="mh-badge"
        initial={{ opacity: 0, scale: 0.8, x: 12 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.25 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          className="mh-badge-dot"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="mh-badge-text">Open to Work</span>
      </motion.div>
    </motion.header>
  );
}
