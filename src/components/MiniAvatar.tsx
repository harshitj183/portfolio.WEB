'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAvatar } from '../context/AvatarContext';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiX } from 'react-icons/fi';

type WalkDir = 'left' | 'right';
type Mood    = 'walk' | 'idle' | 'typing' | 'waving' | 'thinking' | 'sleeping' | 'dancing' | 'running' | 'flying' | 'pointing' | 'talking' | 'jumping' | 'sofa_sleep' | 'sunglasses' | 'lightbulb' | 'hacker_typing' | 'analyzing' | 'building' | 'presenting' | 'listening';

const QUIPS: Record<Mood, string[]> = {
  walk:     ['Just walking around 🚶', 'Exploring your site...', 'Click me to chat! 💬', 'npm install life'],
  idle:     ['Just hanging out ☕', 'Thinking about code...', 'Hover over me!', 'Nice weather today 🌤️'],
  typing:   ['Coding hard... 👨‍💻', 'Fixing bugs... 🐛', 'Writing a new AI agent 🤖'],
  waving:   ['Hello there! 👋', 'Nice to meet you! ✨'],
  thinking: ['Hmm... 🧐', 'Let me check my database 💾', 'Processing request... ⏳'],
  sleeping: ['Zzzzz... 💤', 'Compiling in my sleep...', 'Leave me alone 😴'],
  dancing:  ['Vibin\' to the code 🎵', 'Build succeeded! 🎉', 'Deploying to prod...'],
  running:  ['Late for a meeting! 🏃', 'Chasing a bug 🐛', 'Need more coffee ☕'],
  flying:   ['To the cloud! ☁️', 'Deploying fast! 🚀', 'I believe I can code 🎶'],
  pointing: ['Look at this! 👉', 'Check this out! 👀'],
  talking:  ['Blah blah blah 🗣️', 'Explaining the architecture...'],
  jumping:  ['Woohoo! High jump! 🦘', 'Reaching new heights! 🚀'],
  sofa_sleep: ['Master mode... 😎', 'Just chilling... 🛋️', 'Do not disturb 🤫'],
  sunglasses: ['Thalaiva style! 🕶️', 'Too cool for bugs 😎', 'Mind it! 🤘'],
  lightbulb: ['What an idea, sirji! 💡', 'Eureka! 🧠', 'Lightbulb moment! 🌟'],
  hacker_typing: ['Hacking the mainframe... 🧑‍💻', '1000 WPM! 🚀', 'Compiling next-gen AI...'],
  analyzing: ['Hmm... interesting data.', 'Let me inspect this closer! 🔍', 'Analyzing metrics...'],
  building: ['Building scalable systems! 🏗️', 'Fixing the bugs... 🔧', 'Constructing the future.'],
  presenting: ['As you can see here...', 'Let me demonstrate! 📈', 'Notice this detail...'],
  listening: ['I am all ears! 👂', 'Listening closely...', 'Tell me more! 📝']
};

// Helper to get relative climb heights based on viewport height
const getTargetLevels = () => {
  if (typeof window === 'undefined') return [20, 150, 300, 450];
  const maxClimb = window.innerHeight * 0.65;
  return [20, Math.floor(maxClimb * 0.33), Math.floor(maxClimb * 0.66), Math.floor(maxClimb)];
};

// ── Tour Steps Definition ──────────────────────────────────────────────────
interface TourStep {
  path: string;
  targetId: string;
  title: string;
  desc: string;
  quip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    path: '/',
    targetId: 'hero-section',
    title: 'The Engineer',
    desc: 'I am Harshit Jaiswal, an SDE & AI Agent Engineer in Gurugram, Delhi NCR.',
    quip: 'Hey! I build cool software systems. 👋'
  },
  {
    path: '/',
    targetId: 'profile-card',
    title: 'Status: Available',
    desc: 'Currently active and open for full-time engineering roles or specialized freelancing.',
    quip: 'Available for hire! 🟢'
  },
  {
    path: '/',
    targetId: 'tech-stack',
    title: 'Arsenal Intensity',
    desc: 'Specializing in React, TypeScript, Node.js, Next.js, Docker, C++, and PostgreSQL.',
    quip: 'Here is what I code in! 💻'
  },
  {
    path: '/',
    targetId: 'featured-work',
    title: 'Flagship System',
    desc: 'Unified College Interaction System (UCIS) is my flagship product.',
    quip: 'Check this project out! 🚀'
  },
  {
    path: '/projects',
    targetId: 'projects-grid',
    title: 'Engineering Dossiers',
    desc: 'A full directory of my software platforms. Click any project to open detailed case studies.',
    quip: 'Lots of neat projects here! 📁'
  },
  {
    path: '/dashboard',
    targetId: 'stats-overview',
    title: 'Real-time Metrics',
    desc: 'Track my real-time engineering accomplishments, repositories, and solved problems count.',
    quip: 'Here are my live metrics! 📊'
  },
  {
    path: '/dashboard',
    targetId: 'leetcode-distribution',
    title: 'LeetCode Analytics',
    desc: 'I have solved over 400+ data structures and algorithm challenges on LeetCode.',
    quip: 'I love solving algorithms! 🧩'
  },
  {
    path: '/dashboard',
    targetId: 'github-heatmap',
    title: 'GitHub Heatmap',
    desc: 'Live code contribution activity demonstrating steady engineering momentum.',
    quip: 'Check my green calendar! 🟩'
  },
  {
    path: '/contact',
    targetId: 'direct-channels',
    title: 'Direct Channels',
    desc: 'Get in touch via Email, LinkedIn, or book a meeting directly on my Calendly calendar.',
    quip: 'Let\'s talk! 📞'
  },
  {
    path: '/contact',
    targetId: 'contact-form',
    title: 'Send a Transmission',
    desc: 'Submit this secure Formspree contact form. I respond within 24 hours.',
    quip: 'Send me a message! ✉️'
  }
];

