'use client';

import { useState } from 'react';
import { Coffee, User, Clock, AlertCircle } from 'lucide-react';

interface QuickActionProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string;
}

function ActionButton({ label, icon, onClick, color = 'bg-white/5' }: QuickActionProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 ${color} hover:brightness-125 transition-all active:scale-95 gap-2 group`}
        >
            <div className="text-white opacity-70 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white uppercase tracking-wider text-center leading-tight">
                {label}
            </span>
        </button>
    );
}

export default function QuickActions() {
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleAction = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(null), 3000);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide pl-1">Quick Actions</h3>

            {feedback && (
                <div className="bg-green-500/20 text-green-500 border border-green-500/30 p-2 rounded-lg text-center text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    {feedback}
                </div>
            )}

            <div className="grid grid-cols-3 gap-2">
                <ActionButton
                    label="Extend Time"
                    icon={<Clock size={16} />}
                    onClick={() => handleAction("Request sent to Admin")}
                    color="bg-sky-500/10 hover:bg-sky-500/20"
                />
                <ActionButton
                    label="Runner"
                    icon={<User size={16} />}
                    onClick={() => handleAction("Runner notified")}
                    color="bg-purple-500/10 hover:bg-purple-500/20"
                />
                <ActionButton
                    label="Coffee"
                    icon={<Coffee size={16} />}
                    onClick={() => handleAction("Order: 1x Coffee")}
                    color="bg-orange-500/10 hover:bg-orange-500/20"
                />
            </div>

            <button
                onClick={() => handleAction("Emergency Alert Sent")}
                className="w-full flex items-center justify-center gap-2 p-2 mt-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
                <AlertCircle size={14} /> Report Issue
            </button>
        </div>
    );
}
