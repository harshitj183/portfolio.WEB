'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiFile, FiFileText, FiCode, FiTerminal, FiChevronRight, FiChevronDown, FiDatabase, FiImage } from 'react-icons/fi';

interface ProjectFileTreeProps {
  githubUrl?: string | null;
}

interface GithubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
}

interface FileNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  children: FileNode[];
  isOpen?: boolean;
}

const MOCK_TREE: FileNode[] = [
  {
    name: 'src', path: 'src', type: 'tree', isOpen: true, children: [
      {
        name: 'app', path: 'src/app', type: 'tree', isOpen: true, children: [
          { name: 'layout.tsx', path: 'src/app/layout.tsx', type: 'blob', children: [] },
          { name: 'page.tsx', path: 'src/app/page.tsx', type: 'blob', children: [] },
        ]
      },
      {
        name: 'components', path: 'src/components', type: 'tree', isOpen: true, children: [
          { name: 'CoreEngine.tsx', path: 'src/components/CoreEngine.tsx', type: 'blob', children: [] },
          { name: 'NeuralNet.ts', path: 'src/components/NeuralNet.ts', type: 'blob', children: [] }
        ]
      }
    ]
  },
  { name: 'public', path: 'public', type: 'tree', isOpen: false, children: [] },
  { name: 'package.json', path: 'package.json', type: 'blob', children: [] },
  { name: 'README.md', path: 'README.md', type: 'blob', children: [] },
  { name: 'next.config.js', path: 'next.config.js', type: 'blob', children: [] }
];

