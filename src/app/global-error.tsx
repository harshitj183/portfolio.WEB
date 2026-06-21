'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#09090b', color: '#fff', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h2>
        <button onClick={reset} style={{ padding: '0.6rem 1.4rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
