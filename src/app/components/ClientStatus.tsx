'use client';

import { useState } from 'react';
import { updateClientStatus } from '@/app/actions/clients';
import { Loader2 } from 'lucide-react';

interface ClientStatusProps {
    clientId: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    { value: 'Inquiry', label: 'Inquiry', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    { value: 'Session Active', label: 'Session Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
    { value: 'Payment Received', label: 'Payment Received', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
    { value: 'Complete', label: 'Complete', color: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/50' },
];

export default function ClientStatus({ clientId, currentStatus }: ClientStatusProps) {
    const [status, setStatus] = useState(currentStatus || 'Inquiry');
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus);
        setLoading(true);
        await updateClientStatus(clientId, newStatus);
        setLoading(false);
    };

    const currentOption = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];

    return (
        <div className="relative group/status inline-block">
            <button
                disabled={loading}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${currentOption.color} hover:bg-opacity-30`}
            >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <div className={`w-2 h-2 rounded-full bg-current`} />}
                {status}
            </button>

            {/* Dropdown - Simple Hover Implementation */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl p-1 hidden group-hover/status:block z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] uppercase tracking-widest text-text-muted px-2 py-1 font-bold">Select Status</div>
                {STATUS_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 hover:bg-white/5 ${status === option.value ? 'bg-white/10 text-white' : 'text-text-muted'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${option.value === 'Inquiry' ? 'bg-blue-500' : option.value === 'Session Active' ? 'bg-emerald-500' : option.value === 'Payment Received' ? 'bg-purple-500' : 'bg-neutral-500'}`} />
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
