'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiClock, FiCalendar, FiArrowRight, FiTag, FiSearch, FiCode, FiExternalLink, FiLayers, FiCpu } from 'react-icons/fi';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';
import TiltCard from '@/components/TiltCard';

const CATEGORIES = ['All', 'AI Systems', 'Distributed Systems', 'Developer Tools', 'Full Stack'] as const;

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main style={{ padding: '2rem 0', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <span className="pill accent" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiBookOpen size={14} /> Engineering Notes
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            System Architecture & Production Research
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
          Technical Deep-Dives
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.7 }}>
          Dissecting the architecture, multi-agent AI pipelines, distributed state systems, and compiler optimizations behind my production software projects.
        </p>
      </header>

      {/* Filter & Search Bar */}
      <section aria-label="Article Filters" style={{ marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '100px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(16px)',
                  boxShadow: isActive ? '0 4px 18px var(--accent-glow)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 260px', maxWidth: '380px' }}>
          <FiSearch size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search architecture or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: '100px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              fontSize: '0.85rem',
              backdropFilter: 'blur(16px)',
            }}
          />
        </div>
      </section>

      {/* Articles Grid */}
      <section aria-label="Technical Articles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
              >
                <TiltCard className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }} tiltAngle={4}>
                  {/* Article Cover Image */}
                  <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />
                    <span style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.3rem 0.7rem', borderRadius: '100px'
                    }}>
                      {post.category}
                    </span>
                  </div>

                  {/* Article Content */}
                  <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Meta info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FiCalendar size={13} /> {post.date}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FiClock size={13} /> {post.readTime}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.3rem', lineHeight: 1.35, marginBottom: '0.8rem', fontWeight: 700 }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem', flex: 1 }}>
                      {post.summary}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="pill" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Read Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.2rem', marginTop: 'auto' }}>
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--accent)',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                        }}
                      >
                        Read Deep Dive <FiArrowRight size={16} />
                      </Link>

                      {post.projectLink && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {post.projectTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FiCode size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
            <h3>No articles found</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              No engineering articles match your query &quot;{searchQuery}&quot;. Try another term.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
