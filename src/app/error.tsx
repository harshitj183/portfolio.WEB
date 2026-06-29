'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.05)'
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'inline-block', color: '#ef4444', marginBottom: '1.5rem' }}
        >
          <FiAlertTriangle size={64} />
        </motion.div>
        
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>Runtime Exception</h2>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          A local component failure occurred. The main interface remains intact, but this specific module crashed.
        </p>

        <button
          onClick={() => reset()}
          className="premium-action-btn premium-action-primary"
          style={{
            background: 'transparent',
            border: '1px solid #ef4444',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1rem 2rem',
            boxShadow: '0 0 15px rgba(239,68,68,0.1)'
          }}
        >
          <FiRefreshCw /> Restart Module
        </button>
      </motion.div>
    </div>
  );
}
