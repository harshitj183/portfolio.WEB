'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Character colors (matching Harshit's cartoon) ──────────────────────────
const SKIN       = '#c8845a';
const SKIN_SH    = '#a8673f';
const HAIR       = '#1a1008';
const SHIRT      = '#c0392b';
const SHIRT_SH   = '#922b21';
const EYE_IRIS   = '#3d1f00';
const NECK_C     = '#b87448';

type WalkDir = 'left' | 'right';
type Mood    = 'walk' | 'idle' | 'typing' | 'waving' | 'thinking' | 'sleeping' | 'dancing';

const QUIPS: Record<Mood, string[]> = {
  walk:     ['Just walking around 🚶', 'Exploring your site...', 'Where to next? 👀', 'npm install life'],
  idle:     ['...', 'Hmm 🤔', 'Nice portfolio!', 'Should I use Bun?'],
  typing:   ['git commit -m "fix"', 'console.log("??")', 'const x = 42;', 'TypeScript ftw!'],
  waving:   ['Hey! 👋', 'Namaste! 🙏', 'Hi from Gurugram!', 'Welcome!'],
  thinking: ['O(n log n)?', 'useEffect or useMemo?', 'Tabs vs spaces 🤔', 'Design patterns...'],
  sleeping: ['zzZ 😴', '5 more mins...', '*snore*'],
  dancing:  ['Build passed! 🎉', 'No bugs today! 🕺', 'Ship it! 🚢'],
};

