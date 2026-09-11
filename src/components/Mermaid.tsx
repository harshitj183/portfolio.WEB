'use client';

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const reactId = useId();
  const elementId = `mermaid-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
    });
    
    // Render the chart
    mermaid.render(elementId, chart)
      .then((result) => {
        setSvg(result.svg);
      })
      .catch((error) => {
        console.error('Mermaid rendering error:', error);
        setSvg(`<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 8px;">Failed to render Mermaid diagram</div>`);
      });
  }, [chart]);

  return <div className="mermaid-chart" dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;
