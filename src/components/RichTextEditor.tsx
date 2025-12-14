import React, { useRef } from 'react';
import { Bold, Italic, List, Radical } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className, rows = 3 }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormat = (startTag: string, endTag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + startTag + selectedText + endTag + text.substring(end);

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + startTag.length, end + startTag.length);
        }, 0);
    };

    return (
        <div className={`border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 ${className}`}>
            <div className="flex items-center gap-1 bg-slate-50 border-b border-slate-200 p-2">
                <button
                    type="button"
                    onClick={() => insertFormat('**', '**')}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => insertFormat('*', '*')}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => insertFormat('\n- ', '')}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button
                    type="button"
                    onClick={() => insertFormat('$$', '$$')}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                    title="Math Equation (LaTeX)"
                >
                    <Radical className="h-4 w-4" />
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 focus:outline-none resize-y"
            />
        </div>
    );
};

export default RichTextEditor;
