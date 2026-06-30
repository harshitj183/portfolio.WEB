import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const Mermaid = dynamic(() => import('./Mermaid'), { ssr: false });

interface ReadmeViewerProps {
  githubUrl: string;
  onImageClick?: (src: string) => void;
}

const fetcher = async (githubUrl: string) => {
  const urlObj = new URL(githubUrl);
  const pathParts = urlObj.pathname.split('/').filter(Boolean);
  
  if (pathParts.length < 2) {
    throw new Error('Invalid GitHub URL');
  }
  
  const owner = pathParts[0];
  const repo = pathParts[1];
  
  let branch = 'main';
  let response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`);
  
  if (!response.ok) {
    branch = 'master';
    response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`);
  }
  
  if (!response.ok) {
    throw new Error('README not found in this repository.');
  }
  
  const text = await response.text();
  return { text, owner, repo, branch };
};

const ReadmeViewer = ({ githubUrl, onImageClick }: ReadmeViewerProps) => {
  const { data, error, isLoading } = useSWR(githubUrl, fetcher, { revalidateOnFocus: false, dedupingInterval: 600000 });
  const content = data?.text || null;
  const loading = isLoading;
  const repoData = data ? { owner: data.owner, repo: data.repo, branch: data.branch } : null;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: 'var(--accent)' }}>
        <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !content) {
    return null; // Silent fail to fallback to default details in parent
  }

  return (
    <div className="markdown-article" style={{ marginTop: '1rem' }}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ node, src, alt, ...props }) => {
            if (!src) return null;
            // If the image source is relative, prepend the raw github URL
            let imageSrc = src;
            if (typeof src === 'string' && !src.startsWith('http://') && !src.startsWith('https://') && repoData) {
              // Remove leading slash if present
              const cleanPath = src.startsWith('/') ? src.slice(1) : src;
              imageSrc = `https://raw.githubusercontent.com/${repoData.owner}/${repoData.repo}/${repoData.branch}/${cleanPath}`;
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={imageSrc} 
                alt={alt || 'Markdown Image'} 
                loading="lazy"
                decoding="async"
                onClick={() => onImageClick && typeof imageSrc === 'string' && onImageClick(imageSrc)}
                style={{ cursor: onImageClick ? 'zoom-in' : 'default', ...props.style }}
                {...props} 
              />
            );
          },
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match && match[1] === 'mermaid') {
              return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            }
            return <code className={className} {...props}>{children}</code>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ReadmeViewer;
