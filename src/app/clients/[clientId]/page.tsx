
import { getClientDetails, updateClientNotes } from '@/app/actions/clients';
import { notFound } from 'next/navigation';
import { Mail, Phone, Calendar, Clock, FileText, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import SpendBreakdownModal from '@/app/components/SpendBreakdownModal';

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
    const { clientId } = await params;
    const client = await getClientDetails(clientId);

    if (!client) notFound();

    return (
        <div className="max-w-7xl mx-auto w-full p-6 md:p-8 animate-fade-in space-y-8 pb-24">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-linear-to-br from-primary/20 to-cta/20 flex items-center justify-center text-primary font-heading text-3xl md:text-4xl font-bold shadow-[0_0_30px_rgba(249,115,22,0.2)] border border-white/10">
                        {client.name?.[0] || '?'}
                    </div>
                    <div>
                        <h1 className="h1-display text-4xl md:text-5xl text-white drop-shadow-lg">{client.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                <Mail size={14} className="text-primary" /> {client.email}
                            </span>
                            {client.phone && (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                    <Phone size={14} className="text-secondary" /> {client.phone}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 font-mono text-xs tracking-wider">
                                ID: {client.portalCode}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Link href={`/?guestEmail=${client.email}&guestName=${client.name}`} className="btn btn-primary flex-1 md:flex-none justify-center gap-2 shadow-lg shadow-cta/20">
                        <Plus size={18} /> Book Appointment
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Stats & Notes */}
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <SpendBreakdownModal
                            totalSpend={client.stats.totalSpend}
                            bookings={client.bookings}
                        />
                        <div className="bg-surface/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                            <div className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                                <Calendar size={12} /> Sessions
                            </div>
                            <div className="text-2xl font-heading text-white">
                                {client.stats.totalSessions}
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="bg-surface border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <FileText className="text-white/5 h-24 w-24 -rotate-12 transform translate-x-8 -translate-y-8" />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                            <FileText size={18} className="text-secondary" /> Private Notes
                        </h3>
                        <form action={async (formData) => {
                            'use server';
                            const note = formData.get('notes') as string;
                            await updateClientNotes(client.id, note);
                        }} className="relative z-10">
                            <textarea
                                name="notes"
                                defaultValue={client.notes || ''}
                                placeholder="Add private notes about this client (preferences, mic choice, etc)..."
                                className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-text resize-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 focus:outline-none transition-all cursor-text placeholder:text-text-muted/50"
                            />
                            <button className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors text-text-muted hover:text-white">
                                Save Notes
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Col: Appointment History */}
                <div className="lg:col-span-2" id="history">
                    <div className="bg-surface/30 border border-white/5 rounded-2xl overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                                <Clock size={18} className="text-primary" /> Appointment History
                            </h3>
                        </div>

                        <div className="divide-y divide-white/5">
                            {client.bookings.length === 0 ? (
                                <div className="p-12 text-center text-text-muted italic">
                                    No appointments scheduled yet.
                                </div>
                            ) : (
                                client.bookings.map((booking) => (
                                    <div key={booking.id} className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center h-14 w-14 bg-white/5 rounded-xl border border-white/5">
                                                <span className="text-xs font-bold text-text-muted uppercase">
                                                    {new Date(booking.startTime).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-xl font-bold text-white font-heading">
                                                    {new Date(booking.startTime).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-success/10 text-success border border-success/20' :
                                                        booking.status === 'COMPLETED' ? 'bg-white/10 text-text-muted border border-white/10' :
                                                            'bg-warning/10 text-warning border border-warning/20'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                    <span>•</span>
                                                    <span>£{booking.totalAmount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {booking.balanceDue > 0 ? (
                                                <div className="flex items-center gap-1.5 text-xs text-warning font-bold bg-warning/5 px-3 py-1.5 rounded-full border border-warning/10">
                                                    <AlertCircle size={12} /> Due: £{booking.balanceDue}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs text-success font-bold bg-success/5 px-3 py-1.5 rounded-full border border-success/10">
                                                    <CheckCircle size={12} /> Paid
                                                </div>
                                            )}

                                            <Link href={`/session/${booking.id}`} className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors" title="View Session">
                                                <Plus size={16} className="rotate-45" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
