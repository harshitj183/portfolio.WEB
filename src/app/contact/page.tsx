'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMail, FiPhone, FiCheckCircle, FiLoader, FiGithub, FiLinkedin, FiCode, FiMapPin, FiCalendar } from 'react-icons/fi';

/* 
  Contact form wired to /api/contact.
*/

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
}

const InputField = ({ label, type = 'text', name, placeholder, required = true, rows }: InputFieldProps) => (
  <div style={{ marginBottom: '2rem' }}>
    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
      {label}
    </label>
    {rows ? (
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '1.2rem 1.4rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--glass-border)',
          borderRadius: '14px', color: '#fff',
          fontSize: '1rem', resize: 'none',
          fontFamily: 'var(--font-primary)'
        }}
      />
    ) : (
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '1.2rem 1.4rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--glass-border)',
          borderRadius: '14px', color: '#fff',
          fontSize: '1rem',
          fontFamily: 'var(--font-primary)'
        }}
      />
    )}
  </div>
);

const Contact = () => {
  const [status, setStatus] = useState<string>('idle'); // idle | sending | success | error
  const formRef = useRef<HTMLFormElement>(null);
  
  // Obfuscate phone number from simple scrapers by building it on client
  const [phoneData, setPhoneData] = useState({ sub: 'Reveal Number', href: '#' });
  useEffect(() => {
    const p1 = '+91';
    const p2 = '97930';
    const p3 = '09391';
    setPhoneData({
      sub: `${p1} ${p2} ${p3}`,
      href: `tel:${p1}${p2}${p3}`
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    window.dispatchEvent(new CustomEvent('mascot-form-submitting'));

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setStatus('success');
        window.dispatchEvent(new CustomEvent('mascot-form-success'));
        formRef.current?.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const contactLinks = [
    {
      icon: <FiMail />,
      label: 'Email',
      sub: 'harshitj183@gmail.com',
      href: 'mailto:harshitj183@gmail.com',
      color: '#818cf8'
    },
    {
      icon: <FiPhone />,
      label: 'Phone',
      sub: phoneData.sub,
      href: phoneData.href,
      color: '#10b981'
    },
    {
      icon: <FiGithub />,
      label: 'GitHub',
      sub: 'github.com/harshitj183',
      href: 'https://github.com/harshitj183',
      color: '#e2e8f0'
    },
    {
      icon: <FiLinkedin />,
      label: 'LinkedIn',
      sub: 'linkedin.com/in/harshitj183',
      href: 'https://linkedin.com/in/harshitj183',
      color: '#0ea5e9'
    },
    {
      icon: <FiCode />,
      label: 'LeetCode',
      sub: 'leetcode.com/u/harshitj183',
      href: 'https://leetcode.com/u/harshitj183/',
      color: '#fbbf24'
    },
    {
      icon: <FiCalendar />,
      label: 'Schedule a Meeting',
      sub: 'Book a 30-min call',
      href: 'https://calendly.com/harshitj183',
      color: '#a78bfa'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '2rem 0' }}
    >
      <h1 className="premium-gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem', letterSpacing: '-0.04em' }}>
        Initialize Connection
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '5rem', maxWidth: '560px' }}>
        Open for full-time roles, strategic collaborations, or specialized engineering consultations. Typically respond within 24 hours.
      </p>

      <div className="grid" style={{ gap: '5rem', alignItems: 'flex-start' }}>
        {/* Contact Links */}
        <div id="direct-channels">
          <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '2rem' }}>
            Direct Channels
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {contactLinks.map(({ icon, label, sub, href, color }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                whileHover={{ x: 8, borderColor: color }}
                className="glass-panel"
                style={{
                  padding: '1.2rem 1.8rem',
                  display: 'flex', alignItems: 'center', gap: '1.4rem',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ color, fontSize: '1.3rem', flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: '0.72rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{label}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{sub}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Location */}
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <FiMapPin className="text-accent" size={16} />
            Delhi NCR, India
          </div>
        </div>

        {/* Form */}
        <div>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel"
                style={{ padding: '4.5rem', textAlign: 'center' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1.5rem' }}
                >
                  <FiCheckCircle />
                </motion.div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Message Delivered</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.7 }}>
                  Transmission parsed. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="premium-action-btn premium-action-primary"
                  style={{ padding: '1.1rem 2.5rem', fontSize: '1rem', cursor: 'pointer', border: 'none', display: 'inline-flex', width: 'auto' }}
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                id="contact-form"
                ref={formRef}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="glass-panel"
                style={{ padding: '3.5rem' }}
              >
                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '2.5rem' }}>
                  Send a Message
                </p>

                {status === 'error' && (
                  <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', padding: '1rem 1.4rem', marginBottom: '2rem', color: '#f87171', fontSize: '0.9rem' }}>
                    ⚠ Transmission failed. Please try emailing directly.
                  </div>
                )}

                <div className="grid" style={{ gap: '0 2rem' }}>
                  <InputField label="Your Name" name="name" placeholder="John Doe" />
                  <InputField label="Email" type="email" name="email" placeholder="you@example.com" />
                </div>
                <InputField label="Subject" name="subject" placeholder="Collaboration opportunity..." />
                <InputField label="Message" name="message" placeholder="Tell me about your project..." rows={5} />

                <button
                  disabled={status === 'sending'}
                  type="submit"
                  className="premium-action-btn premium-action-primary"
                  style={{
                    width: '100%', padding: '1.2rem', fontSize: '1.05rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
                    opacity: status === 'sending' ? 0.7 : 1, border: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  {status === 'sending' ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>
                        <FiLoader size={18} />
                      </motion.span>
                      Transmitting...
                    </>
                  ) : (
                    <><FiSend size={18} /> Send Transmission</>
                  )}
                </button>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <FiCode /> Secured via Next.js Backend
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
