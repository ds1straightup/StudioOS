import { saveBrief } from '@/app/actions/brief';
import { getSessionDetails } from '@/app/actions/session';
import { redirect } from 'next/navigation';

export default async function BriefPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = await params;
    const session = await getSessionDetails(bookingId);

    if (!session) redirect('/dashboard');

    const brief = session.brief;

    return (
        <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-black text-white font-body">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto pb-32">
                <div className="glass-panel w-full p-8 md:p-12 rounded-3xl animate-fade-in space-y-10">
                    <header className="space-y-4 text-center">
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-white neon-text-white uppercase leading-none">
                            Briefing <span className="text-void-purple neon-text">Room</span>
                        </h1>
                        <p className="text-neutral-400 text-lg font-light tracking-wide">
                            {brief ? 'Review or update your sonic vision.' : 'Define your sonic vision.'}
                        </p>
                    </header>

                    {/* @ts-expect-error Server Action type mismatch in Next 15 beta types */}
                    <form action={saveBrief} className="space-y-8">
                        <input type="hidden" name="bookingId" value={bookingId} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-void-purple">
                                    BPM
                                </label>
                                <input
                                    type="number"
                                    name="bpm"
                                    placeholder="140"
                                    defaultValue={brief?.bpm || ''}
                                    required
                                    className="input font-mono text-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-void-purple">
                                    Key
                                </label>
                                <select
                                    name="key"
                                    defaultValue={brief?.key || ''}
                                    required
                                    className="input appearance-none font-mono text-lg"
                                >
                                    <option value="" className="bg-neutral-900 border-none">Select Key...</option>
                                    <option value="Am" className="bg-neutral-900">A Minor</option>
                                    <option value="C" className="bg-neutral-900">C Major</option>
                                    <option value="Gm" className="bg-neutral-900">G Minor</option>
                                    <option value="Em" className="bg-neutral-900">E Minor</option>
                                    <option value="F" className="bg-neutral-900">F Major</option>
                                    <option value="Dm" className="bg-neutral-900">D Minor</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-void-purple">
                                Reference Tracks
                            </label>
                            <textarea
                                name="references"
                                rows={4}
                                placeholder="Paste Spotify or YouTube links here..."
                                defaultValue={brief?.referenceTracks || ''}
                                required
                                className="input resize-none font-mono text-sm leading-relaxed"
                            ></textarea>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 text-right">
                                Links help us align faster
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-void-purple">
                                Additional Notes
                            </label>
                            <textarea
                                name="notes"
                                rows={4}
                                placeholder="Vibe, specific instruments, vocal chain ideas..."
                                defaultValue={brief?.notes || ''}
                                className="input resize-none font-mono text-sm leading-relaxed"
                            ></textarea>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 text-right">
                                Optional: Any other critical details
                            </p>
                        </div>

                        <div className="pt-6">
                            <button type="submit" className="w-full btn-primary group">
                                <span>{brief ? 'UPDATE BRIEF' : 'INITIALIZE BRIEF'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:translate-x-1"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
