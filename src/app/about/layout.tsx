import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Harshit Jaiswal | Full Stack & AI Engineer',
  description: 'Learn about Harshit Jaiswal, a highly skilled Full Stack SDE and AI Agent Engineer specializing in modern architectures and high-performance applications.',
  keywords: ['About Harshit Jaiswal', 'Software Engineer Resume', 'SDE Gurugram', 'AI Developer', 'MERN Stack Developer'],
  openGraph: {
    title: 'About Harshit Jaiswal | Full Stack & AI Engineer',
    description: 'Learn about Harshit Jaiswal, a highly skilled Full Stack SDE and AI Agent Engineer.',
    url: 'https://www.harshitj183.in/about',
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "mainEntity": {
                "@id": "https://www.harshitj183.in/#person"
              }
            })
          }}
        />
      </head>
      {children}
    </>
  );
}
