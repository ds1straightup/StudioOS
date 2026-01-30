'use client';

import { useState } from 'react';
import { X, Receipt, PoundSterling } from 'lucide-react';

interface BookingStub {
    id: string;
    startTime: Date;
    totalAmount: number;
    status: string;
    serviceName?: string | null;
    brief?: {
        notes?: string | null;
    } | null;
}

interface SpendBreakdownModalProps {
    totalSpend: number;
    bookings: BookingStub[];
}

export default function SpendBreakdownModal({ totalSpend, bookings }: SpendBreakdownModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Filter mainly completed/confirmed for "Spend" context, 
    // or typically "Spend" implies what they have paid? 
    // For now assuming Total Spend = Sum of money involved in their bookings.
    // If exact "Paid" amount vs "Billed" is needed, we would need deposit/balance logic.
    // Based on `client.stats.totalSpend` implementation in actions/clients.ts, it likely sums totalAmount.

    // Sort by date descending
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const getServiceName = (booking: BookingStub) => {
        if (booking.serviceName) return booking.serviceName;
        if (!booking.brief?.notes) return "Studio Session";
        const note = booking.brief.notes;
        const match = note.match(/Looking for a (.*?) vibe/i);
        if (match && match[1]) return match[1];
        return note.length > 30 ? "Studio Session" : note;
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="bg-surface/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm group-hover:border-void-purple/50 group-hover:bg-void-purple/5 transition-all cursor-pointer group"
            >
                <div className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1 flex items-center gap-2 group-hover:text-void-purple transition-colors">
                    <PoundSterling size={12} /> Total Spend
                </div>
                <div className="text-2xl font-heading text-success">
                    £{totalSpend.toLocaleString()}
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="font-heading text-xl text-white flex items-center gap-2">
                                    <Receipt size={20} className="text-void-purple" /> Spend Breakdown
                                </h3>
                                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Transaction History</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-text-muted hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-0 scrollbar-hide">
                            <table className="w-full border-collapse">
                                <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                                    <tr className="text-left">
                                        <th className="p-4 text-[10px] uppercase font-bold text-text-muted tracking-widest border-b border-white/5">Date</th>
                                        <th className="p-4 text-[10px] uppercase font-bold text-text-muted tracking-widest border-b border-white/5">Service</th>
                                        <th className="p-4 text-[10px] uppercase font-bold text-text-muted tracking-widest border-b border-white/5">Status</th>
                                        <th className="p-4 text-[10px] uppercase font-bold text-text-muted tracking-widest border-b border-white/5 text-right w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sortedBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 text-sm font-mono text-white/80">
                                                {new Date(booking.startTime).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-white">
                                                {getServiceName(booking)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-success/10 text-success' :
                                                    booking.status === 'COMPLETED' ? 'bg-white/10 text-text-muted' :
                                                        'bg-warning/10 text-warning'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono text-white">
                                                £{booking.totalAmount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Total Lifetime Value</span>
                            <span className="text-2xl font-heading text-success">£{totalSpend.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Backdrop Click to Close */}
                    <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)}></div>
                </div>
            )}
        </>
    );
}
