'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import SpotlightEffect from '../components/SpotlightEffect';

const CommandPalette = dynamic(() => import('../components/CommandPalette'), { ssr: false });
const Sidebar = dynamic(() => import('../components/Sidebar'), { ssr: false });
const MiniAvatar = dynamic(() => import('../components/MiniAvatar'), { ssr: false });
const PortfolioAgent = dynamic(() => import('../components/PortfolioAgent'), { ssr: false });

/**
 * Ambient Typing Sound Engine
 * Continuously synthesizes random mechanical keyboard clicks
 * to match the 3D character typing animation in the background video.
 */
function startAmbientTyping(ctx: AudioContext) {
  let stopped = false;

  function playOneClick() {
    if (stopped || ctx.state === 'closed') return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const now = ctx.currentTime;

      // Pick random "key type" for variety
      const keyType = Math.random();

      let pitchMod = 1 + (Math.random() * 0.1 - 0.05);
      
      // 1. Sharp Click (switch actuation)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime((keyType > 0.9 ? 350 : 450) * pitchMod, now);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickGain.gain.setValueAtTime(0.08, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      clickOsc.start(now);
      clickOsc.stop(now + 0.02);

      // 2. Plastic Clack (switch body & keycap)
      // We use a short burst of noise passed through a bandpass filter
      const nLen = 0.03;
      const nBuf = ctx.createBuffer(1, ctx.sampleRate * nLen, ctx.sampleRate);
      const nData = nBuf.getChannelData(0);
      for (let i = 0; i < nData.length; i++) {
        nData[i] = Math.random() * 2 - 1; // white noise
      }
      const nSrc = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const nGain = ctx.createGain();
      
      nSrc.buffer = nBuf;
      filter.type = 'bandpass';
      filter.frequency.value = keyType > 0.9 ? 800 : 1200; // lower for space/enter
      filter.Q.value = 1.2;
      
      nSrc.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      
      nGain.gain.setValueAtTime(0.12, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + nLen);
      nSrc.start(now);
      nSrc.stop(now + nLen);

      // 3. Deep Thud (bottom out)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime((keyType > 0.9 ? 80 : 110) * pitchMod, now);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudGain.gain.setValueAtTime(0.15, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      thudOsc.start(now);
      thudOsc.stop(now + 0.07);
    } catch {
      // ignore
    }

    // Slower, more deliberate typing cadence (Mechanical style)
    let delay: number;
    const pauseChance = Math.random();
    if (pauseChance > 0.95) {
      // Long thinking pause
      delay = 800 + Math.random() * 1000;
    } else if (pauseChance > 0.85) {
      // Word gap pause
      delay = 350 + Math.random() * 300;
    } else {
      // Regular keystrokes (slowed down)
      delay = 140 + Math.random() * 120; // 140-260ms
    }

    setTimeout(playOneClick, delay);
  }

  // Start the loop
  playOneClick();

  // Return stop function
  return () => { stopped = true; };
}

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let started = false;

    const initAndStartTyping = () => {
      if (started) return;
      started = true;

      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return;

        const ctx = new AC();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            stopRef.current = startAmbientTyping(ctx);
          });
        } else {
          stopRef.current = startAmbientTyping(ctx);
        }
      } catch {
        // Audio not supported
      }
    };

    // Browser requires user gesture to start audio
    // Start typing sounds on first click, touch, scroll, or keypress
    document.addEventListener('click', initAndStartTyping, { once: true });
    document.addEventListener('touchstart', initAndStartTyping, { once: true });
    document.addEventListener('scroll', initAndStartTyping, { once: true });
    document.addEventListener('keydown', initAndStartTyping, { once: true });

    return () => {
      document.removeEventListener('click', initAndStartTyping);
      document.removeEventListener('touchstart', initAndStartTyping);
      document.removeEventListener('scroll', initAndStartTyping);
      document.removeEventListener('keydown', initAndStartTyping);
      if (stopRef.current) stopRef.current();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <>
      {/* Global Background Video — visible on ALL pages */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <video
          src="/char-animation.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.12,
          }}
        />
      </div>
      <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
        <SpotlightEffect />
        <CommandPalette />
        <Sidebar />
        <MiniAvatar />
        <PortfolioAgent />
        <main className="main-content">
          {children}
          <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: '8rem', paddingTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <p>© 2026 Harshit Jaiswal. Built with Next.js & Bun.</p>
          </footer>
        </main>
      </div>
    </>
  );
}
