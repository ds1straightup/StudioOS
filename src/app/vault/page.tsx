import { getBookingsForRange } from '@/app/actions/booking';
import Link from 'next/link';

// import StudioNav from '@/app/components/StudioNav';
import { Lock, Unlock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VaultIndexPage() {
    // Fetch active bookings
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);
    const bookings = await getBookingsForRange(new Date(0), nextYear);

    return (
        <div className="min-h-screen bg-black text-white font-body relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>



            <div className="relative z-10 max-w-7xl mx-auto w-full px-8 pb-32 pt-12 animate-fade-in space-y-12">
                <header className="flex justify-between items-end border-b border-white/10 pb-6 gap-6">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-white neon-text-white uppercase leading-none">
                            The <span className="text-void-purple neon-text">Vault</span>
                        </h1>
                        <p className="text-neutral-400 mt-2 font-mono text-sm tracking-widest uppercase">
                            Secure Asset Storage
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.length === 0 ? (
                        <div className="col-span-full text-center p-24 glass-panel border-dashed border-white/10 opacity-50">
                            <Lock size={48} className="mx-auto mb-4 text-neutral-600" />
                            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
                                Vault is empty. No deliverables found.
                            </p>
                        </div>
                    ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        bookings.map((booking: any) => {
                            const isLocked = booking.balanceDue > 0;
                            return (
                                <Link
                                    key={booking.id}
                                    href={`/vault/${booking.id}`}
                                    className="block group"
                                >
                                    <div className={`
                                        glass-panel p-6 h-full transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between
                                        ${isLocked ? 'border-orange-500/20 hover:border-orange-500/50' : 'border-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.05)]'}
                                    `}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-white/5 p-3 rounded-xl">
                                                {isLocked ? (
                                                    <Lock size={20} className="text-orange-500" />
                                                ) : (
                                                    <Unlock size={20} className="text-emerald-500" />
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border ${isLocked ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'}`}>
                                                    {isLocked ? 'Locked' : 'Access Granted'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-display text-xl text-white group-hover:text-void-purple transition-colors neon-text-white mb-2">
                                                {booking.guestName || "Unnamed Guest"}
                                            </h3>
                                            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                                                Ref: {booking.id.substring(0, 8)}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                                            <span>
                                                {isLocked ? 'Pay to Unlock' : 'View Assets'}
                                            </span>
                                            <span>&rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
