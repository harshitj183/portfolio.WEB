import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Blog | Harshit Jaiswal',
  description: 'Technical deep-dives, system designs, multi-agent AI pipelines, and distributed real-time architectures authored by Harshit Jaiswal.',
  openGraph: {
    title: 'Engineering Blog | Harshit Jaiswal',
    description: 'Technical deep-dives, system designs, multi-agent AI pipelines, and distributed architectures authored by Harshit Jaiswal.',
    url: 'https://www.harshitj183.in/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
