'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiPlay, FiCompass } from 'react-icons/fi';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  isLive?: boolean;
  isAction?: boolean;
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
  | 'book_meeting'
  | 'execute_js';

// Local Fallback Rule-Based Engine (Outputs JSON with reply & action)
function getLocalAgentResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  // Helper to format response
  const makeJson = (reply: string, actionObj: any = null) => {
    return JSON.stringify({ reply, action: actionObj });
  };

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

    return makeJson(`Got it! I've created the custom command '${trigger}'.`, {
      action: 'create_custom_command',
      trigger: trigger,
      steps: [actionStep]
    });
  }

  // Check saved custom commands
  try {
    const saved = localStorage.getItem('custom_commands');
    if (saved) {
      const commands = JSON.parse(saved);
      if (commands[input]) {
        return makeJson("Running your custom command...", {
          action: 'run_custom_command',
          trigger: input
        });
      }
    }
  } catch {}

  // 2. Exact triggers/keywords for actions
  if (input.includes('resume') || input.includes(' cv')) {
    return makeJson("Opening Harshit's resume for you...", { action: 'open_resume' });
  }
  if (input.includes('github')) {
    return makeJson("Sure thing, opening Harshit's GitHub profile...", { action: 'open_github' });
  }
  if (input.includes('linkedin')) {
    return makeJson("Navigating to Harshit's LinkedIn profile...", { action: 'open_linkedin' });
  }
  if (input.includes('tour') || input.includes('guide')) {
    return makeJson("Let's take a quick interactive tour of the site! 🚀", { action: 'start_portfolio_tour' });
  }
  if (input.includes('meeting') || input.includes('calendly') || input.includes('schedule')) {
    return makeJson("Opening Calendly booker. Let's arrange a sync! 📅", { action: 'book_meeting' });
  }
  if (input.includes('featured') || input.includes('flagship')) {
    return makeJson("Taking you to the flagship Unified College Interaction System project!", { action: 'show_featured_project' });
  }
  if (input.includes('timeline') || input.includes('experience')) {
    return makeJson("Navigating to Harshit's professional experience logs...", { action: 'goto_experience' });
  }
  if (input.includes('skill')) {
    return makeJson("Here are Harshit's core skills and technologies...", { action: 'goto_skills' });
  }
  if (input.includes('contact') || input.includes('email') || input.includes('hire')) {
    return makeJson("Direct connection channel initialized. Let's get in touch!", { action: 'goto_contact' });
  }
  if (input.includes('about') || input.includes('who are you') || input.includes('developer')) {
    if (input.includes('project') || input.includes('work')) {
      return makeJson("Heading over to the Projects section...", { action: 'goto_projects' });
    }
    return makeJson("Let's head over to the About section to find out more!", { action: 'goto_about' });
  }
  if (input.includes('project') || input.includes('work') || input.includes('portfolio')) {
    if (input.includes('react')) {
      return makeJson("Filtering Harshit's projects for React work...", { action: 'filter_projects', technology: 'React' });
    }
    if (input.includes('next')) {
      return makeJson("Filtering projects for Next.js work...", { action: 'filter_projects', technology: 'Next.js' });
    }
    if (input.includes('ai') || input.includes('agent')) {
      return makeJson("Filtering projects to show AI Agent & Tooling work...", { action: 'filter_projects', technology: 'AI' });
    }
    return makeJson("Navigating to the projects dossier...", { action: 'goto_projects' });
  }
  if (input === 'home' || input === 'start') {
    return makeJson("Heading back to the main command center...", { action: 'goto_home' });
  }
  if (input.includes('theme') || input.includes('dark') || input.includes('light')) {
    return makeJson("Toggling the ambient theme...", { action: 'toggle_theme' });
  }

  // 3. Normal informational responses
  if (input.includes('hello') || input.includes('hi ') || input.includes('hey')) {
    return makeJson("Hey there! 👋 I'm your technical co-pilot. I can take you on a tour, open GitHub/Resume, or filter projects. Try saying: 'Show Next.js work' or 'Start tour'!");
  }
  if (input.includes('who') && (input.includes('you') || input.includes('mascot'))) {
    return makeJson("I'm the Portfolio Agent — Harshit's AI mascot. I represent Harshit and help recruiters explore his engineering portfolio. Ask me to open his resume or show his projects!");
  }
  if (input.includes('stack') || input.includes('technology') || input.includes('languages')) {
    return makeJson("Harshit builds with Next.js, React, Node.js, Bun.js, TypeScript, PostgreSQL, and MongoDB. He also builds custom AI tooling!");
  }
  if (input.includes('education') || input.includes('college') || input.includes('university')) {
    return makeJson("Harshit is pursuing a B.Tech in CSE at KR Mangalam University (2023-2027) with a stellar record in Project-Based Learning.");
  }

  // Default fallback conversational reply
  return makeJson("I am running in local fallback mode (AI unreachable). Try commands like: 'Show Next.js work', 'Toggle theme', 'Open Resume', 'Start tour', or 'Book a meeting'.");
}

