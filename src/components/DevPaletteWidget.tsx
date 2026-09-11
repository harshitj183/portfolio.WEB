'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiCopy, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

interface Palette {
  name: string;
  bgColor: string;
  bgSecondary: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  glassBorderColor: string;
  glassBorderAlpha: number;
  accentGlowColor: string;
  accentGlowAlpha: number;
}

const PRESETS: Palette[] = [
  {
    name: 'Cyberpunk Indigo',
    bgColor: '#0c0c0e',
    bgSecondary: '#16161a',
    borderColor: '#27272a',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    accent: '#6366f1',
    glassBorderColor: '#ffffff',
    glassBorderAlpha: 0.08,
    accentGlowColor: '#6366f1',
    accentGlowAlpha: 0.35,
  },
  {
    name: 'Synthwave Rose',
    bgColor: '#0b071e',
    bgSecondary: '#140d34',
    borderColor: '#2e1a47',
    textPrimary: '#fdfafb',
    textSecondary: '#b8a2c4',
    accent: '#f43f5e',
    glassBorderColor: '#f43f5e',
    glassBorderAlpha: 0.15,
    accentGlowColor: '#f43f5e',
    accentGlowAlpha: 0.35,
  },
  {
    name: 'Emerald Matrix',
    bgColor: '#050e09',
    bgSecondary: '#0d1a12',
    borderColor: '#142d1e',
    textPrimary: '#ecfdf5',
    textSecondary: '#6ee7b7',
    accent: '#10b981',
    glassBorderColor: '#10b981',
    glassBorderAlpha: 0.15,
    accentGlowColor: '#10b981',
    accentGlowAlpha: 0.35,
  },
  {
    name: 'Nordic Frost',
    bgColor: '#0f172a',
    bgSecondary: '#1e293b',
    borderColor: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#38bdf8',
    glassBorderColor: '#38bdf8',
    glassBorderAlpha: 0.15,
    accentGlowColor: '#38bdf8',
    accentGlowAlpha: 0.35,
  },
  {
    name: 'Golden Luxury',
    bgColor: '#0a0908',
    bgSecondary: '#141210',
    borderColor: '#27221e',
    textPrimary: '#f7f5f3',
    textSecondary: '#d4af37',
    accent: '#e5a93b',
    glassBorderColor: '#e5a93b',
    glassBorderAlpha: 0.15,
    accentGlowColor: '#e5a93b',
    accentGlowAlpha: 0.35,
  }
];

