'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

type WalkDir = 'left' | 'right';
type Mood    = 'walk' | 'idle' | 'typing' | 'waving' | 'thinking' | 'sleeping' | 'dancing';

const QUIPS: Record<Mood, string[]> = {
  walk:     ['Just walking around 🚶', 'Exploring your site...', 'Click me to chat! 💬', 'npm install life'],
  idle:     ['...', 'Hmm 🤔 Click me!', 'Nice portfolio!', 'Should I use Bun?'],
  typing:   ['git commit -m "fix"', 'console.log("??")', 'const x = 42;', 'TypeScript ftw!'],
  waving:   ['Hey! 👋 Click to chat!', 'Namaste! 🙏', 'Hi from Gurugram!', 'Welcome!'],
  thinking: ['O(n log n)?', 'useEffect or useMemo?', 'Tabs vs spaces 🤔', 'Design patterns...'],
  sleeping: ['zzZ 😴', '5 more mins...', '*snore*'],
  dancing:  ['Build passed! 🎉', 'No bugs today! 🕺', 'Ship it! 🚢'],
};

// Helper to get relative climb heights based on viewport height
const getTargetLevels = () => {
  if (typeof window === 'undefined') return [20, 150, 300, 450];
  const maxClimb = window.innerHeight * 0.65;
  return [20, Math.floor(maxClimb * 0.33), Math.floor(maxClimb * 0.66), Math.floor(maxClimb)];
};

