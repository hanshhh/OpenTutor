"use client";

import { BlockMath, InlineMath } from "react-katex";

interface MathRendererProps {
  content: string;
}

export function MathRenderer({ content }: MathRendererProps) {
  // Function to split content into text and math parts
  const renderContent = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Display math (centered equation)
        const math = part.slice(2, -2).trim();
        return (
          <div key={index} className="my-2">
            <BlockMath math={math} errorColor="#ff0000" />
          </div>
        );
      } else if (part.startsWith("$") && part.endsWith("$")) {
        // Inline math
        const math = part.slice(1, -1).trim();
        return <InlineMath key={index} math={math} errorColor="#ff0000" />;
      }
      // Regular text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="text-sm whitespace-pre-wrap break-words">
      {renderContent(content)}
    </div>
  );
}