function hexToRgba(hex: string, alpha: number) {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function DevPaletteWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Custom theme state initialized from Default Cyberpunk
  const [theme, setTheme] = useState<Palette>(PRESETS[0]);

  // Synchronize state with CSS custom variables on change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bgColor);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--glass-border', hexToRgba(theme.glassBorderColor, theme.glassBorderAlpha));
    root.style.setProperty('--accent-glow', hexToRgba(theme.accentGlowColor, theme.accentGlowAlpha));
  }, [theme]);

  const handlePresetSelect = (preset: Palette) => {
    setTheme(preset);
  };

  const handleColorChange = (key: keyof Palette, value: string | number) => {
    setTheme(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateCssSnippet = () => {
    return `:root {
  --bg-color: ${theme.bgColor};
  --bg-secondary: ${theme.bgSecondary};
  --border-color: ${theme.borderColor};
  --text-primary: ${theme.textPrimary};
  --text-secondary: ${theme.textSecondary};
  --accent: ${theme.accent};
  --glass-border: ${hexToRgba(theme.glassBorderColor, theme.glassBorderAlpha)};
  --accent-glow: ${hexToRgba(theme.accentGlowColor, theme.accentGlowAlpha)};
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCssSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999999,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
          color: '#fff',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto'
        }}
        title="Open Theme Lab Sandbox"
      >
        <FiSliders size={20} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '380px',
              maxWidth: '90vw',
              background: 'rgba(12, 12, 24, 0.78)',
              backdropFilter: 'blur(36px) saturate(200%)',
              WebkitBackdropFilter: 'blur(36px) saturate(200%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '-15px 0 50px rgba(0,0,0,0.65), inset 1px 0 0 rgba(255,255,255,0.08)',
              padding: '2rem',
              zIndex: 99999998,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-primary)',
              overflowY: 'auto',
              pointerEvents: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DEV THEME LAB</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tune & export premium color combinations</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '5px' }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.8rem' }}>PRESET THEMES</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handlePresetSelect(p)}
                    style={{
                      background: theme.name === p.name ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: theme.name === p.name ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '0.75rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.accent }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block' }}>REAL-TIME ADJUSTER</span>

              {/* Background Color */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Background Color</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" value={theme.bgColor} onChange={(e) => handleColorChange('bgColor', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                  <input type="color" value={theme.bgColor} onChange={(e) => handleColorChange('bgColor', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Sidebar Background */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Sidebar / Cards</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" value={theme.bgSecondary} onChange={(e) => handleColorChange('bgSecondary', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                  <input type="color" value={theme.bgSecondary} onChange={(e) => handleColorChange('bgSecondary', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Accent Color */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#e4e4e7', fontWeight: 600 }}>Accent (Focus Color)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" value={theme.accent} onChange={(e) => handleColorChange('accent', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center', fontWeight: 600 }} />
                  <input type="color" value={theme.accent} onChange={(e) => handleColorChange('accent', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Border Color */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Standard Borders</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" value={theme.borderColor} onChange={(e) => handleColorChange('borderColor', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                  <input type="color" value={theme.borderColor} onChange={(e) => handleColorChange('borderColor', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Text Primary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Text Primary</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" value={theme.textPrimary} onChange={(e) => handleColorChange('textPrimary', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                  <input type="color" value={theme.textPrimary} onChange={(e) => handleColorChange('textPrimary', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Text Secondary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Text Secondary</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="text" value={theme.textSecondary} onChange={(e) => handleColorChange('textSecondary', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                  <input type="color" value={theme.textSecondary} onChange={(e) => handleColorChange('textSecondary', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>

              {/* Glass Border with Opacity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Glass Border Color</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="text" value={theme.glassBorderColor} onChange={(e) => handleColorChange('glassBorderColor', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                    <input type="color" value={theme.glassBorderColor} onChange={(e) => handleColorChange('glassBorderColor', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', width: '60px' }}>Opacity</span>
                  <input type="range" min="0" max="1" step="0.01" value={theme.glassBorderAlpha} onChange={(e) => handleColorChange('glassBorderAlpha', parseFloat(e.target.value))} style={{ flex: 1, accentColor: theme.accent }} />
                  <span style={{ fontSize: '0.7rem', width: '30px', textAlign: 'right' }}>{Math.round(theme.glassBorderAlpha * 100)}%</span>
                </div>
              </div>

              {/* Accent Glow with Opacity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#e4e4e7' }}>Accent Glow Shadow</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="text" value={theme.accentGlowColor} onChange={(e) => handleColorChange('accentGlowColor', e.target.value)} style={{ width: '70px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '3px 6px', textAlign: 'center' }} />
                    <input type="color" value={theme.accentGlowColor} onChange={(e) => handleColorChange('accentGlowColor', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', width: '60px' }}>Opacity</span>
                  <input type="range" min="0" max="1" step="0.01" value={theme.accentGlowAlpha} onChange={(e) => handleColorChange('accentGlowAlpha', parseFloat(e.target.value))} style={{ flex: 1, accentColor: theme.accent }} />
                  <span style={{ fontSize: '0.7rem', width: '30px', textAlign: 'right' }}>{Math.round(theme.accentGlowAlpha * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Export Code snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>CSS CONFIG EXPORT</span>
              <pre style={{
                margin: 0,
                padding: '12px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                color: '#10b981',
                marginBottom: '1rem',
                lineHeight: 1.4
              }}>
                {generateCssSnippet()}
              </pre>

              <button
                onClick={handleCopyCode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: copied ? '#10b981' : 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  width: '100%'
                }}
              >
                {copied ? (
                  <>
                    <FiCheck /> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy CSS Variables
                  </>
                )}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
