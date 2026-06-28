import type { Metadata, Viewport } from 'next';
import RootClientLayout from './RootClientLayout';
import Script from 'next/script';
import '../index.css';

export const metadata: Metadata = {
  title: 'Harshit Jaiswal | Full Stack Architect & SDE',
  description: 'Elite Software Engineering Portfolio of Harshit Jaiswal. Building high-performance AI tools, modern web architectures, and scalable full-stack applications.',
  keywords: ['Harshit Jaiswal', 'Software Engineer', 'Full Stack Developer', 'AI Agent Engineer', 'Next.js', 'React', 'Node.js', 'Gurugram'],
  authors: [{ name: 'Harshit Jaiswal' }],
  creator: 'Harshit Jaiswal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.harshitj183.in',
    title: 'Harshit Jaiswal | Software Engineer',
    description: 'Explore the interactive AI-powered portfolio of Harshit Jaiswal, SDE and AI Architect.',
    siteName: 'Harshit Jaiswal Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harshit Jaiswal | Full Stack Architect & SDE',
    description: 'Explore the interactive AI-powered portfolio of Harshit Jaiswal.',
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Harshit Jaiswal",
              "url": "https://www.harshitj183.in",
              "image": "https://avatars.githubusercontent.com/u/76927137?v=4",
              "jobTitle": "Full Stack Architect & SDE",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance & Open Source"
              },
              "sameAs": [
                "https://github.com/harshitj183",
                "https://linkedin.com/in/harshitj183",
                "https://leetcode.com/u/harshitj183"
              ]
            })
          }}
        />
      </head>
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