export default function PortfolioAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'agent', text: "Hello recruiter! 👋 I am Harshit's AI co-pilot. Ask me for a 'tour', 'resume', or to see 'projects'!", isLive: false }
  ]);
  const [inputVal, setInputVal] = useState('');
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleActionExecution = (actionObj: any) => {
    const { action, technology, project_name, trigger, steps } = actionObj;

    // Collapsible Action indicator helper
    const showToast = (txt: string) => {
      window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: `[Action] ${txt}` } }));
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
        window.dispatchEvent(new CustomEvent('mascot-toggle-theme'));
        break;
      case 'execute_js':
        showToast("Executing Unlimited Power (JS Injection)");
        try {
          // eslint-disable-next-line no-eval
          if (actionObj.code) eval(actionObj.code);
        } catch (e) {
          console.error('Failed to execute AI JS code:', e);
        }
        break;
      case 'start_portfolio_tour':
        showToast("Initializing Guided Interactive Tour...");
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('start-mascot-tour'));
        break;
      case 'create_custom_command':
        try {
          const saved = localStorage.getItem('custom_commands') || '{}';
          const commands = JSON.parse(saved);
          commands[trigger.toLowerCase().trim()] = steps;
          localStorage.setItem('custom_commands', JSON.stringify(commands));
          window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: `💾 Custom command saved! Try typing: "${trigger}"` } }));
        } catch {
          window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: `⚠ Failed to save custom command.` } }));
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
    setInputVal('');
    
    window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: 'Thinking...' } }));

    const processResponse = (rawResponse: string, isLive: boolean) => {
      try {
        const json = JSON.parse(rawResponse);
        if (json.reply) {
          window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: json.reply } }));
        }
        if (json.action) {
          handleActionExecution(json.action);
        }
      } catch {
        window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: rawResponse } }));
      }
    };

    // Call API route with rule-based fallback
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error('API Key missing or Server Error');

      const data = await res.json();
      processResponse(data.response.trim(), true);
    } catch {
      // Rule-based client-side fallback
      const fallbackResponse = getLocalAgentResponse(userText);
      processResponse(fallbackResponse, false);
    }
  };

  // Listen to toggle events from the walking avatar and programmatic messages
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    const handleProgrammaticMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        setIsOpen(true);
        // Simulate a form submission with the message
        setInputVal(customEvent.detail.message);
        setTimeout(() => {
           // We need to call the logic directly since we don't have an event object to pass to handleSend
           processProgrammaticMessage(customEvent.detail.message);
        }, 100);
      }
    };

    const processProgrammaticMessage = async (userText: string) => {
        setInputVal('');

        const processResponse = (rawResponse: string, isLive: boolean) => {
          try {
            const json = JSON.parse(rawResponse);
            if (json.reply) {
              window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: json.reply } }));
            }
            if (json.action) {
              handleActionExecution(json.action);
            }
          } catch {
            window.dispatchEvent(new CustomEvent('mascot-speak', { detail: { text: rawResponse } }));
          }
        };

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
          });

          if (!res.ok) throw new Error('API Key missing or Server Error');

          const data = await res.json();
          processResponse(data.response.trim(), true);
        } catch {
          const fallbackResponse = getLocalAgentResponse(userText);
          processResponse(fallbackResponse, false);
        }
    };


    window.addEventListener('toggle-portfolio-agent', handleToggle);
    window.addEventListener('send-agent-message', handleProgrammaticMessage);

    return () => {
      window.removeEventListener('toggle-portfolio-agent', handleToggle);
      window.removeEventListener('send-agent-message', handleProgrammaticMessage);
    };
  }, [handleActionExecution]);



  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'fixed',
              bottom: '25px',
              right: '25px',
              width: '350px',
              zIndex: 99998,
            }}
          >
            {/* Input Form only */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', background: '#09090b', padding: '0.8rem', borderRadius: '16px', border: '1px solid var(--accent)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask me anything..."
                autoFocus
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
    </>
  );
}
