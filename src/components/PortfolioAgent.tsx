'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiPlay, FiCompass } from 'react-icons/fi';

interface Message {
  sender: 'user' | 'agent';
  text: string;
}

// Allowed actions enum / type
type AllowedAction =
  | 'goto_home'
  | 'goto_about'
  | 'goto_projects'
  | 'goto_skills'
  | 'goto_experience'
  | 'goto_contact'
  | 'open_resume'
  | 'open_github'
  | 'open_linkedin'
  | 'start_portfolio_tour'
  | 'filter_projects'
  | 'highlight_project'
  | 'search_projects'
  | 'toggle_theme'
  | 'show_timeline'
  | 'show_featured_project'
  | 'book_meeting';

// Local Fallback Rule-Based Engine
function getLocalAgentResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  // 1. Custom Command Creation Pattern: "When I say X, do Y"
  const createCmdMatch = input.match(/when\s+i\s+say\s+["']?([^"']+)["']?,\s*(?:do|show|run|go\s+to)\s+["']?([^"']+)["']?/i);
  if (createCmdMatch) {
    const trigger = createCmdMatch[1].trim();
    const target = createCmdMatch[2].trim();
    let actionStep: any = { action: 'goto_home' };

    if (target.includes('project') || target.includes('work')) {
      actionStep = { action: 'goto_projects' };
    } else if (target.includes('about') || target.includes('who')) {
      actionStep = { action: 'goto_about' };
    } else if (target.includes('contact') || target.includes('hire')) {
      actionStep = { action: 'goto_contact' };
    } else if (target.includes('resume') || target.includes('cv')) {
      actionStep = { action: 'open_resume' };
    } else if (target.includes('github')) {
      actionStep = { action: 'open_github' };
    } else if (target.includes('linkedin')) {
      actionStep = { action: 'open_linkedin' };
    }

    return JSON.stringify({
      action: 'create_custom_command',
      trigger: trigger,
      steps: [actionStep]
    }, null, 2);
  }

  // Check saved custom commands
  try {
    const saved = localStorage.getItem('custom_commands');
    if (saved) {
      const commands = JSON.parse(saved);
      if (commands[input]) {
        return JSON.stringify({
          action: 'run_custom_command',
          trigger: input
        }, null, 2);
      }
    }
  } catch {}

  // 2. Exact triggers/keywords for actions
  if (input.includes('resume') || input.includes(' cv')) {
    return JSON.stringify({ action: 'open_resume' });
  }
  if (input.includes('github')) {
    return JSON.stringify({ action: 'open_github' });
  }
  if (input.includes('linkedin')) {
    return JSON.stringify({ action: 'open_linkedin' });
  }
  if (input.includes('tour') || input.includes('guide')) {
    return JSON.stringify({ action: 'start_portfolio_tour' });
  }
  if (input.includes('meeting') || input.includes('calendly') || input.includes('schedule')) {
    return JSON.stringify({ action: 'book_meeting' });
  }
  if (input.includes('featured') || input.includes('flagship')) {
    return JSON.stringify({ action: 'show_featured_project' });
  }
  if (input.includes('timeline') || input.includes('experience')) {
    return JSON.stringify({ action: 'goto_experience' });
  }
  if (input.includes('skill')) {
    return JSON.stringify({ action: 'goto_skills' });
  }
  if (input.includes('contact') || input.includes('email') || input.includes('hire')) {
    return JSON.stringify({ action: 'goto_contact' });
  }
  if (input.includes('about') || input.includes('who are you') || input.includes('developer')) {
    if (input.includes('project') || input.includes('work')) {
      return JSON.stringify({ action: 'goto_projects' });
    }
    return JSON.stringify({ action: 'goto_about' });
  }
  if (input.includes('project') || input.includes('work') || input.includes('portfolio')) {
    if (input.includes('react')) {
      return JSON.stringify({ action: 'filter_projects', technology: 'React' });
    }
    if (input.includes('next')) {
      return JSON.stringify({ action: 'filter_projects', technology: 'Next.js' });
    }
    if (input.includes('ai') || input.includes('agent')) {
      return JSON.stringify({ action: 'filter_projects', technology: 'AI' });
    }
    return JSON.stringify({ action: 'goto_projects' });
  }
  if (input === 'home' || input === 'start') {
    return JSON.stringify({ action: 'goto_home' });
  }

  // 3. Normal informational responses
  if (input.includes('hello') || input.includes('hi ') || input.includes('hey')) {
    return "Hey there! 👋 I'm your technical co-pilot. I can take you on a tour, open GitHub/Resume, or filter projects. Try saying: 'Show Next.js work' or 'Start tour'!";
  }
  if (input.includes('who') && (input.includes('you') || input.includes('mascot'))) {
    return "I'm the Portfolio Agent — Harshit's AI mascot. I represent Harshit and help recruiters explore his engineering portfolio. Ask me to open his resume or show his projects!";
  }
  if (input.includes('stack') || input.includes('technology') || input.includes('languages')) {
    return "Harshit builds with Next.js, React, Node.js, Bun.js, TypeScript, PostgreSQL, and MongoDB. He also builds custom AI tooling!";
  }
  if (input.includes('education') || input.includes('college') || input.includes('university')) {
    return "Harshit is pursuing a B.Tech in CSE at KR Mangalam University (2023-2027) with a stellar record in Project-Based Learning.";
  }

  // Default fallback conversational reply
  return "I'm here to help! I can understand commands like 'Show Next.js work', 'Open Resume', 'Start tour', or 'Book a meeting'. Let me know what you need!";
}

