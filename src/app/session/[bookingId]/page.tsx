import { getSessionDetails, addSessionLog } from '@/app/actions/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mic2, Save, X } from 'lucide-react';
import SessionTimer from '@/app/components/session/SessionTimer';
import Scratchpad from '@/app/components/session/Scratchpad';
import SessionTasks from '@/app/components/session/SessionTasks';
import StudioInfo from '@/app/components/session/StudioInfo';
import QuickActions from '@/app/components/session/QuickActions';

export const dynamic = 'force-dynamic';

export default async function SessionModePage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = await params;
    const session = await getSessionDetails(bookingId);
    if (!session) redirect('/dashboard');

    async function handleLog(formData: FormData) {
        'use server';
        await addSessionLog(bookingId, formData.get('content') as string);
    }

    return (
        <div className="h-screen bg-background text-text flex flex-col overflow-hidden font-sans pb-24 md:pb-20">

            {/* 1. THE HUD (Header) */}
            <header className="h-20 border-b border-white/5 bg-surface/30 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
                {/* Left: Status & Artist */}
                <div className="flex items-center gap-6 w-1/3">
                    <div className="relative group cursor-help">
                        <div className="w-3 h-3 rounded-full bg-danger animate-ping absolute top-0 left-0 opacity-75"></div>
                        <div className="w-3 h-3 rounded-full bg-danger relative shadow-[0_0_10px_rgba(255,59,48,0.5)]"></div>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none border border-white/10">
                            Recording in Progress
                        </div>
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold leading-none text-white tracking-wide truncate max-w-[200px] lg:max-w-xs">
                            {session.guestName || session.client?.name || "Unknown Artist"}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-secondary font-mono tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded">
                                {session.brief?.bpm ? `${session.brief.bpm} BPM` : 'No BPM'}
                            </span>
                            <span className="text-[10px] text-secondary font-mono tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded">
                                {session.brief?.key || 'No Key'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: The Timer */}
                <div className="flex-1 flex justify-center">
                    <div className="scale-90 opacity-90 hover:opacity-100 transition-opacity">
                        <SessionTimer endTime={session.endTime} />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="w-1/3 flex justify-end">
                    <Link href="/dashboard" className="btn px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
                        <X size={14} /> End Session
                    </Link>
                </div>
            </header>

            {/* 2. THE COCKPIT (Main Grid) */}
            <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden relative">

                {/* BACKGROUND ELEMENT */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/50 to-background pointer-events-none -z-10" />

                {/* LEFT CONSOLE: Log Stream (Chat) */}
                <section className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col h-full gap-4 relative">

                    {/* Log Area */}
                    <div className="flex-1 overflow-y-auto pr-4 space-y-4 pb-24 mask-image-gradient-b">
                        {session.logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-20 select-none">
                                <Mic2 size={80} className="mb-6 text-white" />
                                <p className="text-4xl font-heading font-bold text-white tracking-widest">LIVE</p>
                            </div>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            session.logs.map((log: any) => (
                                <div key={log.id} className="animate-fade-in flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                                    <div className="w-12 pt-1">
                                        <span className="font-mono text-[10px] text-secondary opacity-40 group-hover:opacity-100 transition-opacity">
                                            {log.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-base text-gray-300 leading-relaxed font-light group-hover:text-white transition-colors">
                                            {log.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Console */}
                    <div className="h-20 shrink-0">
                        <form action={handleLog} className="relative h-full flex items-end">
                            <input
                                name="content"
                                autoFocus
                                placeholder="Enter log..."
                                className="w-full h-14 pl-6 pr-14 text-lg bg-surface/50 border border-white/10 rounded-2xl shadow-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted/30 text-white backdrop-blur-md"
                                autoComplete="off"
                            />
                            <button type="submit" className="absolute right-2 bottom-2 p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                                <Save size={18} />
                            </button>
                        </form>
                    </div>

                </section>

                {/* RIGHT CONSOLE: Tools Rack */}
                <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">

                    {/* Tool 1: Scratchpad (Expanded) */}
                    <div className="flex-1 min-h-[250px] flex flex-col">
                        <Scratchpad bookingId={bookingId} />
                    </div>

                    {/* Tool 2: Tasks */}
                    <div className="shrink-0">
                        <SessionTasks bookingId={bookingId} />
                    </div>

                    {/* Tool 3: Info & Actions Grid */}
                    <div className="shrink-0 grid gap-4">
                        <StudioInfo />
                        <QuickActions />
                    </div>

                </aside>

            </main>
        </div>
    );
}
