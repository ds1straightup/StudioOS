import { getBookingsForRange } from '@/app/actions/booking';
import BriefingList from '@/app/components/BriefingList';

export const dynamic = 'force-dynamic';

export default async function BriefIndexPage() {
    // Fetch all bookings
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);
    const bookings = await getBookingsForRange(new Date(0), nextYear);

    return (
        <div className="min-h-screen bg-black text-white font-body relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>

            <main className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-8 pb-32 pt-12 animate-fade-in space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
                    <div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-white neon-text-white uppercase leading-none">
                            Briefing <span className="text-void-purple neon-text">Index</span>
                        </h1>
                        <p className="text-neutral-400 mt-3 font-light tracking-widest uppercase text-xs">
                            Active Sessions &amp; Requirements
                        </p>
                    </div>
                </header>

                <BriefingList bookings={bookings} />
            </main>
        </div>
    );
}
