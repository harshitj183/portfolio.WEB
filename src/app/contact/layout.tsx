import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/contact',
  },
  title: 'Contact Harshit Jaiswal | Hire Me',
  description: 'Hire Harshit Jaiswal for full-time SDE roles, MERN stack freelance builds, or AI systems engineering. Contact via email, phone (+91 97930 09391), or LinkedIn.',
  keywords: ['Contact Harshit Jaiswal', 'Hire Software Engineer', 'Freelance Web Developer', 'Hire MERN Developer'],
  openGraph: {
    title: 'Contact Harshit Jaiswal | Hire Me',
    description: 'Hire Harshit Jaiswal for full-time SDE roles, freelance full-stack builds, or Agentic AI systems. Get in touch via email, phone, or direct social links.',
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
