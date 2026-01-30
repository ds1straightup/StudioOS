'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface WikiAccordionProps {
    title: string;
    content: string;
}

export default function WikiAccordion({ title, content }: WikiAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`glass-panel overflow-hidden transition-all duration-300 ${isOpen ? 'border-void-purple/50 bg-void-purple/5' : 'hover:border-void-purple/30'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-void-purple/20 text-void-purple shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-white/5 text-neutral-500 group-hover:text-white group-hover:bg-white/10'}`}>
                        <FileText size={20} />
                    </div>
                </div>
                {isOpen ? <ChevronUp className="text-void-purple" /> : <ChevronDown className="text-neutral-500 group-hover:text-white" />}
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-2 border-t border-void-purple/10">
                    <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                            {content}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