// ── Pixel Art Character ───────────────────────────────────────────────────
const HarshitPixelImage = memo(({ mood, dir, step, isClimbing, isAtHome, isMobile, deliveryMode, isDizzy, focusedInputName }: { mood: Mood; dir: WalkDir; step: number; isClimbing: boolean; isAtHome: boolean; isMobile?: boolean; deliveryMode?: string; isDizzy?: boolean; focusedInputName?: string | null }) => {
  let src = '/avatar/idle.webp';
  const isWalking = mood === 'walk';
  const isDancing = mood === 'dancing';
  const isRunning = mood === 'running';
  const isFlying = mood === 'flying';
  
  if (mood === 'waving') {
    src = '/avatar/waving.webp';
  } else if (mood === 'idle') {
    src = '/avatar/idle.webp';
  } else if (mood === 'typing') {
    src = '/avatar/typing.webp';
  } else if (mood === 'thinking') {
    src = '/avatar/thinking.webp';
  } else if (mood === 'sleeping') {
    src = '/avatar/sleeping.webp';
  } else if (mood === 'pointing') {
    src = '/avatar/pointing.webp';
  } else if (mood === 'talking') {
    src = (Math.floor(step / 3) % 2 === 0) ? '/avatar/talking_1.webp' : '/avatar/talking_2.webp';
  } else if (mood === 'dancing') {
    src = (Math.floor(step / 2) % 2 === 0) ? '/avatar/dancing.webp' : '/avatar/idle.webp';
  } else if (mood === 'walk') {
    src = (Math.floor(step / 2) % 2 === 0) ? '/avatar/walk.webp' : '/avatar/idle.webp';
  } else if (mood === 'running') {
    src = (Math.floor(step / 1.5) % 2 === 0) ? '/avatar/running.webp' : '/avatar/idle.webp';
  } else if (mood === 'flying') {
    src = '/avatar/flying.webp';
  } else if (mood === 'jumping') {
    src = '/avatar/jumping.webp';
  } else if (mood === 'sofa_sleep') {
    src = (Math.floor(step / 3) % 2 === 0) ? '/avatar/sofa_sleep_1.webp' : '/avatar/sofa_sleep_2.webp';
  } else if (mood === 'sunglasses') {
    src = '/avatar/sunglasses.webp';
  } else if (mood === 'lightbulb') {
    src = '/avatar/lightbulb.webp';
  } else if (mood === 'hacker_typing') {
    src = '/avatar/hacker_typing.webp';
  } else if (mood === 'analyzing') {
    src = '/avatar/analyzing.webp';
  } else if (mood === 'building') {
    src = '/avatar/building.webp';
  } else if (mood === 'presenting') {
    src = '/avatar/presenting.webp';
  } else if (mood === 'listening') {
    src = '/avatar/thinking.webp';
  }

  const bobY = isClimbing
    ? (Math.abs(Math.sin(step * 0.35)) * -18 + 'px') // hop/jump climbing animation
    : isWalking
      ? (step % 2 === 0 ? '-5px' : '0px')
      : isRunning
        ? (step % 2 === 0 ? '-8px' : '0px')
        : isFlying
          ? (Math.sin(step * 0.1) * 10 + 'px')
          : '0px';
  let customRotate = '0deg';
  if (mood === 'sofa_sleep' && focusedInputName) {
    customRotate = dir === 'left' ? '12deg' : '-12deg';
  }
  const rotateVal = customRotate !== '0deg'
    ? customRotate
    : isDancing ? (step % 2 === 0 ? '7deg' : '-7deg') : (isFlying ? (dir === 'left' ? '-15deg' : '15deg') : (isRunning ? (dir === 'left' ? '-5deg' : '5deg') : '0deg'));
  const scaleValStr = isDancing ? (step % 2 === 0 ? 1.1 : 0.94) : 1;
  const flipScaleX = dir === 'left' ? -1 : 1;

  return (
    <div
      style={{
        width: isMobile ? '120px' : '180px',
        height: isMobile ? '120px' : '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${bobY}) scaleX(${flipScaleX}) rotate(${rotateVal}) scale(${scaleValStr})`,
        transformOrigin: 'bottom center',
        transition: 'all 0.3s ease',
        position: 'relative',
        borderRadius: '50%',
        background: isAtHome ? 'rgba(15, 23, 42, 0.6)' : 'transparent',
        boxShadow: isAtHome ? '0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
        border: isAtHome ? '2px solid rgba(99, 102, 241, 0.6)' : '2px solid transparent',
        backdropFilter: isAtHome ? 'blur(4px)' : 'none',
        overflow: 'visible' // allow drop shadow to bleed out if needed
      }}
    >
      {/* Decorative high-tech ring */}
      {isAtHome && (
        <div style={{
          position: 'absolute',
          top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
          borderRadius: '50%',
          border: '1px dashed rgba(16, 185, 129, 0.5)',
          animation: 'spin 10s linear infinite',
          pointerEvents: 'none'
        }} />
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes sofa-chill-swing {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(3deg); }
        }
        @keyframes avatar-3d-aura {
          0% {
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 1)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
            transform: perspective(400px) rotateY(15deg) rotateX(-5deg) scaleY(1);
          }
          33% {
            filter: drop-shadow(0 0 18px rgba(236, 72, 153, 1)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
            transform: perspective(400px) rotateY(-10deg) rotateX(2deg) scaleY(0.96) scaleX(1.02);
          }
          66% {
            filter: drop-shadow(0 0 12px rgba(16, 185, 129, 1)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
            transform: perspective(400px) rotateY(8deg) rotateX(-2deg) scaleY(1.02);
          }
          100% {
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 1)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
            transform: perspective(400px) rotateY(15deg) rotateX(-5deg) scaleY(1);
          }
        }
        @keyframes avatar-idle-breathe {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(0.96) scaleX(1.02); }
        }
      `}} />

      {isDizzy && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '22px',
          zIndex: 10,
          animation: 'spin 1.5s linear infinite',
          pointerEvents: 'none'
        }}>
          🌀💫🌀
        </div>
      )}

      <Image
        src={src}
        alt="Harshit Jaiswal Avatar"
        width={200}
        height={200}
        priority
        style={{
          width: '80%',
          height: '80%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          animation: isDizzy
            ? 'spin 0.4s linear infinite'
            : mood === 'sofa_sleep'
              ? 'sofa-chill-swing 2.2s ease-in-out infinite'
              : !isAtHome
                ? 'avatar-3d-aura 3s ease-in-out infinite'
                : 'avatar-idle-breathe 2s ease-in-out infinite'
        }}
      />
      {/* Letter Delivery Overlay */}
      {(deliveryMode === 'delivering' || deliveryMode === 'returning') && (
        <div style={{
           position: 'absolute',
           right: '10px',
           top: '50%',
           fontSize: '40px',
           zIndex: 5,
           filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
        }}>
          ✉️
        </div>
      )}
      {/* Sleek Digital Soundwaves for Listening Mood */}
      {mood === 'listening' && (
        <div style={{
           position: 'absolute',
           right: '-30px',
           top: '30%',
           width: '40px',
           height: '40px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           gap: '4px',
           transform: dir === 'left' ? 'scaleX(-1)' : 'none',
           zIndex: 3
        }}>
          <div style={{ width: '4px', height: '10px', background: 'var(--accent)', borderRadius: '2px', animation: 'equalizer 0.8s ease-in-out infinite alternate', animationDelay: '0s' }} />
          <div style={{ width: '4px', height: '24px', background: 'var(--accent)', borderRadius: '2px', animation: 'equalizer 0.8s ease-in-out infinite alternate', animationDelay: '0.2s' }} />
          <div style={{ width: '4px', height: '16px', background: 'var(--accent)', borderRadius: '2px', animation: 'equalizer 0.8s ease-in-out infinite alternate', animationDelay: '0.4s' }} />
          <div style={{ width: '4px', height: '32px', background: 'var(--accent)', borderRadius: '2px', animation: 'equalizer 0.8s ease-in-out infinite alternate', animationDelay: '0.6s' }} />
          <style>{`
            @keyframes equalizer {
              0% { transform: scaleY(0.3); opacity: 0.5; }
              100% { transform: scaleY(1); opacity: 1; filter: drop-shadow(0 0 5px var(--accent)); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
});
HarshitPixelImage.displayName = 'HarshitPixelImage';

// Helper to get contextual quips for different components
const getComponentQuip = (name: string, tag: string): string => {
  const n = name.toLowerCase();
  
  // Specific Contextual Interactions - Contact & Socials
  if (n.includes('+91') || n.includes('phone') || n.includes('call')) return "That's Harshit's direct line! Want to give him a call? 📞";
  if (n.includes('@gmail.com') || n.includes('email')) return "Send an email! He replies pretty quickly. ✉️";
  if (n.includes('github') || n.includes('repo')) return "Check out his open-source code on GitHub! 💻";
  if (n.includes('linkedin') || n.includes('connect')) return "Connect with him on LinkedIn for professional updates. 🤝";
  
  // Projects
  if (n.includes('concept') || n.includes('craft')) return "ConceptCraft AI is his flagship visual learning system. Truly next-level multi-agent pipeline! 🧠";
  if (n.includes('ucis') || n.includes('unified college')) return "Ah, UCIS! His flagship college interaction system. It's massive! 🚀";
  if (n.includes('ai skills') || n.includes('library')) return "He built this AI library using modern Generative AI techniques! 🧠";
  if (n.includes('chat') || n.includes('real-time')) return "Real-time, low-latency chat systems are his specialty. 💬";
  
  // Education & Experience
  if (n.includes('education') || n.includes('b.tech') || n.includes('university') || n.includes('mangalam')) return "Harshit is pursuing his B.Tech at KR Mangalam University! 🎓";
  if (n.includes('experience') || n.includes('senpaihost') || n.includes('intern')) return "He worked as a Developer Intern at SenpaiHost! 💼";
  if (n.includes('freelance') || n.includes('self-employed')) return "He has built 20+ full-stack projects for clients as a freelancer! 💻";
  
  // Skills & Tech
  if (n.includes('c++') || n.includes('dsa') || n.includes('algorithms')) return "He has solved over 400+ LeetCode problems in C++! 💻";
  if (n.includes('docker') || n.includes('devops') || n.includes('cloud')) return "He loves containerizing applications with Docker! 🐳";
  if (n.includes('database') || n.includes('postgresql') || n.includes('mongodb')) return "He designs highly robust and scalable database schemas! 🗄️";
  if (n.includes('bun')) return "Did you know this site runs on Bun instead of Node? Super fast! ⚡";
  if (n.includes('react') || n.includes('next.js') || n.includes('frontend')) return "He builds sleek, modern UIs using Next.js and React! ✨";
  
  // Generic UI Components
  if (n.includes('resume') || n.includes('cv') || n.includes('download')) return "Want to see his professional journey? Download the resume! 📄";
  if (n.includes('theme') || n.includes('mode') || n.includes('color')) return "Switching themes! I love changing colors! 🎨";
  if (n.includes('hero')) return "This is Harshit's main landing! SDE & AI Agent Engineer. 🚀";
  if (n.includes('profile')) return "Check out Harshit's profile card! Available for hire. 🏆";
  if (n.includes('tech-stack') || n.includes('skills')) return "Here is Harshit's tech arsenal: React, TS, Node, C++, Docker... 💻";
  if (n.includes('featured') || n.includes('work')) return "This showcase highlights his best engineering systems! 🌟";
  if (n.includes('projects') || n.includes('grid') || n.includes('dossier')) return "A directory of Harshit's case studies and live projects. 📁";
  if (n.includes('stats') || n.includes('dashboard') || n.includes('metrics')) return "Track live engineering stats, contributions, and solved problems! 📊";
  if (n.includes('leetcode')) return "LeetCode Analytics! Harshit loves data structures & algorithms. 🧩";
  if (n.includes('heatmap') || n.includes('calendar')) return "Check out the green GitHub calendar! Continuous commit momentum. 🟩";
  if (n.includes('contact') || n.includes('form') || n.includes('direct')) return "Need to hire or collaborate? Send a message directly! ✉️";
  
  if (tag === 'A' || tag === 'BUTTON' || n.includes('nav') || n.includes('link') || n.includes('button') || n.includes('menu')) {
    return "Need help navigating here? Just ask me in the chat! 💬";
  }
  
  return `You are looking at the ${name}. Tell me if you want to explore this!`;
};

// ── Roaming Logic ──────────────────────────────────────────────────────────
function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

const MatrixRainCanvas = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const yPositions = Array(columns).fill(0);
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZコンニチハハルシット";

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < yPositions.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = yPositions[i];

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          yPositions[i] = 0;
        } else {
          yPositions[i] += fontSize;
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999998,
        pointerEvents: 'none',
        opacity: 0.38
      }}
    />
  );
});
MatrixRainCanvas.displayName = 'MatrixRainCanvas';

const TennisBallIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible', display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" fill="#a3e635" stroke="#000000" strokeWidth="1.5" />
    <path d="M6.2 6.2c2.5 3.3 2.5 8.3 0 11.6M17.8 6.2c-2.5 3.3-2.5 8.3 0 11.6" stroke="#000000" strokeWidth="1.2" />
  </svg>
);

export default function RoamingHarshit() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentMessage, currentMood } = useAvatar();
  
  // State for rendering repaint
  const [pos, setPos]           = useState({ x: 40, y: 20 });
  // High-performance cursor & element docking refs
  const cursorPosRef = useRef<{ x: number, y: number } | null>(null);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const dockedElementRef = useRef<HTMLElement | null>(null);
  const lastMouseMoveTimeRef = useRef<number>(0);
  
  const [targetY, setTargetY]   = useState(20);
  const [dir, setDir]           = useState<WalkDir>('left');
  const [mood, setMood]         = useState<Mood>('waving');
  const [step, setStep]         = useState(0);
  const [bubble, setBubble] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  // Dizzy & Cheat Code & Catch game states
  const [isDizzy, setIsDizzy] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isCatchMode, setIsCatchMode] = useState(false);
  const [ballPos, setBallPos] = useState<{ x: number; y: number } | null>(null);
  const [ballState, setBallState] = useState<'idle' | 'thrown' | 'caught'>('idle');

  // Particle Engine States
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number; vx: number; vy: number; life: number; scale: number; rotation: number; rotSpeed: number }[]>([]);
  const nextParticleIdRef = useRef(0);

  const clickTimesRef = useRef<number[]>([]);
  const keyBufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const ballThrowRef = useRef<{ startX: number; startY: number; targetX: number; targetY: number; t: number } | null>(null);

  // Contact Form Sitting state
  const [focusedInputName, setFocusedInputName] = useState<string | null>(null);
  const focusedInputNameRef = useRef<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Guided Tour State
  const [tourStep, setTourStep] = useState<number>(-1);

  // Delivery Animation State (Contact Page)
  const [deliveryMode, setDeliveryMode] = useState<'none' | 'submitting' | 'delivering' | 'returning'>('none');
  const [deliveryTarget, setDeliveryTarget] = useState<{ x: number; y: number } | null>(null);

  // Goto Action Target Override
  const [overrideTarget, setOverrideTarget] = useState<{ x: number; y: number } | null>(null);

  // Idle Inactivity Detection State
  const [isIdle, setIsIdle] = useState(false);

  // Refs for stable coordinate updates inside animation frames
  const posRef = useRef({ x: 40, y: 20 });
  const vel = useRef({ x: 2.6, y: 0 }); // Positive velocity = moves left (away from right edge)
  
  const isHovered = useRef(false);
  
  const lastTime = useRef(0);
  const frameId = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingCooldown = useRef(false);

  // Helper to trigger quips
  const triggerBubble = useCallback((text: string, duration = 2500) => {
    setBubble(text);
    setShowBubble(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setShowBubble(false), duration);
  }, []);

  const triggerHackCheatCode = useCallback(() => {
    setIsMatrixActive(true);
    setMood('hacker_typing');
    setOverrideTarget({ x: window.innerWidth / 2 - 90, y: window.innerHeight / 2 - 90 });
    triggerBubble("Matrix decrypted... ACCESS GRANTED! 🕶️💻", 5000);
    
    setTimeout(() => {
      setIsMatrixActive(false);
      setOverrideTarget(null);
      setMood('walk');
    }, 5000);
  }, [triggerBubble]);

  const triggerDanceCheatCode = useCallback(() => {
    setMood('dancing');
    triggerBubble("Cheat activated: DANCE PARTY! 🕺🪩🎉", 5000);
    
    setOverrideTarget({ x: posRef.current.x, y: posRef.current.y + 150 });
    setTimeout(() => {
      setOverrideTarget(null);
    }, 1200);
  }, [triggerBubble]);

  const triggerFlyCheatCode = useCallback(() => {
    setMood('flying');
    triggerBubble("Cheat activated: FLYING MODE! 🚀☁️", 6000);
    
    let count = 0;
    const flyInterval = setInterval(() => {
      setOverrideTarget({
        x: randomBetween(50, window.innerWidth - 200),
        y: randomBetween(50, window.innerHeight - 200)
      });
      count++;
      if (count >= 5) {
        clearInterval(flyInterval);
        setOverrideTarget(null);
        setMood('walk');
      }
    }, 1000);
  }, [triggerBubble]);

  const triggerSleepCheatCode = useCallback(() => {
    setMood('sleeping');
    triggerBubble("Cheat activated: Going to sleep... Zzz 💤", 4000);
    setOverrideTarget({ x: 25, y: 20 });
    setTimeout(() => {
      setOverrideTarget(null);
    }, 4000);
  }, [triggerBubble]);

  const spawnParticles = useCallback((emoji: string, startX: number, startY: number, count = 1) => {
    setParticles(prev => {
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: nextParticleIdRef.current++,
          emoji,
          x: startX,
          y: startY,
          vx: randomBetween(-2, 2),
          vy: randomBetween(1.5, 4.5),
          life: 1.0,
          scale: randomBetween(0.8, 1.3),
          rotation: randomBetween(0, 360),
          rotSpeed: randomBetween(-3, 3)
        });
      }
      return [...prev, ...newParticles].slice(-40);
    });
  }, []);

  const showQuip = useCallback((m: Mood) => {
    const arr = QUIPS[m];
    triggerBubble(arr[Math.floor(Math.random() * arr.length)]);
  }, [triggerBubble]);

  // Sync with AvatarContext
  useEffect(() => {
    if (currentMessage) {
      if (currentMood) setMood(currentMood as Mood);
      triggerBubble(currentMessage, 4000);
    }
  }, [currentMessage, currentMood, triggerBubble]);

  // Load theme and saved tour status on mount
  useEffect(() => {
    // 1. Restore Theme Selection
    const savedTheme = localStorage.getItem('theme-selection');
    if (savedTheme === 'alt') {
      document.documentElement.classList.add('theme-alt');
    }

    // 2. Restore Tour State
    const savedTour = localStorage.getItem('mascot_tour_step');
    if (savedTour !== null) {
      setTourStep(parseInt(savedTour, 10));
    }
  }, []);

  // Sync Tour state to localStorage
  useEffect(() => {
    if (tourStep >= 0) {
      localStorage.setItem('mascot_tour_step', tourStep.toString());
    } else {
      localStorage.removeItem('mascot_tour_step');
    }
  }, [tourStep]);

  // Tour Navigation Controller
  useEffect(() => {
    if (tourStep < 0 || tourStep >= TOUR_STEPS.length) return;
    
    const stepData = TOUR_STEPS[tourStep];
    
    if (pathname !== stepData.path) {
      // mascot informs and changes page
      triggerBubble(`Heading to the next section! 🚀`, 2000);
      const timer = setTimeout(() => {
        router.push(stepData.path);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // mascot is on correct page, brief delay to let elements render
      const timer = setTimeout(() => {
        const el = document.getElementById(stepData.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          triggerBubble(stepData.quip, 3500);
        } else {
          // If element doesn't exist on page, skip step after delay
          triggerBubble(`Looking for section... 🤔`, 2000);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [tourStep, pathname, router, triggerBubble]);

  // Tour Handlers
  const prevTourStep = () => {
    const prev = tourStep - 1;
    if (prev >= 0) {
      setTourStep(prev);
    }
  };

  const nextTourStep = () => {
    const next = tourStep + 1;
    if (next >= TOUR_STEPS.length) {
      endTour();
    } else {
      setTourStep(next);
    }
  };

  const endTour = () => {
    setTourStep(-1);
    localStorage.removeItem('mascot_tour_step');
    document.querySelectorAll('.mascot-highlight-pulse').forEach(item => {
      item.classList.remove('mascot-highlight-pulse');
    });
    setMood('dancing');
    triggerBubble('Tour complete! Let me know if you have questions. 🎓', 3500);
    setTimeout(() => setMood('walk'), 3500);
  };

  // Keyboard controls for Tour & Easter Eggs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Tour guide controls
      if (tourStep >= 0) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (e.key === 'ArrowRight') nextTourStep();
        else if (e.key === 'ArrowLeft') prevTourStep();
        else if (e.key === 'Escape') endTour();
      }

      // 2. Easter Egg codes tracking
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const now = Date.now();
      if (now - lastKeyTimeRef.current > 2000) {
        keyBufferRef.current = '';
      }
      lastKeyTimeRef.current = now;
      
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-20);
        
        if (keyBufferRef.current.endsWith('hack')) {
          keyBufferRef.current = '';
          triggerHackCheatCode();
        } else if (keyBufferRef.current.endsWith('dance')) {
          keyBufferRef.current = '';
          triggerDanceCheatCode();
        } else if (keyBufferRef.current.endsWith('fly')) {
          keyBufferRef.current = '';
          triggerFlyCheatCode();
        } else if (keyBufferRef.current.endsWith('sleep')) {
          keyBufferRef.current = '';
          triggerSleepCheatCode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep, triggerHackCheatCode, triggerDanceCheatCode, triggerFlyCheatCode, triggerSleepCheatCode]);

  // ── Event Listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Guided Tour Trigger
    const handleStartTour = () => {
      setTourStep(0);
      if (pathname !== '/') {
        router.push('/');
      }
    };

    // Contextual Awareness for Projects
    const handleProjectView = (e: Event) => {
      // Don't interrupt if we are currently on a tour
      if (tourStep >= 0) return;
      
      const customEvent = e as CustomEvent;
      const { title } = customEvent.detail || {};
      if (title) {
        setMood('pointing');
        triggerBubble(`Check out ${title}! 👀`, 3000);
        setTimeout(() => setMood('walk'), 3000);
      }
    };
    window.addEventListener('project-view', handleProjectView);

    // 2. Mascot GoTo Command
    const handleMascotGoto = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { elementId, text } = customEvent.detail || {};
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          el.classList.add('mascot-highlight-pulse');
          setTimeout(() => el.classList.remove('mascot-highlight-pulse'), 3000);
          
          const rect = el.getBoundingClientRect();
          let targetXVal = window.innerWidth - rect.right - 90;
          if (targetXVal < 10) targetXVal = window.innerWidth - rect.left + 10;
          const sidebarWidth = window.innerWidth > 1024 ? 280 : 0;
          targetXVal = Math.max(10, Math.min(window.innerWidth - sidebarWidth - 100, targetXVal));
          
          let targetYVal = window.innerHeight - rect.bottom + (rect.height / 2) - 42;
          targetYVal = Math.max(20, Math.min(window.innerHeight - 100, targetYVal));

          setOverrideTarget({ x: targetXVal, y: targetYVal });
          setMood('thinking');
          if (text) triggerBubble(text, 3500);
          
          setTimeout(() => {
            setOverrideTarget(null);
            setMood('walk');
          }, 4500);
        }
      }
    };

    // 3. Theme Toggle Trigger
    const handleToggleTheme = () => {
      setMood('dancing');
      triggerBubble('Hiyah! Theme switch! 🎨', 2500);
      
      // Jump vertical bounce via Framer Motion spring physics
      setOverrideTarget({ x: pos.x, y: pos.y + 100 });
      setTimeout(() => {
        setOverrideTarget(null);
        setMood('walk');
      }, 600);

      const isAlt = document.documentElement.classList.toggle('theme-alt');
      localStorage.setItem('theme-selection', isAlt ? 'alt' : 'default');
    };

    // 4. Contact Form Animation triggers
    const handleFormSubmitting = () => {
      setMood('running');
      triggerBubble('Postman on the way! 🚴‍♂️', 3000);
      
      const formEl = document.getElementById('contact-form');
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        const targetXVal = window.innerWidth - rect.left - 50;
        const targetYVal = window.innerHeight - rect.bottom + 50;
        
        setDeliveryMode('submitting');
        setDeliveryTarget({ x: targetXVal, y: targetYVal });
      } else {
        setDeliveryMode('submitting');
        setDeliveryTarget({ x: 200, y: 100 });
      }
    };

    const handleFormSuccess = () => {
      setDeliveryMode('delivering');
      triggerBubble('Got the letter! Delivering... 🚴‍♂️💨', 2000);
      
      setTimeout(() => {
        // Teleport to off-screen left to simulate a round trip
        setPos({ x: typeof window !== 'undefined' ? window.innerWidth + 150 : 1000, y: 430 });
        if (posRef.current) posRef.current = { x: typeof window !== 'undefined' ? window.innerWidth + 150 : 1000, y: 430 };
        
        setDeliveryMode('returning');
        setMood('running');
        triggerBubble('Mission accomplished! 😎', 3000);
        
        setTimeout(() => {
          setDeliveryMode('none');
          setMood('walk');
        }, 3000);
      }, 4000);
    };

    const handleStartCatch = () => {
      setIsCatchMode(true);
      triggerBubble("Let's play catch! Throw the ball by clicking anywhere on the screen! 🥎✨", 5000);
    };

    const handleStopCatch = () => {
      setIsCatchMode(false);
      setBallPos(null);
      setBallState('idle');
      setOverrideTarget(null);
      triggerBubble("Good game! 🎮 Walk mode restored.", 3000);
    };

    const handleRunCheat = (e: Event) => {
      const customEvent = e as CustomEvent;
      const code = customEvent.detail?.code;
      if (code === 'hack') triggerHackCheatCode();
      else if (code === 'dance') triggerDanceCheatCode();
      else if (code === 'fly') triggerFlyCheatCode();
      else if (code === 'sleep') triggerSleepCheatCode();
    };

    window.addEventListener('start-mascot-tour', handleStartTour);
    window.addEventListener('mascot-goto', handleMascotGoto);
    window.addEventListener('mascot-toggle-theme', handleToggleTheme);
    window.addEventListener('mascot-form-submitting', handleFormSubmitting);
    window.addEventListener('mascot-form-success', handleFormSuccess);
    window.addEventListener('mascot-start-catch', handleStartCatch);
    window.addEventListener('mascot-stop-catch', handleStopCatch);
    window.addEventListener('mascot-run-cheat', handleRunCheat);

    const handleMascotSpeak = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.text) {
        setMood('waving');
        triggerBubble(customEvent.detail.text, 6000);
        setTimeout(() => setMood('walk'), 6000);
      }
    };
    window.addEventListener('mascot-speak', handleMascotSpeak);

    let typingTimeout: NodeJS.Timeout;
    const handleMascotListen = () => {
      if (tourStep >= 0 || deliveryMode !== 'none') return;
      setMood('listening');
      setDir('right'); // look towards input box
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setMood('walk');
      }, 1500);
    };
    window.addEventListener('mascot-listen', handleMascotListen);
    
    // 5. Situational Intent Graph & Visibility tracking
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User came back! Evaluate intent graph
        const history = interactionHistory.current.join(' ');
        
        if ((history.includes('phone') || history.includes('+91')) && (history.includes('email') || history.includes('@gmail'))) {
           setMood('thinking');
           triggerBubble("I noticed you checking the phone and email earlier. Any doubts about hiring? Ask me directly! 💬", 5000);
           interactionHistory.current = []; // Reset graph after acting on it
        } else if ((history.includes('github') || history.includes('repo')) && (history.includes('leetcode'))) {
           setMood('analyzing');
           triggerBubble("Checking out his stats? He codes in C++ every day. Let me know if you want his resume! 📄", 5000);
           interactionHistory.current = [];
        } else if (history.includes('ucis') && history.includes('ai skills')) {
           setMood('building');
           triggerBubble("You seem really interested in his engineering work! Want me to summarize his tech stack? 🚀", 5000);
           interactionHistory.current = [];
        } else {
           setMood('waving');
           triggerBubble("Welcome back! Let's continue. ✨", 3000);
        }
        setTimeout(() => setMood('walk'), 5000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('start-mascot-tour', handleStartTour);
      window.removeEventListener('mascot-goto', handleMascotGoto);
      window.removeEventListener('mascot-toggle-theme', handleToggleTheme);
      window.removeEventListener('mascot-form-submitting', handleFormSubmitting);
      window.removeEventListener('mascot-form-success', handleFormSuccess);
      window.removeEventListener('mascot-speak', handleMascotSpeak);
      window.removeEventListener('mascot-listen', handleMascotListen);
      window.removeEventListener('project-view', handleProjectView);
      window.removeEventListener('mascot-start-catch', handleStartCatch);
      window.removeEventListener('mascot-stop-catch', handleStopCatch);
      window.removeEventListener('mascot-run-cheat', handleRunCheat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, router, triggerBubble, tourStep, deliveryMode, triggerHackCheatCode, triggerDanceCheatCode, triggerFlyCheatCode, triggerSleepCheatCode]);

  // Mouse Click Handler for Catch Mode
  useEffect(() => {
    if (!isCatchMode) return;
    
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, a, .portfolio-agent-container, .mini-avatar-container')) return;
      
      const targetX = window.innerWidth - e.clientX - 40;
      const targetY = window.innerHeight - e.clientY - 40;
      
      ballThrowRef.current = {
        startX: posRef.current.x,
        startY: posRef.current.y + 60,
        targetX: targetX,
        targetY: targetY,
        t: 0
      };
      
      setBallState('thrown');
      setBallPos({ x: posRef.current.x, y: posRef.current.y + 60 });
      setOverrideTarget(null);
      setMood('pointing');
      triggerBubble("Throwing the ball! 🥎☄️", 1000);
    };
    
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [isCatchMode, triggerBubble]);

  // Global Focus listeners for Contact Form Sitting leaning and quips
  useEffect(() => {
    if (pathname !== '/contact') return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const name = target.getAttribute('name');
        if (name) {
          setFocusedInputName(name);
          focusedInputNameRef.current = name;
          
          let quip = '';
          if (name === 'name') {
            quip = "Writing your name? ✍️ Make sure it's correct!";
          } else if (name === 'email') {
            quip = "Enter your email so Harshit can reply! ✉️";
          } else if (name === 'subject') {
            quip = "What's the topic? Keep it clear! 🧐";
          } else if (name === 'message') {
            quip = "Drafting your transmission... I am reading it! 📝";
          }

          if (quip) {
            setBubble(quip);
            setShowBubble(true);
            if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
          }
        }
      }
    };

    const handleFocusOut = () => {
      setFocusedInputName(null);
      focusedInputNameRef.current = null;
      setShowBubble(false);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [pathname]);

  // ── Idle Inactivity Detection ─────────────────────────────────────────────
  useEffect(() => {
    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 60000); // 60 seconds inactivity
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  // Trigger sleep bubble/mood
  useEffect(() => {
    if (isIdle && tourStep === -1 && deliveryMode === 'none') {
      setMood('sleeping');
    } else if (!isIdle && mood === 'sleeping') {
      setMood('waving');
      setTimeout(() => setMood('walk'), 2000);
    }
  }, [isIdle, tourStep, deliveryMode]);

  // Random idle speaking
  useEffect(() => {
    const talkInterval = setInterval(() => {
      // Only talk if we are in the idle corner and not doing anything else
      if (tourStep < 0 && deliveryMode === 'none' && !overrideTarget && !isHovered.current) {
        if (posRef.current.x <= 45 && posRef.current.y <= 25) {
          if (Math.random() < 0.25) {
            showQuip('idle');
          }
        }
      }
    }, 12000);
    return () => clearInterval(talkInterval);
  }, [tourStep, deliveryMode, overrideTarget, showQuip]);

  // Global Input Focus Listener (Listening Animation)
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (pathname === '/contact') return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (tourStep < 0 && deliveryMode === 'none' && !overrideTarget) {
           setMood('listening');
           showQuip('listening');
           // Set talking for a brief moment then return to listening
           setTimeout(() => setMood('listening'), 3000);
        }
      }
    };
    
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [tourStep, deliveryMode, overrideTarget, showQuip, pathname]);


  // Contextual Hover State & Intent Graph
  const [hoveredContext, setHoveredContext] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactionHistory = useRef<string[]>([]);

  // ── Cursor Tracking & Context Detection ──────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (focusedInputNameRef.current) return;
      lastMouseMoveTimeRef.current = performance.now();

      // Offset position slightly behind cursor
      const offset = 80;
      cursorPosRef.current = {
        x: window.innerWidth - e.clientX - offset,
        y: window.innerHeight - e.clientY - offset
      };

      // Undock immediately on mouse move so it chases the cursor
      if (dockedElementRef.current) {
        dockedElementRef.current = null;
        setMood('walk');
        setShowBubble(false);
      }

      // Contextual Widget Detection
      const target = e.target as HTMLElement;
      // Find closest interactive element or prominent section/card
      const closestInteractive = target.closest('a, button, [role="button"], article, .card, section, .glass-panel, [id]');

      if (closestInteractive) {
        hoveredElementRef.current = closestInteractive as HTMLElement;
        
        let contextName = closestInteractive.getAttribute('aria-label')
                   || closestInteractive.getAttribute('title')
                   || (closestInteractive.tagName === 'SECTION' ? closestInteractive.id : null)
                   || (closestInteractive.id ? closestInteractive.id : null)
                   || (closestInteractive.textContent ? closestInteractive.textContent.slice(0, 20).trim() + '...' : null);

        if (contextName && contextName !== hoveredContext) {
          if (hoverTimer.current) clearTimeout(hoverTimer.current);
          hoverTimer.current = setTimeout(() => {
            setHoveredContext(contextName);
            // Push to intent graph
            interactionHistory.current.push(contextName!.toLowerCase());
            if (interactionHistory.current.length > 5) interactionHistory.current.shift();
            
            // Let the animation loop know we are docking to this element
            dockedElementRef.current = closestInteractive as HTMLElement;
            
            // Set context-aware presentation mood before talking
            if (pathname === '/dashboard') {
              setMood('analyzing');
            } else if (pathname === '/projects') {
              setMood(Math.random() > 0.5 ? 'building' : 'presenting');
            } else {
              setMood('pointing');
            }
            
            // Set talking quip based on element
            setTimeout(() => {
              if (pathname === '/dashboard') {
                setMood('hacker_typing');
              } else {
                setMood('talking');
              }
              const quip = getComponentQuip(contextName, closestInteractive.tagName);
              triggerBubble(quip, 5000);
            }, 800);
          }, 400); // 400ms hover delay to dock
        }
      } else {
        hoveredElementRef.current = null;
        if (hoveredContext) {
          if (hoverTimer.current) clearTimeout(hoverTimer.current);
          setHoveredContext(null);
          setShowBubble(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [hoveredContext, triggerBubble, pathname]);

  // ── Smooth Roaming/Easing loop ─────────────────────────────────────────────
  useEffect(() => {
    lastTime.current = performance.now();
    
    const update = () => {
      if (document.hidden) {
        frameId.current = requestAnimationFrame(update);
        return;
      }
      try {
        const time = performance.now();
        const delta = Math.min((time - lastTime.current) / 16.666, 3);
        lastTime.current = time;

        if (isMobile) {
          // On mobile, lock the avatar to the bottom right corner (idle position)
          setPos({ x: 20, y: 20 });
          if (mood === 'walk' || mood === 'running' || mood === 'flying') {
            setMood('idle');
          }
          frameId.current = requestAnimationFrame(update);
          return;
        }

        const current = posRef.current;

        if (ballThrowRef.current) {
          const throwData = ballThrowRef.current;
          throwData.t += 0.045 * delta;
          if (throwData.t >= 1) {
            throwData.t = 1;
            setBallPos({ x: throwData.targetX, y: throwData.targetY });
            setOverrideTarget({ x: throwData.targetX, y: throwData.targetY });
            setMood('running');
            triggerBubble("Chasing the ball! 🏃🥎", 2000);
            spawnParticles('✨', throwData.targetX, throwData.targetY, 6);
            ballThrowRef.current = null;
          } else {
            const t = throwData.t;
            const ballX = throwData.startX + (throwData.targetX - throwData.startX) * t;
            const ballY = throwData.startY + (throwData.targetY - throwData.startY) * t + Math.sin(t * Math.PI) * 140;
            setBallPos({ x: ballX, y: ballY });
          }
        }

        let nextY = current.y + (targetY - current.y) * 0.08 * delta;
        if (Math.abs(targetY - nextY) < 1) nextY = targetY;

        let nextX = current.x;

        // ── Priority Easing coordinates based on Mode ──
        if (deliveryMode === 'submitting' && deliveryTarget) {
          // Fast glide to contact form
          nextX = current.x + (deliveryTarget.x - current.x) * 0.15 * delta;
          nextY = current.y + (deliveryTarget.y - current.y) * 0.15 * delta;
          setMood(prev => prev !== 'running' ? 'running' : prev);
          
          const newDir = deliveryTarget.x > current.x ? 'left' : 'right';
          setDir(prev => prev !== newDir ? newDir : prev);
        } else if (deliveryMode === 'delivering') {
          // Run off-screen to the right
          nextX = current.x + (-150 - current.x) * 0.18 * delta;
          setDir(prev => prev !== 'right' ? 'right' : prev);
          setMood(prev => prev !== 'running' ? 'running' : prev);
        } else if (deliveryMode === 'returning') {
          // Fly back to idle position from off-screen left
          nextX = current.x + (25 - current.x) * 0.08 * delta;
          nextY = current.y + (430 - current.y) * 0.08 * delta;
          setDir(prev => prev !== 'left' ? 'left' : prev); 
          setMood(prev => prev !== 'flying' ? 'flying' : prev);
        } else if (pathname === '/contact' && !isCatchMode && tourStep < 0 && !overrideTarget) {
          const formEl = document.getElementById('contact-form');
          if (formEl) {
            const rect = formEl.getBoundingClientRect();
            const targetXVal = window.innerWidth - rect.left - 20;
            const targetYVal = window.innerHeight - rect.top - 92;
            
            nextX = current.x + (targetXVal - current.x) * 0.1 * delta;
            nextY = current.y + (targetYVal - current.y) * 0.1 * delta;
            
            const dist = Math.sqrt((targetXVal - current.x) ** 2 + (targetYVal - current.y) ** 2);
            if (dist < 40) {
              setMood('sofa_sleep');
              setDir('right');
            } else {
              setMood('walk');
              setDir(targetXVal > current.x ? 'left' : 'right');
            }
          } else {
            nextX = current.x + (25 - current.x) * 0.08 * delta;
            nextY = current.y + (20 - current.y) * 0.08 * delta;
            setMood('idle');
          }
        } else if (overrideTarget) {
          // Chat Action Easing (faster when chasing a ball in catch game)
          const easeSpeed = isCatchMode ? 0.12 : 0.0065;
          nextX = current.x + (overrideTarget.x - current.x) * easeSpeed * delta;
          nextY = current.y + (overrideTarget.y - current.y) * easeSpeed * delta;

          if (isCatchMode && ballState === 'thrown') {
            const dx = overrideTarget.x - current.x;
            const dy = overrideTarget.y - current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 40) {
              setBallState('caught');
              setMood('jumping');
              triggerBubble("Caught it! 🥎🎉 Bringing it back to base...", 2200);
              
              setTimeout(() => {
                setOverrideTarget(null);
                setBallPos(null);
                setBallState('idle');
                setMood('walk');
              }, 2200);
            }
          }
        } else if (tourStep >= 0 && typeof window !== 'undefined') {
          // Tour Guide Easing next to highlighted component
          const stepData = TOUR_STEPS[tourStep];
          if (pathname === stepData.path) {
            const el = document.getElementById(stepData.targetId);
            if (el) {
              const rect = el.getBoundingClientRect();
              
              // Apply highlight class
              document.querySelectorAll('.mascot-highlight-pulse').forEach(item => {
                if (item.id !== stepData.targetId) item.classList.remove('mascot-highlight-pulse');
              });
              if (!el.classList.contains('mascot-highlight-pulse')) el.classList.add('mascot-highlight-pulse');

              let targetXVal = window.innerWidth - rect.right - 90;
              if (targetXVal < 10) targetXVal = window.innerWidth - rect.left + 10;
              const sidebarWidth = window.innerWidth > 1024 ? 280 : 0;
              targetXVal = Math.max(10, Math.min(window.innerWidth - sidebarWidth - 100, targetXVal));

              let targetYVal = window.innerHeight - rect.bottom + (rect.height / 2) - 42;
              targetYVal = Math.max(20, Math.min(window.innerHeight - 100, targetYVal));

              nextX = current.x + (targetXVal - current.x) * 0.0065 * delta;
              nextY = current.y + (targetYVal - current.y) * 0.0065 * delta;
              setMood('thinking');
            }
          }
        } else if (false /* HOVER DOCKING DISABLED */ && dockedElementRef.current && !overrideTarget && tourStep < 0 && deliveryMode === 'none') {
          // Easing to docked component next to it
          const dockedEl = dockedElementRef.current;
          if (dockedEl) {
            const rect = (dockedEl as HTMLElement).getBoundingClientRect();
            
            let targetXVal = window.innerWidth - rect.right - 90;
            if (targetXVal < 10) targetXVal = window.innerWidth - rect.left + 10;
            const sidebarWidth = window.innerWidth > 1024 ? 280 : 0;
            targetXVal = Math.max(10, Math.min(window.innerWidth - sidebarWidth - 100, targetXVal));

            let targetYVal = window.innerHeight - rect.bottom + (rect.height / 2) - 42;
            targetYVal = Math.max(20, Math.min(window.innerHeight - 100, targetYVal));

            nextX = current.x + (targetXVal - current.x) * 0.0065 * delta;
            nextY = current.y + (targetYVal - current.y) * 0.0065 * delta;
            
            // Orient avatar towards the center of the docked component
            if (targetXVal > current.x) setDir('left');
            else if (targetXVal < current.x) setDir('right');
          }

        } else if (cursorPosRef.current && (time - lastMouseMoveTimeRef.current < 4000) && !overrideTarget && tourStep < 0 && deliveryMode === 'none') {
          // Follow cursor with dynamic animations
          const cPos = cursorPosRef.current;
          const isInteracting = mood === 'pointing' || mood === 'talking' || mood === 'thinking' || mood === 'typing' || mood === 'jumping' || mood === 'sofa_sleep' || mood === 'sunglasses' || mood === 'lightbulb' || mood === 'listening';

          if (!isInteracting && mood !== 'idle') setMood('idle');

          nextX = 25;
          nextY = typeof window !== 'undefined' ? Math.min(480, window.innerHeight - 200) : 480;

          if (cPos.x > 100) setDir('left');
          else setDir('right');

        } else {
          // Normal mode (Stroller mode disabled, avatar stays fixed)
          nextX = 25;
          nextY = typeof window !== 'undefined' ? Math.min(480, window.innerHeight - 200) : 480;

          // Return to idle mood if we were doing cursor animations but are now inactive
          const isMascotInteracting = mood === 'pointing' || mood === 'talking' || mood === 'thinking' || mood === 'typing' || mood === 'waving' || mood === 'sleeping' || mood === 'jumping' || mood === 'sofa_sleep' || mood === 'sunglasses' || mood === 'lightbulb' || mood === 'listening';
          if (!isMascotInteracting && mood !== 'idle') {
            setMood('idle');
          }

          // Tech stack easter egg typing
          if (pathname === '/') {
            const stackEl = document.getElementById('tech-stack');
            if (stackEl) {
              const rect = stackEl.getBoundingClientRect();
              const stackLeftX = window.innerWidth - rect.right;
              const stackRightX = window.innerWidth - rect.left;
              
              if (current.x >= stackLeftX && current.x <= stackRightX) {
                if (Math.random() < 0.15 && !typingCooldown.current) {
                  setMood('typing');
                  triggerBubble('Coding in React & TypeScript... 💻', 3000);
                  typingCooldown.current = true;
                  setTimeout(() => {
                    setMood('walk');
                    setTimeout(() => { typingCooldown.current = false; }, 15000);
                  }, 3000);
                }
              }
            }
          }
        }

        const nextPos = { x: nextX, y: nextY };
        posRef.current = nextPos;
        setPos(nextPos);

        // Update particle physics
        setParticles(prev => {
          return prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy - 0.08 * delta,
            life: p.life - 0.02 * delta,
            rotation: p.rotation + p.rotSpeed * delta
          })).filter(p => p.life > 0);
        });

        // Spawn trailing exhaust / music particles based on mood
        if (mood === 'running' && Math.random() < 0.22 * delta) {
          spawnParticles('💨', nextX + 40, nextY + 15, 1);
        }
        if (mood === 'flying' && Math.random() < 0.3 * delta) {
          spawnParticles('✨', nextX + 40, nextY + 15, 1);
        }
        if (mood === 'dancing' && Math.random() < 0.2 * delta) {
          const note = Math.random() > 0.5 ? '🎵' : '🎶';
          spawnParticles(note, nextX + 40, nextY + 100, 1);
        }
      } catch (err) {
        console.error("Mascot update loop error:", err);
      }

      frameId.current = requestAnimationFrame(update);
    };

    frameId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId.current);
  }, [mood, targetY, tourStep, pathname, deliveryMode, deliveryTarget, overrideTarget, triggerBubble, isCatchMode, ballState, spawnParticles]);

  // Periodic level jumping when in walk mode - DISABLED to stop flying behavior

  // React to Route Navigation changes
  useEffect(() => {
    if (!pathname || tourStep >= 0) return;
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    
    // We intentionally removed the position reset here so the avatar remembers where it is!
    setMood('waving');
    
    idleTimer.current = setTimeout(() => {
      setMood('walk');
    }, 1500);
  }, [pathname, tourStep, triggerBubble]);

  // Frame animations ticker - 120ms tick
  useEffect(() => {
    let ticker: NodeJS.Timeout;
    
    const startTicker = () => {
      ticker = setInterval(() => {
        setStep((s) => (s + 1) % 100);
      }, 120);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(ticker);
      } else {
        startTicker();
      }
    };

    startTicker();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(ticker);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    if (tourStep >= 0 || deliveryMode !== 'none') return;
    isHovered.current = true;
    setMood('waving');
    showQuip('waving');
  };

  const handleMouseLeave = () => {
    if (tourStep >= 0 || deliveryMode !== 'none') return;
    isHovered.current = false;
    setTimeout(() => {
      if (!isHovered.current) {
        setMood('walk');
      }
    }, 1000);
  };

  const showTourBubble = tourStep >= 0 && tourStep < TOUR_STEPS.length;

  return (
    <>
      <div
        className="mini-avatar-container"
        style={{
          zIndex: 99999,
          userSelect: 'none',
          pointerEvents: 'none', // Let clicks pass through empty spaces
          right: `${pos.x}px`,
          bottom: `${pos.y}px`,
          transition: 'right 0.1s ease-out, bottom 0.1s ease-out'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none', willChange: 'transform' }}
        >
        {/* Speech / Tour bubble */}
        <AnimatePresence>
          {(showBubble || showTourBubble) && (
            <motion.div
              key={showTourBubble ? `tour-${tourStep}` : bubble}
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing/triggering chat panel on bubble clicks
              style={{
                position: 'absolute',
                bottom: '100%',
                left: pos.x > 50 ? 'auto' : '-20px',
                right: pos.x > 50 ? '-20px' : 'auto',
                marginBottom: '10px',
                background: '#ffffff',
                border: '2px solid #000000',
                borderRadius: showTourBubble ? '16px' : '24px', // comic balloon shape
                padding: showTourBubble ? '12px 16px' : '8px 14px',
                fontSize: '0.85rem',
                color: '#000000',
                width: showTourBubble ? '260px' : 'max-content',
                maxWidth: '220px',
                whiteSpace: showTourBubble ? 'normal' : 'normal',
                fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive', // comic font
                fontWeight: 700,
                boxShadow: '4px 4px 0px rgba(0,0,0,1)', // bold comic drop shadow
                pointerEvents: 'auto', // Enable pointer events for bubble interaction
                zIndex: 10
              }}
            >
              {showTourBubble ? (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{TOUR_STEPS[tourStep].title}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{tourStep + 1}/{TOUR_STEPS.length}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '10px', lineHeight: '1.4' }}>
                    {TOUR_STEPS[tourStep].desc}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        endTour();
                      }}
                      style={{
                        background: 'transparent', border: 'none', color: '#f43f5e', fontSize: '0.68rem', cursor: 'pointer', padding: 0, fontWeight: 600
                      }}
                    >
                      Skip (Esc)
                    </button>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevTourStep();
                        }}
                        disabled={tourStep === 0}
                        style={{
                          background: tourStep === 0 ? 'rgba(0,0,0,0.1)' : 'var(--accent)', border: 'none', color: tourStep === 0 ? '#888' : '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', cursor: tourStep === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center'
                        }}
                      >
                        <FiChevronLeft size={10} style={{ marginRight: '2px' }} /> Prev
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextTourStep();
                        }}
                        style={{
                          background: 'var(--accent)', border: 'none', color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center'
                        }}
                      >
                        {tourStep === TOUR_STEPS.length - 1 ? (
                          <>
                            Finish <FiCheckCircle size={10} style={{ marginLeft: '4px' }} />
                          </>
                        ) : (
                          <>
                            Next <FiChevronRight size={10} style={{ marginLeft: '2px' }} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {bubble.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={i} style={{ fontSize: '0.92rem', color: 'var(--accent)' }}>{line.replace(/\*\*/g, '')}</strong>;
                    }
                    return <span key={i} style={{ fontSize: '0.8rem' }}>{line}</span>;
                  })}
                </div>
              )}
              
              <div style={{
                position: 'absolute', bottom: '-7px',
                left: dir === 'right' ? '20px' : 'auto',
                right: dir === 'left'  ? '20px' : 'auto',
                width: '12px', height: '12px',
                background: '#ffffff',
                borderBottom: '2px solid #000000',
                borderRight: '2px solid #000000',
                transform: 'rotate(45deg)',
                boxShadow: '3px 3px 0px rgba(0,0,0,1)', // matching tail shadow
                zIndex: -1
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (tourStep >= 0 || deliveryMode !== 'none' || isDizzy) return;
            
            const now = Date.now();
            const rollingWindow = 2500;
            clickTimesRef.current = [...clickTimesRef.current.filter(t => now - t < rollingWindow), now];
            
            if (clickTimesRef.current.length >= 5) {
              setIsDizzy(true);
              setMood('thinking');
              triggerBubble("Whoa, stop tickling me! My circuits are spinning! 🌀🥴", 4000);
              
              if (idleTimer.current) clearTimeout(idleTimer.current);
              
              setTimeout(() => {
                setIsDizzy(false);
                setMood('walk');
                clickTimesRef.current = [];
              }, 4000);
              return;
            }

            if (idleTimer.current) clearTimeout(idleTimer.current);
            setMood('dancing');
            triggerBubble("Yay! Let's chat! 💬 Ask me anything about Harshit.");
            window.dispatchEvent(new CustomEvent('toggle-portfolio-agent'));
            
            idleTimer.current = setTimeout(() => {
              setMood('walk');
            }, 4000);
          }}
          style={{
            pointerEvents: 'auto',
            cursor: (tourStep >= 0 || deliveryMode !== 'none') ? 'default' : 'pointer',
          }}
        >
          <HarshitPixelImage
            mood={mood}
            dir={dir}
            step={step}
            isClimbing={(mood === 'walk' || mood === 'running') && Math.abs(pos.y - targetY) > 40}
            isAtHome={pos.x <= 45 && pos.y <= 25}
            isMobile={isMobile}
            deliveryMode={deliveryMode}
            isDizzy={isDizzy}
            focusedInputName={focusedInputName}
          />
        </div>
        </motion.div>
      </div>

      {isCatchMode && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 999999,
          background: 'rgba(99, 102, 241, 0.95)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          fontFamily: 'var(--font-primary)',
          pointerEvents: 'auto'
        }}>
          <span><TennisBallIcon size={14} /> Play Catch Mode Active! Click screen to throw.</span>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('mascot-stop-catch'))}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            Exit <FiX size={12} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      )}

      {isMatrixActive && (
        <>
          <MatrixRainCanvas />
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 20, 0, 0.05)',
            border: '4px solid #10b981',
            boxShadow: 'inset 0 0 100px rgba(16, 185, 129, 0.3)',
            pointerEvents: 'none',
            zIndex: 999999,
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px',
            animation: 'matrix-glow 1s infinite alternate'
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes matrix-glow {
                from { opacity: 0.7; }
                to { opacity: 1; }
              }
            `}} />
          </div>
        </>
      )}

      {isCatchMode && (
        <div style={{
          position: 'fixed',
          right: ballState === 'caught'
            ? `${pos.x + 40}px`
            : `${ballPos?.x ?? 100}px`,
          bottom: ballState === 'caught'
            ? `${pos.y + 110}px`
            : `${ballPos?.y ?? 100}px`,
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          pointerEvents: 'none',
          transition: ballState === 'thrown' ? 'right 0.5s ease-out, bottom 0.5s ease-out' : 'none'
        }}>
          <TennisBallIcon size={24} />
        </div>
      )}

      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            right: `${p.x}px`,
            bottom: `${p.y}px`,
            opacity: p.life,
            transform: `rotate(${p.rotation}deg) scale(${p.life})`,
            zIndex: 999999,
            pointerEvents: 'none',
            willChange: 'transform, opacity'
          }}
        >
          {p.emoji === '💨' ? (
            <svg width={14 * p.scale} height={14 * p.scale} viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)" style={{ display: 'block' }}>
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : p.emoji === '✨' ? (
            <svg width={16 * p.scale} height={16 * p.scale} viewBox="0 0 24 24" fill="#fbbf24" style={{ display: 'block' }}>
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          ) : p.emoji === '🎵' || p.emoji === '🎶' ? (
            <svg width={16 * p.scale} height={16 * p.scale} viewBox="0 0 24 24" fill="#ec4899" style={{ display: 'block' }}>
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          ) : (
            p.emoji
          )}
        </div>
      ))}
    </>
  );
}
