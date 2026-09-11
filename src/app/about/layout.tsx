import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/about',
  },
  title: 'About Harshit Jaiswal | Full Stack & AI Engineer',
  description: 'B.Tech CSE at KR Mangalam University & Full Stack Software Developer & AI Agent Engineer. Experience delivering 20+ full-stack web apps and solving 400+ LeetCode DSA.',
  keywords: ['About Harshit Jaiswal', 'Software Engineer Resume', 'SDE Gurugram', 'AI Developer', 'MERN Stack Developer'],
  openGraph: {
    title: 'About Harshit Jaiswal | Full Stack & AI Engineer',
    description: 'Learn about Harshit Jaiswal: B.Tech CSE student, Full Stack Software Developer & AI Agent Engineer with 20+ web builds delivered.',
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
      {children}
    </>
  );
}
