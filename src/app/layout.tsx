import type { Metadata, Viewport } from 'next';
import RootClientLayout from './RootClientLayout';
import Script from 'next/script';
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xanwtsvolu");
          `}
        </Script>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
