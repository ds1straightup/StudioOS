'use client';

import { useState, useEffect } from 'react';
import { PenTool } from 'lucide-react';

interface ScratchpadProps {
    bookingId: string;
}

export default function Scratchpad({ bookingId }: ScratchpadProps) {
    const [content, setContent] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(`session_scratchpad_${bookingId}`);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved) setContent(saved);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setContent(newValue);
        localStorage.setItem(`session_scratchpad_${bookingId}`, newValue);
    };

    return (
        <div className="glass-panel overflow-hidden flex flex-col h-full bg-surface/30 border-white/5">
            <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                    <PenTool size={12} /> Scratchpad
                </h3>
                <span className="text-[10px] text-text-muted opacity-50">Auto-saving</span>
            </div>
            <textarea
                value={content}
                onChange={handleChange}
                placeholder="Write lyrics, rhymes, or quick ideas..."
                className="flex-1 w-full bg-transparent p-4 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none resize-none font-mono leading-relaxed custom-scrollbar"
                spellCheck={false}
            />
        </div>
    );
}
