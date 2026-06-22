'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

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

      let clickFreq: number, thudFreq: number, clickVol: number, thudVol: number, noiseVol: number, thudDecay: number;

      if (keyType > 0.95) {
        // Enter key (~5% chance) - deeper, louder
        clickFreq = 1200; thudFreq = 100; clickVol = 0.18; thudVol = 0.25; noiseVol = 0.12; thudDecay = 0.12;
      } else if (keyType > 0.85) {
        // Space bar (~10% chance) - medium thud
        clickFreq = 1400; thudFreq = 120; clickVol = 0.15; thudVol = 0.2; noiseVol = 0.1; thudDecay = 0.1;
      } else {
        // Regular key (~85% chance)
        clickFreq = 1600 + Math.random() * 400; // 1600-2000 Hz
        thudFreq = 140 + Math.random() * 40;
        clickVol = 0.1 + Math.random() * 0.08;
        thudVol = 0.15 + Math.random() * 0.1;
        noiseVol = 0.06 + Math.random() * 0.04;
        thudDecay = 0.05 + Math.random() * 0.03;
      }

      // Slight pitch randomization
      const pitch = 1 + (Math.random() * 0.12 - 0.06);

      // Click transient
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(clickFreq * pitch, now);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickGain.gain.setValueAtTime(clickVol, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      clickOsc.start(now);
      clickOsc.stop(now + 0.025);

      // Bottom-out thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(thudFreq * pitch, now);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudGain.gain.setValueAtTime(thudVol, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + thudDecay);
      thudOsc.start(now);
      thudOsc.stop(now + 0.15);

      // Noise burst for realism
      const nLen = 0.025;
      const nBuf = ctx.createBuffer(1, ctx.sampleRate * nLen, ctx.sampleRate);
      const nData = nBuf.getChannelData(0);
      for (let i = 0; i < nData.length; i++) {
        nData[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const nSrc = ctx.createBufferSource();
      const nGain = ctx.createGain();
      nSrc.buffer = nBuf;
      nSrc.connect(nGain);
      nGain.connect(ctx.destination);
      nGain.gain.setValueAtTime(noiseVol, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      nSrc.start(now);
      nSrc.stop(now + nLen);
    } catch {
      // ignore
    }

    // Schedule next click with human-like timing
    // Fast typing: 50-120ms between keys, with occasional pauses (thinking)
    let delay: number;
    const pauseChance = Math.random();
    if (pauseChance > 0.92) {
      // Longer thinking pause (~8% chance)
      delay = 300 + Math.random() * 500; // 300-800ms
    } else if (pauseChance > 0.80) {
      // Short pause between words (~12% chance)
      delay = 150 + Math.random() * 200; // 150-350ms
    } else {
      // Fast typing
      delay = 50 + Math.random() * 80; // 50-130ms
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
          src="/char-animation.mp4"
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
