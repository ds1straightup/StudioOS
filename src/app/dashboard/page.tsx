import { getDashboardSessions } from '@/app/actions/dashboard';
import SessionCard from '@/app/components/SessionCard';
// import StudioNav from '../components/StudioNav';
// Suspense removed

// Semantic CSS is defined in globals.css under /* -- Dashboard -- */

export default async function DashboardPage() {
    const data = await getDashboardSessions();

    return (
        <div className="min-h-screen bg-black text-white font-body relative overflow-hidden">
            {/* Background Effects - Fixed & efficient */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>



            <main className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-8 pb-32 pt-12 animate-fade-in space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8 gap-6">
                    <div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-white neon-text-white uppercase leading-none">
                            The Beat <span className="text-void-purple neon-text">Farda</span>
                        </h1>
                        <p className="text-neutral-400 mt-3 font-light tracking-wide italic">
                            &quot;Calm over chaos.&quot;
                        </p>
                    </div>

                    <div className="glass-panel px-8 py-4 rounded-2xl flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-4xl font-display font-bold text-white leading-none">
                                {data.today.length}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-void-purple mt-1">
                                Today&apos;s Sessions
                            </div>
                        </div>
                    </div>
                </header>

                {/* Today's Agenda */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-cta rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase">Active Agenda</h2>
                    </div>

                    {data.today.length === 0 ? (
                        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border-dashed border-white/10">
                            <p className="text-neutral-500 font-display text-2xl uppercase opacity-50">Silence in the studio.</p>
                            <p className="text-neutral-600 text-sm">Focus on the Architect role today.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.today.map((session) => (
                                <SessionCard key={session.id} session={session} isToday={true} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Future Layout */}
                <section className="space-y-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                        <h2 className="text-lg font-display font-bold text-neutral-500 uppercase tracking-widest">
                            Incoming
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.upcoming.map((session) => (
                            <SessionCard key={session.id} session={session} isToday={false} />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