// ── Pixel Art Character ───────────────────────────────────────────────────
const HarshitPixelImage = ({ mood, dir, step }: { mood: Mood; dir: WalkDir; step: number }) => {
  let src = '/avatar/idle.png';
  const isWalking = mood === 'walk';
  const isDancing = mood === 'dancing';
  
  if (mood === 'waving') {
    src = '/avatar/waving.png';
  } else if (mood === 'idle') {
    src = '/avatar/idle.png';
  } else if (mood === 'typing') {
    src = '/avatar/typing.png';
  } else if (mood === 'thinking') {
    src = '/avatar/thinking.png';
  } else if (mood === 'sleeping') {
    src = '/avatar/sleeping.png';
  } else if (mood === 'dancing') {
    src = (Math.floor(step / 2) % 2 === 0) ? '/avatar/dancing.png' : '/avatar/idle.png';
  } else if (mood === 'walk') {
    src = (Math.floor(step / 2) % 2 === 0) ? '/avatar/walk.png' : '/avatar/idle.png';
  }

  const bobY = isWalking ? (step % 2 === 0 ? '-5px' : '0px') : '0px';
  const rotateVal = isDancing ? (step % 2 === 0 ? '7deg' : '-7deg') : '0deg';
  const scaleVal = isDancing ? (step % 2 === 0 ? 1.1 : 0.94) : 1;
  const flipScaleX = dir === 'left' ? -1 : 1;

  return (
    <div
      style={{
        width: '84px',
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${bobY}) scaleX(${flipScaleX}) rotate(${rotateVal}) scale(${scaleVal})`,
        transition: 'transform 0.1s ease',
        position: 'relative'
      }}
    >
      <img
        src={src}
        alt="Harshit Jaiswal Avatar"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// ── Roaming Logic ──────────────────────────────────────────────────────────
function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

export default function RoamingHarshit() {
  const pathname = usePathname();
  
  // State for rendering repaint
  const [pos, setPos]           = useState({ x: 40, y: 20 });
  const [targetY, setTargetY]   = useState(20);
  const [dir, setDir]           = useState<WalkDir>('left');
  const [mood, setMood]         = useState<Mood>('waving');
  const [step, setStep]         = useState(0);
  const [bubble, setBubble] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  // Refs for stable coordinate updates inside animation frames
  const posRef = useRef({ x: 40, y: 20 });
  const vel = useRef({ x: 2.6, y: 0 }); // Positive velocity = moves left (away from right edge)
  
  const isHovered = useRef(false);
  const lastTime = useRef(0);
  const frameId = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Helper to trigger quips
  const triggerBubble = useCallback((text: string, duration = 2500) => {
    setBubble(text);
    setShowBubble(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setShowBubble(false), duration);
  }, []);

  const showQuip = useCallback((m: Mood) => {
    const arr = QUIPS[m];
    triggerBubble(arr[Math.floor(Math.random() * arr.length)]);
  }, [triggerBubble]);

  // Go to random idle mood
  const goIdle = useCallback(() => {
    const idles: Mood[] = ['idle', 'typing', 'thinking', 'sleeping', 'dancing', 'waving'];
    const m = idles[Math.floor(Math.random() * idles.length)];
    setMood(m);
    showQuip(m);
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setMood('walk');
      const speed = randomBetween(2.4, 3.8);
      vel.current.x = (Math.random() > 0.5 ? 1 : -1) * speed;
      setDir(vel.current.x > 0 ? 'left' : 'right');
    }, randomBetween(3000, 6000));
  }, [showQuip]);

  // Initial welcome greeting
  useEffect(() => {
    setPos({ x: 40, y: 20 });
    posRef.current = { x: 40, y: 20 };
    setMood('waving');
    setDir('left');
    triggerBubble('Hey! Welcome to my site! 👋 Click me to talk.', 2500);
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setMood('walk');
      vel.current.x = 2.6;
      setDir('left');
    }, 3000);
    return () => {
      clearTimeout(idleTimer.current);
      clearTimeout(bubbleTimer.current);
    };
  }, [triggerBubble]);

  // Smooth Roaming loop using requestAnimationFrame for X and Y easing
  useEffect(() => {
    lastTime.current = performance.now();
    
    const update = (time: number) => {
      const delta = Math.min((time - lastTime.current) / 16.666, 3);
      lastTime.current = time;

      const current = posRef.current;

      // 1. Ease Y position smoothly to targetY
      let nextY = current.y + (targetY - current.y) * 0.08 * delta;
      if (Math.abs(targetY - nextY) < 1) {
        nextY = targetY;
      }

      // 2. Stroll X position (distance from right edge)
      let nextX = current.x;
      if (mood === 'walk' && !isHovered.current) {
        nextX = current.x + vel.current.x * delta;
        const charWidth = 84;
        const padding = 20;
        const maxW = typeof window !== 'undefined' ? window.innerWidth : 1200;

        // Roaming bounds (distance from right edge)
        const minX = padding;
        const maxX = maxW > 768 ? 400 : maxW - charWidth - padding;

        // Border collision checks
        if (nextX > maxX) {
          nextX = maxX;
          vel.current.x = -Math.abs(vel.current.x); // Walk towards the right edge
          setDir('right');
          setMood('waving');
          triggerBubble('Going right! 👉');
          setTimeout(() => setMood('walk'), 600);
        } else if (nextX < minX) {
          nextX = minX;
          vel.current.x = Math.abs(vel.current.x); // Walk towards the left
          setDir('left');
          setMood('waving');
          triggerBubble('Heading left! 🚶‍♂️');
          setTimeout(() => setMood('walk'), 600);
        }
      }

      // Apply coordinates safely outside state-updaters
      const nextPos = { x: nextX, y: nextY };
      posRef.current = nextPos;
      setPos(nextPos);

      frameId.current = requestAnimationFrame(update);
    };

    frameId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId.current);
  }, [mood, targetY, triggerBubble]);

  // Periodic level jumping (climbing up/down components frequently)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHovered.current) return;
      
      const levels = getTargetLevels();
      const currentLevelIndex = levels.findIndex(l => Math.abs(l - targetY) < 10);
      
      let nextLevelIndex = Math.floor(Math.random() * levels.length);
      if (nextLevelIndex === currentLevelIndex) {
        nextLevelIndex = (nextLevelIndex + 1) % levels.length;
      }
      const nextYVal = levels[nextLevelIndex];
      setTargetY(nextYVal);

      if (nextYVal > targetY) {
        setMood('walk');
        const jumpQuips = [
          'Let\'s climb to the upper sections! 🧗‍♂️',
          'Jumping up to check out this card! 🦘',
          'Let\'s inspect the layout from above! 🎈',
        ];
        triggerBubble(jumpQuips[Math.floor(Math.random() * jumpQuips.length)], 2500);
      } else {
        setMood('walk');
        const fallQuips = [
          'Wheee! Sliding down to lower content cards! 🎢',
          'Back down to ground control! 🌍',
          'Landing on a different surface! 🛬',
        ];
        triggerBubble(fallQuips[Math.floor(Math.random() * fallQuips.length)], 2500);
      }
    }, randomBetween(8000, 14000));

    return () => clearInterval(interval);
  }, [targetY, triggerBubble]);

  // React to Route Navigation
  useEffect(() => {
    if (!pathname) return;
    
    const pathQuips: Record<string, string> = {
      '/': 'Welcome to my main hub! 🏠 Let\'s explore!',
      '/about': 'Here is all about me, my experience & skills! 📖',
      '/projects': 'These are the projects I\'ve crafted! Click any to see details. 🚀',
      '/dashboard': 'Tracking my GitHub stats and code quality live! 📊',
      '/contact': 'Drop me a message! Let\'s collaborate on something awesome. ✉️',
    };
    
    const matchedPath = Object.keys(pathQuips).find(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
    const quip = matchedPath ? pathQuips[matchedPath] : 'Exploring the site... 🚶‍♂️';
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    
    setPos({ x: 40, y: 20 });
    posRef.current = { x: 40, y: 20 };
    setMood('waving');
    triggerBubble(quip, 2000);
    
    idleTimer.current = setTimeout(() => {
      setMood('walk');
    }, 1500);
  }, [pathname, triggerBubble]);

  // Frame animations ticker - 120ms tick
  useEffect(() => {
    const ticker = setInterval(() => {
      setStep((s) => (s + 1) % 100);
    }, 120);
    return () => clearInterval(ticker);
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    isHovered.current = true;
    setMood('waving');
    showQuip('waving');
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    setTimeout(() => {
      if (!isHovered.current) {
        setMood('walk');
      }
    }, 1000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (idleTimer.current) clearTimeout(idleTimer.current);
          setMood('dancing');
          triggerBubble('Yay! Let\'s chat! 💬 Ask me anything about Harshit.');
          window.dispatchEvent(new CustomEvent('toggle-portfolio-agent'));
          
          idleTimer.current = setTimeout(() => {
            setMood('walk');
          }, 4000);
        }}
        style={{
          position: 'fixed',
          right: 0, // Anchored to the right side of the screen
          bottom: 0,
          zIndex: 9999,
          cursor: 'pointer',
          userSelect: 'none',
          pointerEvents: 'auto',
          transform: `translate3d(-${pos.x}px, -${pos.y}px, 0)`, // Shift left by pos.x pixels
          transition: 'transform 0.1s linear',
        }}
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              key={bubble}
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: dir === 'right' ? '0' : 'auto',
                right: dir === 'left'  ? '0' : 'auto',
                marginBottom: '6px',
                background: '#18181b',
                border: '1px solid rgba(99,102,241,0.5)',
                borderRadius: '10px',
                padding: '5px 10px',
                fontSize: '0.68rem',
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
              }}
            >
              {bubble}
              <div style={{
                position: 'absolute', bottom: '-5px',
                left: dir === 'right' ? '14px' : 'auto',
                right: dir === 'left'  ? '14px' : 'auto',
                width: '10px', height: '10px',
                background: '#18181b',
                border: '1px solid rgba(99,102,241,0.5)',
                borderTop: 'none', borderLeft: dir === 'right' ? 'none' : undefined,
                borderRight: dir === 'left' ? 'none' : undefined,
                transform: 'rotate(45deg)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <HarshitPixelImage mood={mood} dir={dir} step={step} />
      </motion.div>
    </>
  );
}
