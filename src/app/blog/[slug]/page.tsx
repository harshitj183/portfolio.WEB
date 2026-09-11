'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiClock, FiGithub, FiExternalLink, FiBookOpen, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { BLOG_POSTS } from '@/data/blogs';
import Mermaid from '@/components/Mermaid';
import TiltCard from '@/components/TiltCard';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article style={{ padding: '2rem 0 6rem 0', minHeight: '100vh', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link
          href="/blog"
          className="pill"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <FiArrowLeft size={16} /> Back to all articles
        </Link>
      </div>

      {/* Header Info */}
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <span className="pill accent" style={{ fontSize: '0.75rem' }}>
            {post.category}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiCalendar size={14} /> {post.date}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>•</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiClock size={14} /> {post.readTime}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.2rem', fontWeight: 800 }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
          {post.subtitle}
        </p>

        {/* Author Bio Bar */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.8rem', flexWrap: 'wrap', gap: '1rem', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Image
              src="https://avatars.githubusercontent.com/u/76927137?v=4"
              alt="Harshit Jaiswal"
              width={48}
              height={48}
              style={{ borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Harshit Jaiswal</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Full Stack SDE & AI Agent Engineer</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {post.githubLink && (
              <a
                href={post.githubLink}
                target="_blank"
                rel="noreferrer"
                className="pill"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
              >
                <FiGithub size={14} /> Code Repository
              </a>
            )}
            {post.projectLink && (
              <Link
                href={post.projectLink}
                className="pill accent"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
              >
                <FiExternalLink size={14} /> View Project
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '18px', overflow: 'hidden', marginBottom: '3.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 900px"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Table of Contents Widget */}
      <section aria-label="Table of Contents" className="glass-panel" style={{ marginBottom: '3.5rem', padding: '1.8rem 2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
          <FiBookOpen size={18} /> Architecture Table of Contents
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
          {post.tableOfContents.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                className="hover-text-white"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Article Content & Architecture Graph */}
      <div className="markdown-article" style={{ fontSize: '1.08rem', lineHeight: 1.85, color: '#d4d4d8' }}>
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />

        {/* Dynamic Mermaid Architectural Flowchart */}
        {post.mermaidChart && (
          <section id="mermaid-flow" style={{ margin: '3.5rem 0' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiLayers size={16} /> Interactive Architecture Flowchart
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Live Dynamic Graph</span>
              </div>
              <Mermaid chart={post.mermaidChart} />
            </div>
          </section>
        )}

        {/* Engineering Takeaways Box */}
        <div className="glass-panel" style={{ marginTop: '4rem', padding: '2.2rem', borderLeft: '4px solid var(--accent)', borderRadius: '0 16px 16px 0' }}>
          <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCheckCircle style={{ color: '#10b981' }} /> Key Engineering Takeaways
          </h4>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <li>Separation of concerns across specialized micro-agents guarantees deterministic evaluation.</li>
            <li>Optimistic UI reconciliation ensures zero perceptible network delay for interactive clients.</li>
            <li>Pruning syntax trees at compile time drastically reduces prompt payloads and cloud infrastructure expenses.</li>
          </ul>
        </div>
      </div>

      {/* Tags section */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {post.tags.map((tag) => (
          <span key={tag} className="pill" style={{ fontSize: '0.8rem' }}>
            #{tag}
          </span>
        ))}
      </div>

      {/* More Articles */}
      <section aria-label="Related Deep Dives" style={{ marginTop: '5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>More Engineering Deep Dives</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {otherPosts.map((op) => (
            <TiltCard key={op.slug} className="glass-panel" style={{ padding: '1.8rem' }} tiltAngle={3}>
              <span className="pill accent" style={{ fontSize: '0.7rem', marginBottom: '0.8rem', display: 'inline-block' }}>
                {op.category}
              </span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                <Link href={`/blog/${op.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                  {op.title}
                </Link>
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
                {op.summary}
              </p>
              <Link href={`/blog/${op.slug}`} style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                Read Article →
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>
    </article>
  );
}
