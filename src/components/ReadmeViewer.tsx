import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ReadmeViewerProps {
  githubUrl: string;
}

const ReadmeViewer = ({ githubUrl }: ReadmeViewerProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [repoData, setRepoData] = useState<{ owner: string; repo: string; branch: string } | null>(null);

  useEffect(() => {
    const fetchReadme = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Parse GitHub URL to get owner/repo
        // e.g., https://github.com/harshitj183/unified-college-interaction-system-web
        const urlObj = new URL(githubUrl);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        
        if (pathParts.length < 2) {
          throw new Error('Invalid GitHub URL');
        }
        
        const owner = pathParts[0];
        const repo = pathParts[1];
        
        // Try to fetch main branch first, then master
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
        setContent(text);
        setRepoData({ owner, repo, branch });
      } catch (err: any) {
        setError(err.message || 'Failed to load README');
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [githubUrl]);

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
              <img src={imageSrc} alt={alt || 'Markdown Image'} {...props} />
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ReadmeViewer;
