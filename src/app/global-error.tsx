'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#0c0c0e', 
        color: '#f4f4f5', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: 'radial-gradient(circle at center, #1a1a24 0%, #0c0c0e 100%)'
      }}>
        <div style={{
          padding: '3rem',
          maxWidth: '600px',
          width: '90%',
          background: 'rgba(20,20,25,0.8)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.15)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            color: '#ef4444', 
            fontSize: '3rem', 
            marginTop: 0, 
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
          }}>
            Critical System Failure
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            A fatal exception has occurred in the main process. The application architecture could not recover automatically.
          </p>
          
          <div style={{ background: '#000', padding: '1rem', borderRadius: '6px', textAlign: 'left', fontFamily: 'monospace', marginBottom: '2.5rem', borderLeft: '3px solid #ef4444', overflowX: 'auto' }}>
            <span style={{ color: '#ef4444' }}>ERR_DIGEST:</span> {error.digest || 'Unknown segment fault'}
            <br />
            <span style={{ color: '#a1a1aa' }}>[Please contact the developer or initiate a manual reboot]</span>
          </div>

          <button
            onClick={() => reset()}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'background 0.2s',
              boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
          >
            Initiate Reboot
          </button>
        </div>
      </body>
    </html>
  );
}
