'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ marginBottom: '3rem' }}
      >
        <h1 style={{
          fontSize: '12rem',
          fontWeight: 800,
          lineHeight: 1,
          color: '#fff'
        }}>
          404
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <FiAlertTriangle className="text-accent" /> Lost in the Architecture
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3.5rem', maxWidth: '500px' }}>
          The requested coordinate does not exist within this system.
          Standard protocol suggests returning to the command center.
        </p>

        <Link href="/" className="pill accent" style={{
          padding: '1.2rem 2.5rem',
          fontSize: '1.1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          textDecoration: 'none'
        }}>
          <FiHome size={22} /> Return to Command Center
        </Link>
      </motion.div>
    </motion.div>
  );
};


export default NotFound;
