import type { Metadata, Viewport } from 'next';
import RootClientLayout from './RootClientLayout';
import '../index.css';

export const metadata: Metadata = {
  title: 'Harshit Jaiswal | Full Stack Architect & SDE',
  description: 'Elite Software Engineering Portfolio of Harshit Jaiswal',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#09090b', color: '#fff' }}>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
