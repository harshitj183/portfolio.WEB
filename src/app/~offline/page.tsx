'use client';

import { motion } from 'framer-motion';
import { FiWifiOff, FiRefreshCcw } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const OfflinePage = () => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Background static noise effect */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{
          padding: '4rem 3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: '#fbbf24', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
        >
          <FiWifiOff size={80} strokeWidth={1.5} />
        </motion.div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff', letterSpacing: '1px' }}>
          Signal Lost
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          You have been disconnected from the main grid. We're currently rendering from the local cache. Please check your network connection.
        </p>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="premium-action-btn premium-action-primary"
          style={{
            background: retrying ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
            border: '1px solid #fbbf24',
            color: '#fbbf24',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1rem 2.5rem',
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.1)',
            cursor: retrying ? 'wait' : 'pointer'
          }}
        >
          <motion.div
            animate={retrying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FiRefreshCcw />
          </motion.div>
          {retrying ? 'Establishing Connection...' : 'Retry Connection'}
        </button>
      </motion.div>
    </div>
  );
};

export default OfflinePage;