export default function PortfolioAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'agent', text: "Hello recruiter! 👋 I am Harshit's AI co-pilot. Ask me for a 'tour', 'resume', or to see 'projects'!" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [tourStep, setTourStep] = useState(-1);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleActionExecution = (actionObj: any) => {
    const { action, technology, project_name, trigger, steps } = actionObj;

    // Toast indicator helper
    const showToast = (txt: string) => {
      setMessages(prev => [...prev, { sender: 'agent', text: `✨ [System Action]: ${txt}` }]);
    };

    switch (action as AllowedAction | 'create_custom_command' | 'run_custom_command') {
      case 'goto_home':
        showToast("Navigating to Home");
        router.push('/');
        break;
      case 'goto_about':
        showToast("Navigating to About Page");
        router.push('/about');
        break;
      case 'goto_projects':
        showToast("Navigating to Projects");
        router.push('/projects');
        break;
      case 'goto_skills':
        showToast("Showing Arsenal / Skills");
        router.push('/about#skills');
        setTimeout(() => {
          document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        break;
      case 'goto_experience':
        showToast("Showing Experience Timeline");
        router.push('/about#experience');
        setTimeout(() => {
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        break;
      case 'goto_contact':
        showToast("Opening Connection Panel");
        router.push('/contact');
        break;
      case 'open_resume':
        showToast("Opening Harshit's Resume");
        window.open('/resume.pdf', '_blank');
        break;
      case 'open_github':
        showToast("Opening GitHub profile");
        window.open('https://github.com/harshitj183', '_blank');
        break;
      case 'open_linkedin':
        showToast("Opening LinkedIn profile");
        window.open('https://linkedin.com/in/harshitj183', '_blank');
        break;
      case 'book_meeting':
        showToast("Redirecting to Calendly meeting booker");
        window.open('https://calendly.com/harshitj183', '_blank');
        break;
      case 'filter_projects':
        showToast(`Filtering projects by: ${technology || 'category'}`);
        router.push('/projects');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('portfolio-action', { detail: actionObj }));
        }, 400);
        break;
      case 'highlight_project':
        showToast(`Locating project: ${project_name}`);
        router.push('/projects');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('portfolio-action', { detail: actionObj }));
        }, 400);
        break;
      case 'show_featured_project':
        showToast("Showing Featured Flagship Project");
        router.push('/');
        setTimeout(() => {
          document.getElementById('featured-project')?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
        break;
      case 'toggle_theme':
        showToast("Toggling ambient visual alignment");
        break;
      case 'start_portfolio_tour':
        showToast("Initializing Guided Interactive Tour...");
        setIsOpen(false);
        setTourStep(0);
        break;
      case 'create_custom_command':
        try {
          const saved = localStorage.getItem('custom_commands') || '{}';
          const commands = JSON.parse(saved);
          commands[trigger.toLowerCase().trim()] = steps;
          localStorage.setItem('custom_commands', JSON.stringify(commands));
          setMessages(prev => [...prev, { sender: 'agent', text: `💾 Custom command saved! Try typing: "${trigger}"` }]);
        } catch {
          setMessages(prev => [...prev, { sender: 'agent', text: `⚠ Failed to save custom command.` }]);
        }
        break;
      case 'run_custom_command':
        try {
          const saved = localStorage.getItem('custom_commands');
          if (saved) {
            const commands = JSON.parse(saved);
            const runSteps = commands[trigger.toLowerCase().trim()];
            if (runSteps && Array.isArray(runSteps)) {
              showToast(`Executing custom command chain: "${trigger}"`);
              runSteps.forEach((step: any, idx: number) => {
                setTimeout(() => handleActionExecution(step), idx * 1000);
              });
            }
          }
        } catch {}
        break;
      default:
        break;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');

    // Call API route with rule-based fallback
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error('API Key missing or Server Error');

      const data = await res.json();
      const rawResponse = data.response.trim();

      // Check if response is valid JSON action
      if (rawResponse.startsWith('{') && rawResponse.endsWith('}')) {
        try {
          const actionObj = JSON.parse(rawResponse);
          if (actionObj.action) {
            handleActionExecution(actionObj);
            return;
          }
        } catch {}
      }

      setMessages(prev => [...prev, { sender: 'agent', text: rawResponse }]);
    } catch {
      // Rule-based client-side fallback
      const fallbackResponse = getLocalAgentResponse(userText);

      if (fallbackResponse.startsWith('{') && fallbackResponse.endsWith('}')) {
        try {
          const actionObj = JSON.parse(fallbackResponse);
          if (actionObj.action) {
            handleActionExecution(actionObj);
            return;
          }
        } catch {}
      }

      setMessages(prev => [...prev, { sender: 'agent', text: fallbackResponse }]);
    }
  };

  // Guided Tour steps
  const tourSteps = [
    { title: 'The Sidebar Navigation', desc: 'Find quick links to the home page, project directories, resume, and direct socials here.', selector: '.sidebar' },
    { title: 'Resume Download & CV', desc: 'Recruiters can download Harshit\'s updated Professional PDF CV with one-click here.', selector: 'a[download]' },
    { title: 'Interactive Command Palette', desc: 'Press Ctrl+K (or Cmd+K) anywhere on the website to open the command search window.', selector: '.app-container' },
    { title: 'Available Status Badge', desc: 'Harshit is currently active and looking for SDE, AI Agent, or Full-stack roles.', selector: '.pill' }
  ];

  return (
    <>
      {/* ── AI Mascot Floating Orb/Bubble ── */}
      <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 99999 }}>
        <button
          onClick={() => setIsOpen(o => !o)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent) 0%, #4338ca 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.45), 0 0 15px var(--accent-glow)',
            outline: 'none',
            position: 'relative'
          }}
          title="Talk to Portfolio AI Agent"
        >
          {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
          {/* Animated pulsing light */}
          <span style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.7
          }} />
        </button>
      </div>

      {/* CSS Animation keyframe injected dynamically */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>

      {/* ── Chat Panel Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="glass-panel"
            style={{
              position: 'fixed',
              bottom: '95px',
              right: '25px',
              width: '350px',
              height: '480px',
              zIndex: 99998,
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              border: '1px solid rgba(99,102,241,0.3)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.2rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(99, 102, 241, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#fff' }}>Portfolio Agent</h3>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>AI Mascot & Co-Pilot</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.sender === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                    color: m.sender === 'user' ? '#fff' : '#e2e8f0',
                    fontSize: '0.82rem',
                    lineHeight: '1.4',
                    fontFamily: m.text.startsWith('✨') ? 'monospace' : 'var(--font-primary)'
                  }}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: '#09090b' }}>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask for resume or portfolio tour..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.6rem 0.8rem',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FiSend size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Guided Tour Banner/Overlay ── */}
      <AnimatePresence>
        {tourStep >= 0 && tourStep < tourSteps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{
                maxWidth: '420px',
                width: '100%',
                padding: '2.5rem',
                border: '1px solid var(--accent)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(99,102,241,0.3)'
              }}
            >
              <div style={{ display: 'inline-flex', padding: '0.8rem', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                <FiCompass size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff' }}>
                {tourSteps[tourStep].title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {tourSteps[tourStep].desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Step {tourStep + 1} of {tourSteps.length}
                </span>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    onClick={() => setTourStep(-1)}
                    className="pill"
                    style={{ border: 'none', padding: '0.4rem 1rem', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => {
                      const next = tourStep + 1;
                      setTourStep(next === tourSteps.length ? -1 : next);
                    }}
                    className="pill accent"
                    style={{ border: 'none', padding: '0.4rem 1rem', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'} <FiPlay size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
