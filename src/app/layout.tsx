import type { Metadata, Viewport } from 'next';
import RootClientLayout from './RootClientLayout';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import '../index.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
});

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
        {/* Preconnect to important origins to reduce DNS/TCP latency */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="preconnect" href="https://assets.leetcode.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://www.harshitj183.in/#person",
                  "name": "Harshit Jaiswal",
                  "url": "https://www.harshitj183.in",
                  "image": "https://avatars.githubusercontent.com/u/76927137?v=4",
                  "jobTitle": "Full Stack Architect & SDE",
                  "description": "Harshit Jaiswal is a Software Development Engineer (SDE) and AI Architect specializing in Full Stack Web Development, MERN stack, and Artificial Intelligence.",
                  "gender": "Male",
                  "nationality": "Indian",
                  "email": "harshitj183@gmail.com",
                  "alumniOf": {
                    "@type": "CollegeOrUniversity",
                    "name": "KR Mangalam University"
                  },
                  "knowsAbout": [
                    "Software Engineering",
                    "Full Stack Development",
                    "MERN Stack",
                    "Artificial Intelligence",
                    "React",
                    "Node.js",
                    "Next.js"
                  ],
                  "worksFor": {
                    "@type": "Organization",
                    "name": "Freelance & Open Source"
                  },
                  "sameAs": [
                    "https://github.com/harshitj183",
                    "https://linkedin.com/in/harshitj183",
                    "https://leetcode.com/u/harshitj183"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.harshitj183.in/#website",
                  "url": "https://www.harshitj183.in",
                  "name": "Harshit Jaiswal Portfolio",
                  "publisher": {
                    "@id": "https://www.harshitj183.in/#person"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.variable} style={{ margin: 0, background: '#09090b', color: '#fff' }}>
        <Script id="microsoft-clarity" strategy="lazyOnload">
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
