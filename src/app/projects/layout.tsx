import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/projects',
  },
  title: 'Engineering Projects | Harshit Jaiswal',
  description: 'Showcasing flagship projects by Harshit Jaiswal, including ConceptCraft AI simulation sandboxes, UCIS college system, and the AI Skills CLI NPM context library.',
  keywords: ['Software Projects', 'MERN Stack Projects', 'AI Open Source', 'React Applications', 'Node.js', 'GitHub', 'Harshit Jaiswal'],
  openGraph: {
    title: 'Engineering Projects | Harshit Jaiswal',
    description: 'Explore flagship software applications by Harshit Jaiswal: ConceptCraft AI, UCIS notes portal, and the AI Skills NPM context library for coding agents.',
    url: 'https://www.harshitj183.in/projects',
  }
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": "Unified College Interaction System",
                  "url": "https://github.com/harshitj183/unified-college-interaction-system-web",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "All"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": "AI Skills - Global Context Library",
                  "url": "https://github.com/harshitj183/ai-skills",
                  "applicationCategory": "DeveloperApplication",
                  "operatingSystem": "All"
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": "Real-time Chat Application",
                  "url": "https://github.com/harshitj183/realtime-chat-app",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "All"
                }
              },
              {
                "@type": "ListItem",
                "position": 4,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": "ConceptCraft AI",
                  "url": "https://github.com/harshitj183/ConceptCraft-AI",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "All"
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
