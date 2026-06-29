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
function startAmbientTyping() {
  const audio = new Audio('/typing.mp3');
  audio.loop = true;
  audio.volume = 0.4;
  
  audio.play().catch(() => {
    // Autoplay might be blocked until user interaction
  });

  return () => {
    audio.pause();
    audio.currentTime = 0;
  };
}

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let started = false;

    const initAndStartTyping = () => {
      if (started) return;
      started = true;
      stopRef.current = startAmbientTyping();
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
          ref={(el) => {
            if (el && !el.src) {
              // Short delay so video doesn't block FCP/LCP
              setTimeout(() => {
                el.src = '/char-animation.webm';
                el.load();
              }, 300);
            }
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
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