const getFileIcon = (filename: string) => {
  if (filename.endsWith('.ts') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.jsx')) return <FiCode color="#60a5fa" />;
  if (filename.endsWith('.json')) return <FiDatabase color="#fbbf24" />;
  if (filename.endsWith('.md')) return <FiFileText color="#9ca3af" />;
  if (filename.match(/\.(png|jpe?g|gif|svg|ico)$/i)) return <FiImage color="#34d399" />;
  if (filename.includes('config') || filename.includes('.env')) return <FiTerminal color="#f87171" />;
  return <FiFile color="#9ca3af" />;
};

export default function ProjectFileTree({ githubUrl }: ProjectFileTreeProps) {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // File Viewer States
  const [activeFile, setActiveFile] = useState<{ name: string, path: string, content?: string, url?: string, isImage?: boolean } | null>(null);
  const [fetchingFile, setFetchingFile] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTree = async () => {
      setLoading(true);
      if (!githubUrl || !githubUrl.includes('github.com')) {
        if (isMounted) {
          setTree(MOCK_TREE);
          setLoading(false);
        }
        return;
      }

      try {
        const parts = githubUrl.split('github.com/')[1].split('/');
        const owner = parts[0];
        const repo = parts[1];

        // Try main first, then master
        let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`);
        if (!res.ok) {
          res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
        }

        if (res.ok) {
          const data = await res.json();
          const items: GithubTreeItem[] = data.tree;
          
          // Build nested tree structure
          const root: FileNode[] = [];
          const map = new Map<string, FileNode>();

          // Don't sort the flat array, just take the first 1500 items to prevent freezing
          const limitedItems = items.slice(0, 1500);

          for (const item of limitedItems) {
            const parts = item.path.split('/');
            const name = parts[parts.length - 1];
            
            const node: FileNode = {
              name,
              path: item.path,
              type: item.type,
              children: [],
              isOpen: parts.length <= 2 // Auto-open top levels
            };

            map.set(item.path, node);

            if (parts.length === 1) {
              root.push(node);
            } else {
              const parentPath = parts.slice(0, -1).join('/');
              const parentNode = map.get(parentPath);
              if (parentNode) {
                parentNode.children.push(node);
              }
            }
          }
          
          // Sort children recursively: folders first, then files alphabetically
          const sortNodes = (nodes: FileNode[]) => {
            nodes.sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'tree' ? -1 : 1;
            });
            nodes.forEach(node => {
              if (node.children.length > 0) sortNodes(node.children);
            });
          };
          sortNodes(root);

          if (isMounted) setTree(root.length > 0 ? root : MOCK_TREE);
        } else {
          if (isMounted) setTree(MOCK_TREE);
        }
      } catch (err) {
        if (isMounted) setTree(MOCK_TREE);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTree();
    return () => { isMounted = false; };
  }, [githubUrl]);

  const toggleNode = (nodePath: string) => {
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === nodePath) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setTree(updateTree(tree));
  };

  const handleFileClick = async (node: FileNode) => {
    if (node.type !== 'blob') return;
    setFetchingFile(true);
    
    if (!githubUrl || !githubUrl.includes('github.com')) {
      // Mock File Content
      setTimeout(() => {
        setActiveFile({
          name: node.name,
          path: node.path,
          content: `// Source Code for ${node.name}\n\nimport React from 'react';\n\nexport default function ${node.name.split('.')[0]}() {\n  return (\n    <div>\n      <h1>Hello World from ${node.name}</h1>\n    </div>\n  );\n}\n`
        });
        setFetchingFile(false);
      }, 500);
      return;
    }

    try {
      const parts = githubUrl.split('github.com/')[1].split('/');
      const owner = parts[0];
      const repo = parts[1];
      
      const isImage = node.name.match(/\.(png|jpe?g|gif|svg|ico)$/i);
      
      if (isImage) {
        // Just set the URL for images
        setActiveFile({ 
          name: node.name, 
          path: node.path, 
          isImage: true, 
          url: `https://raw.githubusercontent.com/${owner}/${repo}/main/${node.path}` 
        });
        setFetchingFile(false);
        return;
      }

      const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${node.path}`);
      if (res.ok) {
        const text = await res.text();
        setActiveFile({ name: node.name, path: node.path, content: text, isImage: false });
      } else {
        const res2 = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/${node.path}`);
        if (res2.ok) {
          const text2 = await res2.text();
          setActiveFile({ name: node.name, path: node.path, content: text2, isImage: false });
        } else {
          setActiveFile({ name: node.name, path: node.path, content: `// Error loading file: ${node.name}`, isImage: false });
        }
      }
    } catch (e) {
      setActiveFile({ name: node.name, path: node.path, content: `// Error loading file: ${node.name}` });
    } finally {
      setFetchingFile(false);
    }
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          onClick={() => node.type === 'tree' ? toggleNode(node.path) : handleFileClick(node)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.5rem', paddingLeft: `${depth * 12 + 8}px`,
            cursor: 'pointer',
            borderRadius: '4px',
            color: node.type === 'tree' ? '#e5e7eb' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            transition: 'background 0.2s',
            fontFamily: 'monospace'
          }}
          className="file-tree-item"
        >
          {node.type === 'tree' ? (
            <>
              {node.isOpen ? <FiChevronDown size={14} color="#9ca3af" /> : <FiChevronRight size={14} color="#9ca3af" />}
              <FiFolder size={14} color="#fbbf24" style={{ fill: node.isOpen ? '#fbbf24' : 'none' }} />
            </>
          ) : (
            <span style={{ marginLeft: '18px', display: 'flex' }}>
              {getFileIcon(node.name)}
            </span>
          )}
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {node.name}
          </span>
        </div>
        
        <AnimatePresence>
          {node.type === 'tree' && node.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              {renderTree(node.children, depth + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

  return (
    <div className="file-tree-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: activeFile ? '65vw' : '320px', maxWidth: activeFile ? '900px' : '320px', transition: 'width 0.3s ease, max-width 0.3s ease' }}>
      <div style={{
        padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(10,10,10,0.3)'
      }}>
        <FiTerminal size={18} color="var(--accent)" />
        <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeFile ? activeFile.name : 'Repository Source'}
        </h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: activeFile ? '0' : '1rem 0.5rem', scrollbarWidth: 'thin', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {activeFile ? (
            <motion.div
              key="file-viewer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <button 
                  onClick={() => setActiveFile(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                >
                  <FiChevronRight style={{ transform: 'rotate(180deg)' }} /> Back to tree
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'auto', background: activeFile.isImage ? 'transparent' : '#0d0d0d', display: 'flex', justifyContent: activeFile.isImage ? 'center' : 'flex-start', alignItems: activeFile.isImage ? 'center' : 'flex-start' }}>
                {activeFile.isImage ? (
                  <img src={activeFile.url} alt={activeFile.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                ) : (
                  <pre style={{ margin: 0, padding: '1.5rem', fontSize: '0.85rem', fontFamily: 'monospace', color: '#e5e7eb', width: '100%' }}>
                    <code>{activeFile.content}</code>
                  </pre>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file-tree"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {loading || fetchingFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                      style={{ height: '18px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: `${Math.random() * 40 + 40}%` }}
                    />
                  ))}
                  {fetchingFile && <div style={{ color: 'var(--accent)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>Fetching file content...</div>}
                </div>
              ) : (
                renderTree(tree)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
