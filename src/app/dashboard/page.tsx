'use client';

import React, { useState } from 'react';
import { FiGithub, FiActivity, FiCode, FiZap, FiTrendingUp, FiAward } from 'react-icons/fi';
import Image from 'next/image';
import TiltCard from '@/components/TiltCard';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Stat Card ───────────────────────── */
interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard = ({ label, value, suffix = '', icon, loading = false }: StatCardProps) => (
  <TiltCard
    className="glass-panel"
    style={{
      padding: '2rem',
    }}
    tiltAngle={8}
  >
    <div style={{
      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
    }}>
      <span style={{ color: 'var(--accent)' }}>{icon}</span> {label}
    </div>
    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
      {loading ? '...' : `${value}${suffix}`}
    </div>
  </TiltCard>
);

/* ── GitHub Heatmap ──────────────────── */
interface GithubHeatmapProps {
  data: number[] | null;
  loading: boolean;
}

const GithubHeatmap = ({ data, loading }: GithubHeatmapProps) => {
  const [tooltip, setTooltip] = useState<{ val: number; weekIdx: number; dayIdx: number } | null>(null);
  const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const flatData = data || Array(364).fill(0);

  // Generate month label positions
  const today = new Date();
  const monthLabels: { label: string; weekIndex: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - 11 + i);
    const weekIndex = Math.floor((i / 12) * 52);
    monthLabels.push({ label: months[d.getMonth()], weekIndex });
  }

  return (
    <TiltCard className="glass-panel" style={{ padding: '2rem' }} tiltAngle={3}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
          <FiGithub className="text-accent" /> GitHub Contribution Graph
        </h3>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {tooltip && (
            <span className="pill accent" style={{ fontSize: '0.7rem', textTransform: 'none' }}>
              {tooltip.val} contribution{tooltip.val !== 1 ? 's' : ''}
            </span>
          )}
          <span className="pill" style={{ fontSize: '0.7rem' }}>Past 52 Weeks</span>
        </div>
      </div>

      {/* Scrollable Heatmap wrapper to keep labels and columns synced */}
      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '0.5rem' }}>
        <div style={{ minWidth: '800px' }}>
          {/* Month labels */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', paddingLeft: '2px' }}>
            {Array.from({ length: 52 }).map((_, wi) => {
              const ml = monthLabels.find(m => m.weekIndex === wi);
              return (
                <div key={wi} style={{ width: '12px', fontSize: '0.6rem', color: 'var(--text-secondary)', opacity: ml ? 1 : 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {ml?.label || ''}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 52 }).map((_, weekIdx) => (
              <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dataIdx = weekIdx * 7 + dayIdx;
                  const val = loading ? 0 : (flatData[dataIdx] || 0);
                  const level = Math.min(val, 4);
                  return (
                    <div
                      key={dayIdx}
                      onMouseEnter={() => setTooltip({ val, weekIdx, dayIdx })}
                      onMouseLeave={() => setTooltip(null)}
                      title={`${val} contribution${val !== 1 ? 's' : ''}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: loading ? '#161b22' : colors[level],
                        border: '1px solid rgba(255,255,255,0.02)',
                        cursor: 'default'
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Less</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: c, border: '1px solid rgba(255,255,255,0.05)' }} />
        ))}
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>More</span>
      </div>
    </TiltCard>
  );
};

/* ── LeetCode Badges ──────────────────── */
const LeetcodeBadges = ({ badges, loading, onBadgeClick }: { badges: any[] | null; loading: boolean; onBadgeClick: (b: any) => void }) => {
  if (loading || !badges || badges.length === 0) return null;
  return (
    <TiltCard className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', height: '100%' }} tiltAngle={5}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <FiAward className="text-accent" /> Earned Badges
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
        {badges.map((b: any, i: number) => (
          <div 
            key={i} 
            className="pill glow-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid rgba(255,215,0,0.3)' }}
            onClick={() => onBadgeClick(b)}
            title="Click to view 3D Badge"
          >
            {b.icon && <Image src={b.icon.startsWith('/') ? `https://leetcode.com${b.icon}` : b.icon} alt={b.displayName} width={18} height={18} style={{ objectFit: 'contain' }} />}
            <span style={{ fontSize: '0.8rem', color: '#ffd700' }}>{b.displayName}</span>
          </div>
        ))}
      </div>
    </TiltCard>
  );
};

/* ── LeetCode Heatmap ──────────────────── */
const LeetcodeHeatmap = ({ data, loading }: GithubHeatmapProps) => {
  const [tooltip, setTooltip] = useState<{ val: number; weekIdx: number; dayIdx: number } | null>(null);
  const colors = ['#161b22', '#7e4b22', '#a16207', '#ca8a04', '#eab308'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const flatData = data || Array(364).fill(0);

  const today = new Date();
  const monthLabels: { label: string; weekIndex: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - 11 + i);
    const weekIndex = Math.floor((i / 12) * 52);
    monthLabels.push({ label: months[d.getMonth()], weekIndex });
  }

  return (
    <TiltCard className="glass-panel" style={{ padding: '2rem' }} tiltAngle={3}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
          <FiCode className="text-accent" /> LeetCode Submission Graph
        </h3>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {tooltip && (
            <span className="pill accent" style={{ fontSize: '0.7rem', textTransform: 'none' }}>
              {tooltip.val} submission{tooltip.val !== 1 ? 's' : ''}
            </span>
          )}
          <span className="pill" style={{ fontSize: '0.7rem' }}>Past 52 Weeks</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '0.5rem' }}>
        <div style={{ minWidth: '800px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', paddingLeft: '2px' }}>
            {Array.from({ length: 52 }).map((_, wi) => {
              const ml = monthLabels.find(m => m.weekIndex === wi);
              return (
                <div key={wi} style={{ width: '12px', fontSize: '0.6rem', color: 'var(--text-secondary)', opacity: ml ? 1 : 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {ml?.label || ''}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 52 }).map((_, weekIdx) => (
              <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dataIdx = weekIdx * 7 + dayIdx;
                  const val = loading ? 0 : (flatData[dataIdx] || 0);
                  const level = Math.min(val, 4);
                  return (
                    <div
                      key={dayIdx}
                      onMouseEnter={() => setTooltip({ val, weekIdx, dayIdx })}
                      onMouseLeave={() => setTooltip(null)}
                      title={`${val} submission${val !== 1 ? 's' : ''}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: loading ? '#161b22' : colors[level],
                        border: '1px solid rgba(255,255,255,0.02)',
                        cursor: 'default'
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Less</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: c, border: '1px solid rgba(255,255,255,0.05)' }} />
        ))}
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>More</span>
      </div>
    </TiltCard>
  );
};

/* ── Tech Radar (Clean List) ───────────────── */
const TechRadar = () => {
  const items = [
    { label: 'React', pct: 95, color: '#38bdf8' },
    { label: 'Node/Bun', pct: 90, color: '#4ade80' },
    { label: 'TypeScript', pct: 85, color: '#60a5fa' },
    { label: 'DSA', pct: 82, color: '#a78bfa' },
    { label: 'DevOps', pct: 72, color: '#fb923c' },
    { label: 'MongoDB', pct: 85, color: '#34d399' },
  ];

  return (
    <TiltCard className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }} tiltAngle={5}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        Skill Proficiency
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {items.map(item => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span>{item.label}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%', width: `${item.pct}%`, background: item.color,
                  boxShadow: `0 0 10px ${item.color}80`, borderRadius: '3px'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </TiltCard>
  );
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

const Dashboard = () => {
  const { data, isLoading } = useSWR('/api/stats', fetcher, { revalidateOnFocus: false, dedupingInterval: 3600000 });

  const github = { stats: data?.github?.stats || null, heatmap: data?.github?.heatmap || null, loading: isLoading };
  const leetcode = { stats: data?.leetcode?.stats || null, heatmap: data?.leetcode?.heatmap || null, badges: data?.leetcode?.badges || null, loading: isLoading };
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  const getBadgeGif = (url: string) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('365')) return 'https://assets.leetcode.com/static_assets/marketing/365.gif';
    if (lowerUrl.includes('100')) return 'https://assets.leetcode.com/static_assets/others/100.gif';
    if (lowerUrl.includes('50')) return 'https://assets.leetcode.com/static_assets/others/50.gif';
    return null;
  };


  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>Command Centre</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '4rem', fontSize: '1.1rem' }}>
        Real-time metrics across engineering projects and algorithmic problem-solving.
      </p>

      <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />

      {/* ── SOFTWARE ENGINEERING PROFILE ── */}
      <h2 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        Software Engineering
      </h2>
      <div id="stats-overview" className="grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard label="GitHub Repos" value={github.stats?.repos || 0} icon={<FiGithub />} loading={github.loading} />
        <StatCard label="Projects Shipped" value={24} suffix="+" icon={<FiZap />} />
        <StatCard label="Current Streak" value={github.stats?.streak || 0} suffix=" days" icon={<FiTrendingUp />} loading={github.loading} />
      </div>



      <div id="github-heatmap" style={{ marginBottom: '4rem' }}>
        <GithubHeatmap data={github.heatmap} loading={github.loading} />
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '4rem 0' }} />

      {/* ── PROBLEM SOLVING (DSA) PROFILE ── */}
      <h2 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        Problem Solving (DSA)
      </h2>
      <div className="grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard label="LeetCode Solved" value={leetcode.stats?.solved || 0} icon={<FiCode />} loading={leetcode.loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        <TiltCard id="leetcode-distribution" className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }} tiltAngle={5}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FiActivity className="text-accent" /> LeetCode Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { label: 'Easy', count: leetcode.stats?.easySolved || 0, color: '#10b981', total: leetcode.stats?.totalEasy || 350 },
              { label: 'Medium', count: leetcode.stats?.mediumSolved || 0, color: '#fbbf24', total: leetcode.stats?.totalMedium || 350 },
              { label: 'Hard', count: leetcode.stats?.hardSolved || 0, color: '#ef4444', total: leetcode.stats?.totalHard || 350 },
            ].map((cat, i) => {
              const percentage = leetcode.loading ? 0 : Math.round((cat.count / cat.total) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.label} ({cat.count})</span>
                    <span style={{ fontWeight: 700, color: cat.color }}>{percentage}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{ height: '100%', width: `${percentage}%`, background: cat.color, borderRadius: '4px' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </TiltCard>

        <div>
          <LeetcodeBadges badges={leetcode.badges} loading={leetcode.loading} onBadgeClick={setSelectedBadge} />
        </div>
      </div>

      <div id="leetcode-heatmap" style={{ marginBottom: '3rem' }}>
        <LeetcodeHeatmap data={leetcode.heatmap} loading={leetcode.loading} />
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {getBadgeGif(selectedBadge.icon) ? (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,215,0,0.3)', filter: 'blur(30px)', zIndex: 0 }} />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <img 
                    src={getBadgeGif(selectedBadge.icon)!} 
                    alt={selectedBadge.displayName} 
                    style={{ width: 220, height: 220, objectFit: 'contain' }} 
                  />
                </motion.div>
              </div>
            ) : (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,215,0,0.3)', filter: 'blur(35px)', zIndex: 0 }} />
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  style={{ perspective: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform', position: 'relative', zIndex: 1 }}
                >
                  {selectedBadge.icon && (
                    <Image 
                      src={selectedBadge.icon.startsWith('/') ? `https://leetcode.com${selectedBadge.icon}` : selectedBadge.icon} 
                      alt={selectedBadge.displayName} 
                      width={220} height={220} 
                      style={{ objectFit: 'contain' }} 
                    />
                  )}
                </motion.div>
              </div>
            )}
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginTop: '2.5rem', color: '#ffd700', fontSize: '2.2rem', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(255,215,0,0.5)', textAlign: 'center' }}
            >
              {selectedBadge.displayName}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              style={{ color: '#fff', marginTop: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Click anywhere to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
