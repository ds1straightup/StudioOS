'use client';

import { format } from 'date-fns';
import { CheckCircle2, AlertCircle, Play } from 'lucide-react';
import Link from 'next/link';

interface SessionCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: any;
    isToday: boolean;
}

export default function SessionCard({ session, isToday }: SessionCardProps) {
    const hasBrief = !!session.brief;
    const isPaid = session.status === 'CONFIRMED' || session.balanceDue <= 0;

    return (
        <div className={`
             group relative glass-panel p-6 transition-all duration-300 hover:border-void-purple/50
             ${isPaid
                ? 'shadow-[0_0_20px_rgba(0,255,157,0.05)]'
                : 'shadow-[0_0_20px_rgba(255,183,0,0.05)]'
            }
        `}>
            <div className="flex flex-col gap-6">

                <Link href={`/brief/${session.id}`} className="block transition-opacity hover:opacity-80">
                    {/* Top Row: Time & Status */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/5 p-2 rounded-lg font-mono text-xl font-bold text-white tracking-widest border border-white/10 group-hover:border-void-purple/50 transition-colors">
                            {format(new Date(session.startTime), 'HH:mm')}
                        </div>

                        <div className="text-right">
                            {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                    <span style={{ fontSize: '10px' }}>£</span> Paid
                                </span>
                            ) : (
                                <div className="flex flex-col items-end">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                                        Due
                                    </span>
                                    <span className="text-xs font-mono text-amber-400 mt-1">£{session.balanceDue}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle: Artist Info */}
                    <div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-void-purple transition-colors neon-text-white">
                            {session.guestName || session.client?.name || "Unknown Artist"}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider">
                            {hasBrief ? (
                                <span className="flex items-center gap-1 text-neutral-400">
                                    <CheckCircle2 size={12} className="text-emerald-400" /> Brief Ready
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                                    <AlertCircle size={12} /> Brief Missing
                                </span>
                            )}

                            {session.brief && (
                                <span className="text-void-purple opacity-90 border-l border-white/10 pl-4">
                                    {session.brief.bpm} BPM • {session.brief.key}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Bottom: Actions */}
                {isToday && (
                    <div className="pt-4 border-t border-white/5">
                        <Link href={`/session/${session.id}`} className="w-full btn bg-white text-black hover:bg-void-purple hover:text-white font-bold flex items-center justify-center gap-2 rounded-full py-3 text-xs uppercase tracking-widest shadow-lg hover:shadow-neon transition-all duration-300">
                            <Play size={12} fill="currentColor" /> Launch Session Mode
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
