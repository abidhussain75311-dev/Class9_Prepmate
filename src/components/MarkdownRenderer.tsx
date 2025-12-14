import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
    children: string;
    className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children, className }) => {
    return (
        <div className={`prose prose-slate max-w-none ${className || ''}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Override paragraph to avoid unnecessary margins in some contexts if needed
                    // or styling specific elements
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
