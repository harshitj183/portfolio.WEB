import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/dashboard',
  },
  title: 'Live Engineering Metrics & LeetCode Analytics | Harshit Jaiswal',
  description: 'Real-time engineering analytics of Harshit Jaiswal. Track GitHub contributions, active repository commits, and LeetCode stats (400+ DSA algorithmic solutions).',
  keywords: ['Harshit Jaiswal Stats', 'LeetCode Metrics', 'GitHub Heatmap', 'Engineering Analytics', 'MERN Stack Developer Stats'],
  openGraph: {
    title: 'Live Engineering Metrics & LeetCode Analytics | Harshit Jaiswal',
    description: 'Track live engineering metrics, GitHub activity history, and LeetCode stats showing 400+ algorithmic DSA problem solutions solved by Harshit Jaiswal.',
    url: 'https://www.harshitj183.in/dashboard',
  }
};

export default function DashboardLayout({
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
