import type { Metadata, Viewport } from 'next';
import RootClientLayout from './RootClientLayout';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import '../index.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.harshitj183.in'),
  alternates: {
    canonical: '/',
  },
  title: 'Harshit Jaiswal | Full Stack Architect & SDE',
  description: 'Software Engineer & AI Architect Harshit Jaiswal. Specializing in MERN stack, LangChain Agentic AI, and scalable microservices. Delivered 20+ client builds.',
  keywords: ['Harshit Jaiswal', 'Software Engineer', 'Full Stack Developer', 'AI Agent Engineer', 'Next.js', 'React', 'Node.js', 'Gurugram'],
  authors: [{ name: 'Harshit Jaiswal' }],
  creator: 'Harshit Jaiswal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.harshitj183.in',
    title: 'Harshit Jaiswal | Software Engineer',
    description: 'Explore the AI-powered engineering portfolio of Harshit Jaiswal. Featuring full-stack web architectures, live metrics, and custom AI agent applications.',
    siteName: 'Harshit Jaiswal Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harshit Jaiswal | Full Stack Architect & SDE',
    description: 'Explore the AI-powered engineering portfolio of Harshit Jaiswal. Featuring full-stack web architectures, live metrics, and custom AI agent applications.',
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
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
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
                    "name": "KR Mangalam University",
                    "sameAs": "https://en.wikipedia.org/wiki/K._R._Mangalam_University"
                  },
                  "knowsAbout": [
                    "Software Engineering",
                    "Full Stack Development",
                    "MERN Stack",
                    "Artificial Intelligence",
                    "React",
                    "Node.js",
                    "Next.js",
                    "TypeScript",
                    "C++",
                    "Docker",
                    "PostgreSQL",
                    "FastAPI",
                    "System Design",
                    "Agentic AI Systems",
                    "LangChain",
                    "LangGraph"
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
                  "description": "Professional engineering portfolio and AI co-pilot hub of Harshit Jaiswal.",
                  "publisher": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "about": {
                    "@id": "https://www.harshitj183.in/#person"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.harshitj183.in/#ucis",
                  "name": "Unified College Interaction System",
                  "alternateName": "UCIS",
                  "description": "A high-performance collegiate communication and notes distribution system built with Next.js, Node.js, and PostgreSQL, deployed in Docker.",
                  "url": "https://www.harshitj183.in/projects",
                  "downloadUrl": "https://github.com/harshitj183/unified-college-interaction-system-web",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "All",
                  "author": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "creator": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "featureList": "Secure notes distribution, calendar sync, real-time messaging, and student feedback systems."
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.harshitj183.in/#conceptcraft",
                  "name": "ConceptCraft AI",
                  "description": "An interactive generative visualization platform parsing descriptive natural language prompts into live mathematical and algorithmic D3.js simulations.",
                  "url": "https://www.harshitj183.in/projects",
                  "downloadUrl": "https://github.com/harshitj183/ConceptCraft-AI",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "All",
                  "author": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "creator": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "featureList": "Generates interactive sandboxes, visual notes, and quizzes from text prompts using D3.js."
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.harshitj183.in/#aiskills",
                  "name": "AI Skills - Global Context Library",
                  "description": "An open-source CLI context library and NPM package for AI coding agents that reduces LLM prompt token consumption.",
                  "url": "https://www.harshitj183.in/projects",
                  "downloadUrl": "https://github.com/harshitj183/ai-skills",
                  "applicationCategory": "DeveloperApplication",
                  "operatingSystem": "All",
                  "author": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "creator": {
                    "@id": "https://www.harshitj183.in/#person"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.harshitj183.in/#chat-app",
                  "name": "Real-time Chat Application",
                  "description": "A persistent multi-user instant messaging system with WebSockets, micro-second delivery speeds, media parsing, and typing indicators.",
                  "url": "https://www.harshitj183.in/projects",
                  "downloadUrl": "https://github.com/harshitj183/realtime-chat-app",
                  "applicationCategory": "CommunicationApplication",
                  "operatingSystem": "All",
                  "author": {
                    "@id": "https://www.harshitj183.in/#person"
                  },
                  "creator": {
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