// ── SVG Character ──────────────────────────────────────────────────────────
const HarshitSVG = ({ mood, dir, step }: { mood: Mood; dir: WalkDir; step: number }) => {
  const walking  = mood === 'walk';
  const isWave   = mood === 'waving';
  const isType   = mood === 'typing';
  const isDance  = mood === 'dancing';
  const isSleep  = mood === 'sleeping';
  const isThink  = mood === 'thinking';

  // leg swing
  const legA = walking ? Math.sin(step * 0.18) * 22 : 0;
  const legB = -legA;

  // arm swing opposite to legs
  const lArm = isWave  ? -110 + Math.sin(step * 0.2) * 25
             : isType  ? -40 + Math.sin(step * 0.5) * 15
             : isDance ? -80 + Math.sin(step * 0.3) * 30
             : walking ? 20 + Math.sin(step * 0.18) * 28
             : -20;
  const rArm = isType  ? 40 - Math.sin(step * 0.5) * 15
             : isDance ? 80 - Math.sin(step * 0.3) * 30
             : walking ? 20 - Math.sin(step * 0.18) * 28
             : 20;

  // body bob while walking
  const bodyBob = walking ? Math.abs(Math.sin(step * 0.18)) * -3 : 0;

  const flip = dir === 'left' ? 'scale(-1,1)' : 'scale(1,1)';

  return (
    <svg
      width="64" height="96"
      viewBox="0 0 72 108"
      fill="none"
      style={{ transform: flip, transformOrigin: '36px 54px', overflow: 'visible' }}
    >
      {/* ── LEGS ── */}
      <g transform={`translate(0,${bodyBob})`}>
        {/* Left leg */}
        <g style={{ transformOrigin: '28px 82px', transform: `rotate(${legA}deg)` }}>
          <rect x="24" y="82" width="9" height="20" rx="4" fill="#1e1e24" />
          <rect x="22" y="98" width="13" height="6" rx="3" fill="#111" />
        </g>
        {/* Right leg */}
        <g style={{ transformOrigin: '44px 82px', transform: `rotate(${legB}deg)` }}>
          <rect x="39" y="82" width="9" height="20" rx="4" fill="#1e1e24" />
          <rect x="37" y="98" width="13" height="6" rx="3" fill="#111" />
        </g>

        {/* ── BODY ── */}
        <path d="M18 66 Q14 78 13 108 H59 Q58 78 54 66 Q45 72 36 72 Q27 72 18 66Z" fill={SHIRT} />
        <path d="M18 66 Q14 78 13 108 H36 V72 Q27 72 18 66Z" fill={SHIRT_SH} opacity="0.35" />
        {/* Collar */}
        <path d="M26 66 L30 76 L36 72 L36 66Z" fill={SHIRT_SH} />
        <path d="M46 66 L42 76 L36 72 L36 66Z" fill={SHIRT} />

        {/* LEFT ARM */}
        <g style={{ transformOrigin: '20px 68px', transform: `rotate(${lArm}deg)` }}>
          <rect x="13" y="66" width="9" height="22" rx="4.5" fill={SHIRT} />
          <ellipse cx="17.5" cy="90" rx="4.5" ry="4" fill={SKIN} />
        </g>

        {/* RIGHT ARM */}
        <g style={{ transformOrigin: '52px 68px', transform: `rotate(${rArm}deg)` }}>
          <rect x="50" y="66" width="9" height="22" rx="4.5" fill={SHIRT} />
          <ellipse cx="54.5" cy="90" rx="4.5" ry="4" fill={SKIN} />
        </g>

        {/* Coffee cup */}
        {mood === 'idle' && (
          <g transform="translate(62,76)">
            <rect x="-5" y="-8" width="11" height="13" rx="2" fill="white" />
            <rect x="-5" y="-8" width="11" height="5" rx="2" fill="#7b4f2e" />
            <path d="M6 -5 Q11 -5 11 0 Q11 5 6 5" stroke="#aaa" strokeWidth="1.5" fill="none"/>
          </g>
        )}
      </g>

      {/* ── NECK ── */}
      <rect x="30" y="56" width="12" height="12" rx="3" fill={NECK_C} transform={`translate(0,${bodyBob})`} />

      {/* ── HEAD ── */}
      <g transform={`translate(0,${bodyBob + (isDance ? Math.sin(step * 0.3) * 4 : 0)})`}
         style={{ transformOrigin: '36px 56px',
                  transform: `translate(0,${bodyBob + (isDance ? Math.sin(step * 0.3) * 4 : 0)}px) rotate(${isThink ? 8 : isSleep ? 10 : 0}deg)` }}>
        {/* Head */}
        <ellipse cx="36" cy="36" rx="20" ry="22" fill={SKIN} />
        <ellipse cx="44" cy="36" rx="12" ry="20" fill={SKIN_SH} opacity="0.28" />

        {/* Hair */}
        <ellipse cx="36" cy="18" rx="20" ry="10" fill={HAIR} />
        <path d="M16 24 Q14 12 20 8 Q28 2 38 4 Q50 4 54 14 Q58 22 52 26 Q48 14 36 14 Q24 14 18 26Z" fill={HAIR} />
        <path d="M46 6 Q56 8 54 18 Q52 12 44 12Z" fill={HAIR} opacity="0.7" />
        <path d="M22 12 Q28 6 36 8 Q30 10 26 16Z" fill="#2a1a08" opacity="0.5" />

        {/* Eyebrows */}
        <path d="M22 26 Q26 23 30 25" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M42 25 Q46 23 50 26" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="27" cy="31" rx="4"   ry={isSleep ? 1.2 : 4}   fill="white" />
        <ellipse cx="45" cy="31" rx="4"   ry={isSleep ? 1.2 : 4}   fill="white" />
        {!isSleep && <>
          <ellipse cx="27" cy="32" rx="2.5" ry="2.8" fill={EYE_IRIS} />
          <ellipse cx="27" cy="32" rx="1.4" ry="1.6" fill="#080300" />
          <ellipse cx="28" cy="30.5" rx="0.7" ry="0.7" fill="white" opacity="0.9" />
          <ellipse cx="45" cy="32" rx="2.5" ry="2.8" fill={EYE_IRIS} />
          <ellipse cx="45" cy="32" rx="1.4" ry="1.6" fill="#080300" />
          <ellipse cx="46" cy="30.5" rx="0.7" ry="0.7" fill="white" opacity="0.9" />
          {/* Blink overlay — animates via CSS so no framer-motion needed here */}
          <ellipse cx="27" cy="31" rx="4" ry="4" fill={SKIN} style={{ animation: 'blink 4s infinite' }} />
          <ellipse cx="45" cy="31" rx="4" ry="4" fill={SKIN} style={{ animation: 'blink 4s infinite' }} />
        </>}
        {isSleep && <>
          <path d="M23 31 Q27 34 31 31" stroke={HAIR} strokeWidth="1.5" fill="none" />
          <path d="M41 31 Q45 34 49 31" stroke={HAIR} strokeWidth="1.5" fill="none" />
        </>}

        {/* Nose */}
        <path d="M34 36 Q32 42 34 44 Q36 45 38 44 Q40 42 38 36" stroke={SKIN_SH} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <ellipse cx="34.5" cy="44" rx="2" ry="1" fill={SKIN_SH} opacity="0.4" />
        <ellipse cx="37.5" cy="44" rx="2" ry="1" fill={SKIN_SH} opacity="0.4" />

        {/* Mouth */}
        {(isDance || isWave)
          ? <path d="M29 50 Q36 56 43 50" stroke={SKIN_SH} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          : isSleep
          ? <path d="M32 51 Q36 53 40 51" stroke={SKIN_SH} strokeWidth="1.5" fill="none" />
          : <path d="M31 50 Q36 53 41 50" stroke={SKIN_SH} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        }

        {/* Ears */}
        <ellipse cx="16" cy="35" rx="3" ry="4.5" fill={SKIN} />
        <ellipse cx="56" cy="35" rx="3" ry="4.5" fill={SKIN} />

        {/* Zzz */}
        {isSleep && (
          <motion.text x="52" y="18" fontSize="10" fontWeight="800" fill="#94a3b8"
            animate={{ y: [18, 5], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}>Zzz</motion.text>
        )}
      </g>
    </svg>
  );
};

// ── Roaming Logic ──────────────────────────────────────────────────────────
const CHAR_W = 64;
const CHAR_H = 96;
const MARGIN = 8;

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

export default function RoamingHarshit() {
  const [pos, setPos]     = useState({ x: 40, y: 0 });
  const [dir, setDir]     = useState<WalkDir>('right');
  const [mood, setMood]   = useState<Mood>('waving');
  const [step, setStep]   = useState(0);
  const [bubble, setBubble] = useState('');
  const [showBubble, setShowBubble] = useState(true);

  const vel   = useRef({ x: 1.8, y: 0 });
  const frame = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Show a random quip bubble
  const showQuip = useCallback((m: Mood) => {
    const arr = QUIPS[m];
    setBubble(arr[Math.floor(Math.random() * arr.length)]);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2800);
  }, []);

  // Trigger random idle mood
  const goIdle = useCallback(() => {
    const idles: Mood[] = ['idle', 'typing', 'thinking', 'sleeping', 'dancing', 'waving'];
    const m = idles[Math.floor(Math.random() * idles.length)];
    setMood(m);
    showQuip(m);
    idleTimer.current = setTimeout(() => {
      setMood('walk');
      vel.current = { x: (Math.random() > 0.5 ? 1 : -1) * randomBetween(1.2, 2.2), y: 0 };
    }, randomBetween(3000, 7000));
  }, [showQuip]);

  useEffect(() => {
    // CSS blink keyframe
    const style = document.createElement('style');
    style.innerHTML = `@keyframes blink { 0%,90%,100%{transform:scaleY(1)} 93%,97%{transform:scaleY(0)} }`;
    document.head.appendChild(style);

    // Initial greeting
    showQuip('waving');
    idleTimer.current = setTimeout(() => {
      setMood('walk');
    }, 3500);

    return () => { clearTimeout(idleTimer.current); style.remove(); };
  }, [showQuip]);

  useEffect(() => {
    if (mood !== 'walk') return;

    let stepCount = 0;
    frame.current = window.setInterval(() => {
      setPos(prev => {
        const maxX = window.innerWidth  - CHAR_W - MARGIN;
        let nx = prev.x + vel.current.x;

        // Bounce X
        if (nx < MARGIN)  { nx = MARGIN;  vel.current.x =  Math.abs(vel.current.x); }
        if (nx > maxX)    { nx = maxX;    vel.current.x = -Math.abs(vel.current.x); }

        setDir(vel.current.x > 0 ? 'right' : 'left');
        return { x: nx, y: 0 };
      });

      stepCount++;
      setStep(s => s + 1);

      // Random speed variation
      if (stepCount % 200 === 0) {
        const speed = randomBetween(1.2, 2.5);
        vel.current.x = (vel.current.x > 0 ? 1 : -1) * speed;
      }

      // Occasionally stop and do something
      if (stepCount % 300 === 0 && Math.random() > 0.4) {
        clearInterval(frame.current);
        goIdle();
      }
    }, 16) as unknown as number;

    return () => clearInterval(frame.current);
  }, [mood, goIdle]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => {
          clearTimeout(idleTimer.current);
          clearInterval(frame.current);
          goIdle();
        }}
        style={{
          position: 'fixed',
          left: pos.x,
          bottom: '10px',
          width:  CHAR_W,
          height: CHAR_H,
          zIndex: 9999,
          cursor: 'pointer',
          userSelect: 'none',
          pointerEvents: 'auto',
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

        <HarshitSVG mood={mood} dir={dir} step={step} />

        {/* Shadow on ground */}
        <div style={{
          position: 'absolute', bottom: '-6px',
          left: '50%', transform: 'translateX(-50%)',
          width: '40px', height: '8px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
        }} />
      </motion.div>
    </>
  );
}
