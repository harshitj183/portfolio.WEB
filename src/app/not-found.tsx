'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiHome, FiTerminal, FiAlertOctagon } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid & Scanlines */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.5
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ zIndex: 1, textAlign: 'center', position: 'relative' }}
      >
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          {/* Glitch Layers */}
          {mounted && (
            <>
              <motion.h1
                animate={{ x: [-2, 2, -1, 2, -2], y: [1, -1, -2, 1, 1], opacity: [0.8, 1, 0.8, 1, 0.9] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
                style={{ fontSize: 'min(15vw, 12rem)', fontWeight: 900, lineHeight: 1, color: '#ff003c', position: 'absolute', top: 0, left: '-4px', mixBlendMode: 'screen', zIndex: -1 }}
              >
                404
              </motion.h1>
              <motion.h1
                animate={{ x: [2, -2, 1, -2, 2], y: [-1, 1, 2, -1, -1], opacity: [0.8, 1, 0.9, 1, 0.8] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse', delay: 0.1 }}
                style={{ fontSize: 'min(15vw, 12rem)', fontWeight: 900, lineHeight: 1, color: '#00f0ff', position: 'absolute', top: 0, left: '4px', mixBlendMode: 'screen', zIndex: -1 }}
              >
                404
              </motion.h1>
            </>
          )}
          <h1 style={{
            fontSize: 'min(15vw, 12rem)',
            fontWeight: 900,
            lineHeight: 1,
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            position: 'relative'
          }}>
            404
          </h1>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel"
          style={{ padding: '2rem 3rem', maxWidth: '600px', margin: '0 auto', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,0,60,0.3)' }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center', color: '#ff003c', textTransform: 'uppercase', letterSpacing: '2px' }}>
            <FiAlertOctagon /> Segment Fault
          </h2>
          
          <div style={{ fontFamily: 'monospace', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '2.5rem', background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid #ff003c' }}>
            <p><span style={{ color: '#00f0ff' }}>&gt;</span> System scanning... <span style={{ color: '#10b981' }}>OK</span></p>
            <p><span style={{ color: '#00f0ff' }}>&gt;</span> Locating coordinate: {typeof window !== 'undefined' ? window.location.pathname : 'UNKNOWN_ROUTE'}</p>
            <p><span style={{ color: '#ff003c' }}>[ERROR]</span> Data fragment corrupted or missing.</p>
            <p><span style={{ color: '#00f0ff' }}>&gt;</span> Awaiting manual override...</p>
          </div>

          <Link href="/" className="premium-action-btn premium-action-primary" style={{
            padding: '1rem 2.5rem',
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            textDecoration: 'none',
            background: 'transparent',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
          }}>
            <FiTerminal /> Execute Reboot
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
