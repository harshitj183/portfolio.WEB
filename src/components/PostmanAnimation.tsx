'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostmanAnimationProps {
  onAnimationComplete: () => void;
}

export default function PostmanAnimation({ onAnimationComplete }: PostmanAnimationProps) {
  const [phase, setPhase] = useState<'folding' | 'falling' | 'delivery'>('folding');

  useEffect(() => {
    // 1. Wait for fold animation
    const t1 = setTimeout(() => setPhase('falling'), 1500); 
    
    // 2. Letter has fallen. Trigger the MiniAvatar to pick it up and deliver it!
    const t2 = setTimeout(() => {
      setPhase('delivery');
      window.dispatchEvent(new CustomEvent('mascot-form-success'));
    }, 2500); 
    
    // 3. MiniAvatar takes ~4 seconds to run off screen. Complete this component.
    const t3 = setTimeout(() => onAnimationComplete(), 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onAnimationComplete]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* ─── Envelope / Letter ─── */}
      <AnimatePresence>
        {phase !== 'delivery' && (
          <motion.div
            initial={{ scale: 1, rotateX: 0 }}
            animate={
              phase === 'folding'
                ? { scale: 0.5, rotateX: 180, rotateZ: -10 }
                : { y: '80vh', opacity: 0, rotateZ: 45, scale: 0.3 }
            }
            transition={
              phase === 'folding' 
                ? { duration: 1.2, type: 'spring' } 
                : { duration: 1, ease: 'easeIn' }
            }
            exit={{ opacity: 0, scale: 0 }}
            style={{
              width: '240px', height: '160px',
              background: '#f8fafc',
              borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transformStyle: 'preserve-3d',
              border: '2px solid #cbd5e1'
            }}
          >
            {/* The flap of the envelope */}
            <motion.div
              initial={{ rotateX: -180, transformOrigin: 'top' }}
              animate={phase === 'folding' ? { rotateX: 0 } : { rotateX: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '80px',
                background: '#e2e8f0',
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                transformOrigin: 'top',
                zIndex: 10,
                backfaceVisibility: 'hidden'
              }}
            />
            {/* Front lines to look like an envelope */}
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, transparent 49%, #e2e8f0 50%, transparent 51%)'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(-135deg, transparent 49%, #e2e8f0 50%, transparent 51%)'
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
