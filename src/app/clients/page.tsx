import { getClients, createClient } from '@/app/actions/clients';
import { Mail, Plus } from 'lucide-react';
import Link from 'next/link';
// import StudioNav from '../components/StudioNav';
import ClientStatus from '../components/ClientStatus';
import DeleteClientButton from '../components/DeleteClientButton';
export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="min-h-screen bg-black text-white font-body relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>



            <div className="relative z-10 max-w-7xl mx-auto w-full px-8 pb-32 pt-12 animate-fade-in space-y-12">
                <header className="flex justify-between items-end border-b border-white/10 pb-6 gap-6">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-white neon-text-white uppercase leading-none">
                            Client <span className="text-void-purple neon-text">Roster</span>
                        </h1>
                        <p className="text-neutral-400 mt-2 font-mono text-sm tracking-widest uppercase">
                            Global Database Access
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Add Client Form (Sidebar) */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="glass-panel p-6 sticky top-8 space-y-6">
                            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <Plus size={20} className="text-void-purple text-glow" /> New Entry
                            </h2>
                            <form action={async (formData) => {
                                'use server';
                                await createClient(formData);
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Artist Name</label>
                                    <input name="name" placeholder="e.g. The Weeknd" className="input text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Email</label>
                                    <input name="email" type="email" placeholder="artist@label.com" className="input text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Phone</label>
                                    <input name="phone" placeholder="+1 (555) 000-0000" className="input text-sm" />
                                </div>
                                <button className="w-full btn-primary py-3 text-xs uppercase tracking-widest">
                                    Add to Roster
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Client List */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-4">
                        {clients.length === 0 ? (
                            <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl text-neutral-500 font-mono text-sm uppercase tracking-widest">
                                No clients found. Database empty.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {clients.map((client) => (
                                    <Link href={`/clients/${client.id}`} key={client.id} className="block group">
                                        <div className="glass-panel p-5 transition-all duration-300 hover:border-void-purple/50 flex justify-between items-center h-full hover:-translate-x-1">
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-12 rounded-full bg-void-purple/10 border border-void-purple/20 flex items-center justify-center text-void-purple font-display text-xl font-bold group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                                                    {client.name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-void-purple transition-colors font-display tracking-wide">{client.name || "Unknown"}</h3>
                                                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-1">
                                                        <span className="flex items-center gap-1"><Mail size={10} /> {client.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden sm:block">
                                                    <ClientStatus clientId={client.id} currentStatus={client.status} />
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-2xl font-display font-bold text-white leading-none">{client._count.bookings}</div>
                                                    <div className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold mt-1">Sessions</div>
                                                </div>

                                                <DeleteClientButton clientId={client.id} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
