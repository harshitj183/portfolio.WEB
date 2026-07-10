import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Harshit Jaiswal | Hire Me',
  description: 'Get in touch with Harshit Jaiswal for full-time roles, freelance projects, or collaboration in Full Stack Development and AI engineering.',
  keywords: ['Contact Harshit Jaiswal', 'Hire Software Engineer', 'Freelance Web Developer', 'Hire MERN Developer'],
  openGraph: {
    title: 'Contact Harshit Jaiswal | Hire Me',
    description: 'Get in touch with Harshit Jaiswal for full-time roles, freelance projects, or collaboration.',
    url: 'https://www.harshitj183.in/contact',
  }
};

export default function ContactLayout({
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
            "@type": "ContactPage",
            "url": "https://www.harshitj183.in/contact",
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
