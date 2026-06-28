'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

type WalkDir = 'left' | 'right';
type Mood    = 'walk' | 'idle' | 'typing' | 'waving' | 'thinking' | 'sleeping' | 'dancing' | 'running' | 'flying' | 'pointing' | 'talking';

const QUIPS: Record<Mood, string[]> = {
  walk:     ['Just walking around 🚶', 'Exploring your site...', 'Click me to chat! 💬', 'npm install life'],
  idle:     ['*whistles*', 'Hmm...', 'Waiting for instructions ⏱️', 'Beautiful design! ✨'],
  typing:   ['Hackerman mode engaged ⌨️', 'Resolving merge conflicts... 🔨', 'Compiling... ⚙️', 'Fixing a bug 🐛'],
  waving:   ['Hello there! 👋', 'Hi, I\'m Harshit\'s AI! 🤖', 'Welcome to the portfolio! 🎉'],
  thinking: ['Let me process that... 🧠', 'Analyzing the DOM... 🔍', 'Thinking... 🤔'],
  sleeping: ['zzZ...', 'Recharging batteries 🔋', 'Wake me up if you need me 😴'],
  dancing:  ['Woohoo! 🕺', 'This portfolio rocks! 🎸', 'Grooving to the code 🎵'],
  running:  ['Zoom! 🏃', 'Gotta go fast! 💨', 'Racing to the next section! 🏁'],
  flying:   ['To infinity and beyond! 🦸‍♂️', 'I\'m Batman! 🦇', 'Taking the aerial route! ✈️'],
  pointing: ['Look at this! 👉', 'Check this out! 👀', 'Right here! 👇'],
  talking:  ['Blah blah blah 🗣️', 'Let me tell you about this... 🎤', 'Did you know? 💡']
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
    desc: 'I have solved over 350+ data structures and algorithm challenges on LeetCode.',
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
const HarshitPixelImage = ({ mood, dir, step, isClimbing }: { mood: Mood; dir: WalkDir; step: number; isClimbing: boolean }) => {
  let src = '/avatar/idle.png';
  const isWalking = mood === 'walk';
  const isDancing = mood === 'dancing';
  const isRunning = mood === 'running';
  const isFlying = mood === 'flying';
  
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
  } else if (mood === 'pointing') {
    src = '/avatar/pointing.png';
  } else if (mood === 'talking') {
    src = (Math.floor(step / 3) % 2 === 0) ? '/avatar/talking_1.png' : '/avatar/talking_2.png';
  } else if (mood === 'dancing') {
    src = (Math.floor(step / 2) % 2 === 0) ? '/avatar/dancing.png' : '/avatar/idle.png';
  } else if (mood === 'walk') {
    src = (Math.floor(step / 2) % 2 === 0) ? '/avatar/walk.png' : '/avatar/idle.png';
  } else if (mood === 'running') {
    src = (Math.floor(step / 1.5) % 2 === 0) ? '/avatar/running.png' : '/avatar/idle.png';
  } else if (mood === 'flying') {
    src = '/avatar/flying.png';
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
  const rotateVal = isDancing ? (step % 2 === 0 ? '7deg' : '-7deg') : (isFlying ? (dir === 'left' ? '-15deg' : '15deg') : (isRunning ? (dir === 'left' ? '-5deg' : '5deg') : '0deg'));
  const scaleVal = isDancing ? (step % 2 === 0 ? 1.1 : 0.94) : 1;
  const flipScaleX = dir === 'left' ? -1 : 1;

  return (
    <div
      style={{
        width: '104px',
        height: '104px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${bobY}) scaleX(${flipScaleX}) rotate(${rotateVal}) scale(${scaleVal})`,
        transition: 'transform 0.1s ease',
        position: 'relative',
        borderRadius: '50%',
        background: 'rgba(15, 23, 42, 0.6)',
        boxShadow: '0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.4)',
        border: '2px solid rgba(99, 102, 241, 0.6)',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative high-tech ring */}
      <div style={{
        position: 'absolute',
        top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
        borderRadius: '50%',
        border: '1px dashed rgba(16, 185, 129, 0.5)',
        animation: 'spin 10s linear infinite',
        pointerEvents: 'none'
      }} />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />

      <img
        src={src}
        alt="Harshit Jaiswal Avatar"
        style={{
          width: '80%',
          height: '80%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1
        }}
      />
    </div>
  );
};

// Helper to get contextual quips for different components
const getComponentQuip = (name: string, tag: string): string => {
  const n = name.toLowerCase();
  if (tag === 'A' || tag === 'BUTTON' || n.includes('nav') || n.includes('link') || n.includes('button') || n.includes('menu')) {
    return "Need help navigating here? Click me to chat! 💬";
  }
  if (n.includes('hero')) return "This is Harshit's main landing! SDE & AI Agent Engineer. 🚀";
  if (n.includes('profile')) return "Check out Harshit's profile card! 350+ Leetcode solutions, available for hire. 🏆";
  if (n.includes('tech-stack') || n.includes('skills')) return "Here is Harshit's tech arsenal: React, TS, Node, C++, Docker... 💻";
  if (n.includes('featured') || n.includes('work')) return "This showcase highlights Harshit's flagship UCIS and other systems! 🌟";
  if (n.includes('projects') || n.includes('grid')) return "A directory of Harshit's case studies and live projects. 📁";
  if (n.includes('stats')) return "Track live engineering stats, contributions, and solved problems! 📊";
  if (n.includes('leetcode')) return "LeetCode Analytics! Harshit loves data structures & algorithms. 🧩";
  if (n.includes('github') || n.includes('heatmap')) return "Check out the green GitHub calendar! Continuous commit momentum. 🟩";
  if (n.includes('contact') || n.includes('form') || n.includes('direct')) return "Need to hire or collaborate? Send a message directly! ✉️";
  return `You are looking at the ${name}. Tell me if you want to explore this!`;
};

// ── Roaming Logic ──────────────────────────────────────────────────────────
function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

export default function RoamingHarshit() {
  const pathname = usePathname();
  const router = useRouter();
  
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

  // Guided Tour State
  const [tourStep, setTourStep] = useState<number>(-1);

  // Delivery Animation State (Contact Page)
  const [deliveryMode, setDeliveryMode] = useState<'none' | 'submitting' | 'delivering'>('none');
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

  const showQuip = useCallback((m: Mood) => {
    const arr = QUIPS[m];
    triggerBubble(arr[Math.floor(Math.random() * arr.length)]);
  }, [triggerBubble]);

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

  // ── Event Listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Guided Tour Trigger
    const handleStartTour = () => {
      setTourStep(0);
      if (pathname !== '/') {
        router.push('/');
      }
    };

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
      
      // Jump vertical bounce
      let jumpCount = 0;
      const jumpInterval = setInterval(() => {
        setPos(p => {
          let jumpY = p.y;
          if (jumpCount < 10) jumpY += 10;
          else if (jumpCount < 20) jumpY -= 10;
          return { x: p.x, y: Math.max(20, jumpY) };
        });
        jumpCount++;
        if (jumpCount >= 20) {
          clearInterval(jumpInterval);
          setMood('walk');
        }
      }, 25);

      const isAlt = document.documentElement.classList.toggle('theme-alt');
      localStorage.setItem('theme-selection', isAlt ? 'alt' : 'default');
    };

    // 4. Contact Form Animation triggers
    const handleFormSubmitting = () => {
      setMood('walk');
      triggerBubble('Packaging your message... 📦', 3000);
      
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
      triggerBubble('Running to deliver! 🏃‍♂️💨', 2000);
      
      setTimeout(() => {
        setDeliveryMode('none');
        setMood('dancing');
        triggerBubble('Transmission delivered! 🚀', 4000);
        setTimeout(() => setMood('walk'), 4000);
      }, 2500);
    };

    window.addEventListener('start-mascot-tour', handleStartTour);
    window.addEventListener('mascot-goto', handleMascotGoto);
    window.addEventListener('mascot-toggle-theme', handleToggleTheme);
    window.addEventListener('mascot-form-submitting', handleFormSubmitting);
    window.addEventListener('mascot-form-success', handleFormSuccess);

    const handleMascotSpeak = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.text) {
        setMood('waving');
        triggerBubble(customEvent.detail.text, 6000);
        setTimeout(() => setMood('walk'), 6000);
      }
    };
    window.addEventListener('mascot-speak', handleMascotSpeak);

    return () => {
      window.removeEventListener('start-mascot-tour', handleStartTour);
      window.removeEventListener('mascot-goto', handleMascotGoto);
      window.removeEventListener('mascot-toggle-theme', handleToggleTheme);
      window.removeEventListener('mascot-form-submitting', handleFormSubmitting);
      window.removeEventListener('mascot-form-success', handleFormSuccess);
      window.removeEventListener('mascot-speak', handleMascotSpeak);
    };
  }, [pathname, router, triggerBubble]);

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


  // Contextual Hover State
  const [hoveredContext, setHoveredContext] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cursor Tracking & Context Detection ──────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
            // Let the animation loop know we are docking to this element
            dockedElementRef.current = closestInteractive as HTMLElement;
            setMood('pointing');
            
            // Set talking quip based on element
            setTimeout(() => {
              setMood('talking');
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
  }, [hoveredContext, triggerBubble]);

  // ── Smooth Roaming/Easing loop ─────────────────────────────────────────────
  useEffect(() => {
    lastTime.current = performance.now();
    
    const update = () => {
      try {
        const time = performance.now();
        const delta = Math.min((time - lastTime.current) / 16.666, 3);
        lastTime.current = time;

        const current = posRef.current;
        let nextY = current.y + (targetY - current.y) * 0.08 * delta;
        if (Math.abs(targetY - nextY) < 1) nextY = targetY;

        let nextX = current.x;

        // ── Priority Easing coordinates based on Mode ──
        if (deliveryMode === 'submitting' && deliveryTarget) {
          // Fast glide to contact form
          nextX = current.x + (deliveryTarget.x - current.x) * 0.15 * delta;
          nextY = current.y + (deliveryTarget.y - current.y) * 0.15 * delta;
          setMood('typing');
        } else if (deliveryMode === 'delivering') {
          // Run off-screen to the right
          nextX = current.x + (-150 - current.x) * 0.18 * delta;
          setDir('right');
          setMood('walk');
        } else if (overrideTarget) {
          // Chat Action Easing
          nextX = current.x + (overrideTarget.x - current.x) * 0.0065 * delta;
          nextY = current.y + (overrideTarget.y - current.y) * 0.0065 * delta;
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
        } else if (dockedElementRef.current && !overrideTarget && tourStep < 0 && deliveryMode === 'none') {
          // Easing to docked component next to it
          const el = dockedElementRef.current;
          const rect = el.getBoundingClientRect();
          
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

        } else if (cursorPosRef.current && (time - lastMouseMoveTimeRef.current < 4000) && !overrideTarget && tourStep < 0 && deliveryMode === 'none') {
          // Follow cursor with dynamic animations
          const cPos = cursorPosRef.current;
          const dist = Math.hypot(cPos.x - current.x, cPos.y - current.y);
          
          let speed = 0.0055;
          const isInteracting = mood === 'pointing' || mood === 'talking' || mood === 'thinking' || mood === 'typing';

          if (dist > 300) {
             speed = 0.0095;
             if (!isInteracting && mood !== 'flying') setMood('flying');
          } else if (dist > 150) {
             speed = 0.0075;
             if (!isInteracting && mood !== 'running' && mood !== 'flying') setMood('running');
          } else if (dist > 20) {
             speed = 0.0055;
             if (!isInteracting && mood !== 'walk') setMood('walk');
          } else {
             if (!isInteracting && mood !== 'idle') setMood('idle');
          }

          nextX = current.x + (cPos.x - current.x) * speed * delta;
          nextY = current.y + (cPos.y - current.y) * speed * delta;

          if (cPos.x > current.x + 1) setDir('left');
          else if (cPos.x < current.x - 1) setDir('right');

        } else {
          // Normal random horizontal stroll (Stroller mode when mouse is inactive)
          nextX = current.x + vel.current.x * delta;
          const charWidth = 84;
          const padding = 20;
          const maxW = typeof window !== 'undefined' ? window.innerWidth : 1200;

          const minX = padding;
          const sidebarWidth = maxW > 1024 ? 280 : 0;
          const maxX = maxW - sidebarWidth - charWidth - padding;

          if (nextX > maxX) {
            nextX = maxX;
            vel.current.x = -Math.abs(vel.current.x);
            setDir('right');
          } else if (nextX < minX) {
            nextX = minX;
            vel.current.x = Math.abs(vel.current.x);
            setDir('left');
          }

          // Return to walk mood if we were doing cursor animations but are now stroll-roaming
          const isMascotInteracting = mood === 'pointing' || mood === 'talking' || mood === 'thinking' || mood === 'typing' || mood === 'waving' || mood === 'sleeping';
          if (!isMascotInteracting && mood !== 'walk') {
            setMood('walk');
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
      } catch (err) {
        console.error("Mascot update loop error:", err);
      }

      frameId.current = requestAnimationFrame(update);
    };

    frameId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId.current);
  }, [mood, targetY, tourStep, pathname, deliveryMode, deliveryTarget, overrideTarget, triggerBubble]);

  // Periodic level jumping when in walk mode
  useEffect(() => {
    const interval = setInterval(() => {
      // Disable jumping when cursor tracking or docking is active
      const mouseActive = cursorPosRef.current && (performance.now() - lastMouseMoveTimeRef.current < 4000);
      if (mouseActive || dockedElementRef.current || isHovered.current || tourStep >= 0 || deliveryMode !== 'none' || overrideTarget) return;
      
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
      } else {
        setMood('walk');
      }
    }, randomBetween(10000, 18000));

    return () => clearInterval(interval);
  }, [targetY, tourStep, deliveryMode, overrideTarget]);

  // React to Route Navigation changes
  useEffect(() => {
    if (!pathname || tourStep >= 0) return;
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    
    setPos({ x: 40, y: 20 });
    posRef.current = { x: 40, y: 20 };
    setMood('waving');
    
    idleTimer.current = setTimeout(() => {
      setMood('walk');
    }, 1500);
  }, [pathname, tourStep, triggerBubble]);

  // Frame animations ticker - 120ms tick
  useEffect(() => {
    const ticker = setInterval(() => {
      setStep((s) => (s + 1) % 100);
    }, 120);
    return () => clearInterval(ticker);
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
        style={{
          position: 'fixed',
          right: 0,
          bottom: 0,
          zIndex: 99999,
          userSelect: 'none',
          pointerEvents: 'none', // Let clicks pass through empty spaces
          transform: `translate3d(-${pos.x}px, -${pos.y}px, 0)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}
        >
        {/* Speech / Tour bubble */}
        <AnimatePresence>
          {((showBubble || showTourBubble) && pos.x <= 45 && pos.y <= 25) && (
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
                left: dir === 'right' ? '0' : 'auto',
                right: dir === 'left'  ? '0' : 'auto',
                marginBottom: '6px',
                background: '#18181b',
                border: '1px solid rgba(99,102,241,0.7)',
                borderRadius: '12px',
                padding: showTourBubble ? '12px 16px' : '5px 10px',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                width: showTourBubble ? '260px' : 'auto',
                whiteSpace: showTourBubble ? 'normal' : 'nowrap',
                fontFamily: 'monospace',
                fontWeight: 600,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                pointerEvents: 'auto', // Enable pointer events for bubble interaction
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
                      Skip
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextTourStep();
                      }}
                      style={{
                        background: 'var(--accent)', border: 'none', color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      {tourStep === TOUR_STEPS.length - 1 ? 'Finish 🎉' : 'Next →'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>{bubble}</span>
                  {hoveredContext && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.target as HTMLFormElement).elements.namedItem('contextInput') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          // Dispatch event to PortfolioAgent
                          const fullCommand = `Regarding ${hoveredContext}: ${input.value}`;
                          window.dispatchEvent(new CustomEvent('send-agent-message', { detail: { message: fullCommand } }));
                          input.value = '';
                          setHoveredContext(null);
                          setShowBubble(false);
                        }
                      }}
                      style={{ display: 'flex', gap: '4px' }}
                    >
                      <input
                        name="contextInput"
                        placeholder="Tell me what to do..."
                        autoFocus
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          color: '#fff',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: 'var(--accent)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Send
                      </button>
                    </form>
                  )}
                </div>
              )}
              
              <div style={{
                position: 'absolute', bottom: '-5px',
                left: dir === 'right' ? '14px' : 'auto',
                right: dir === 'left'  ? '14px' : 'auto',
                width: '10px', height: '10px',
                background: '#18181b',
                border: '1px solid rgba(99,102,241,0.7)',
                borderTop: 'none', borderLeft: dir === 'right' ? 'none' : undefined,
                borderRight: dir === 'left' ? 'none' : undefined,
                transform: 'rotate(45deg)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (tourStep >= 0 || deliveryMode !== 'none') return; // let tour buttons take clicks
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
            isClimbing={(mood === 'walk' || mood === 'running') && Math.abs(pos.y - (cursorPosRef.current?.y || targetY)) > 40}
          />
        </div>
        </motion.div>
      </div>
    </>
  );
}
