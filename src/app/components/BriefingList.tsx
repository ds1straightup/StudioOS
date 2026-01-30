'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Calendar, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface Booking {
    id: string;
    guestName: string;
    guestEmail: string;
    startTime: Date;
    brief?: { id: string } | null;
}

interface BriefingListProps {
    bookings: Booking[];
}

type TimeFilter = 'all' | 'upcoming' | 'past';
type BriefFilter = 'all' | 'completed' | 'pending';

export default function BriefingList({ bookings }: BriefingListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [briefFilter, setBriefFilter] = useState<BriefFilter>('all');
    const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

    // Filter and group bookings
    const { groupedBookings, totalCount } = useMemo(() => {
        const now = new Date();

        // Apply filters
        const filtered = bookings.filter(booking => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = booking.guestName?.toLowerCase().includes(query);
                const matchesEmail = booking.guestEmail?.toLowerCase().includes(query);
                if (!matchesName && !matchesEmail) return false;
            }

            // Time filter
            const bookingDate = new Date(booking.startTime);
            if (timeFilter === 'upcoming' && bookingDate < now) return false;
            if (timeFilter === 'past' && bookingDate >= now) return false;

            // Brief status filter
            if (briefFilter === 'completed' && !booking.brief) return false;
            if (briefFilter === 'pending' && booking.brief) return false;

            return true;
        });

        // Group by client email (unique identifier)
        const grouped = filtered.reduce((acc, booking) => {
            const key = booking.guestEmail || 'unknown';
            if (!acc[key]) {
                acc[key] = {
                    name: booking.guestName || 'Unnamed Guest',
                    email: booking.guestEmail,
                    sessions: []
                };
            }
            acc[key].sessions.push(booking);
            return acc;
        }, {} as Record<string, { name: string; email: string; sessions: Booking[] }>);

        // Sort sessions within each client by date (most recent first)
        Object.values(grouped).forEach(client => {
            client.sessions.sort((a, b) =>
                new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
            );
        });

        return {
            groupedBookings: grouped,
            totalCount: filtered.length
        };
    }, [bookings, searchQuery, timeFilter, briefFilter]);

    const toggleClientExpanded = (email: string) => {
        const newExpanded = new Set(expandedClients);
        if (newExpanded.has(email)) {
            newExpanded.delete(email);
        } else {
            newExpanded.add(email);
        }
        setExpandedClients(newExpanded);
    };

    const clientEntries = Object.entries(groupedBookings);

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="glass-panel p-6 space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input text-sm pl-10 w-full"
                    />
                </div>

                {/* Filter Toggles */}
                <div className="flex flex-wrap gap-4">
                    {/* Time Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeFilter('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'all'
                                ? 'bg-void-purple text-white shadow-glow'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Calendar size={14} className="inline mr-1" />
                            All
                        </button>
                        <button
                            onClick={() => setTimeFilter('upcoming')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'upcoming'
                                ? 'bg-void-purple text-white shadow-glow'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setTimeFilter('past')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === 'past'
                                ? 'bg-void-purple text-white shadow-glow'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Past
                        </button>
                    </div>

                    {/* Brief Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setBriefFilter('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${briefFilter === 'all'
                                ? 'bg-void-purple text-white shadow-glow'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            All Status
                        </button>
                        <button
                            onClick={() => setBriefFilter('completed')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${briefFilter === 'completed'
                                ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <CheckCircle size={14} className="inline mr-1" />
                            Completed
                        </button>
                        <button
                            onClick={() => setBriefFilter('pending')}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${briefFilter === 'pending'
                                ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Clock size={14} className="inline mr-1" />
                            Pending
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-xs text-neutral-500 font-mono">
                    Showing {totalCount} {totalCount === 1 ? 'session' : 'sessions'} from {clientEntries.length} {clientEntries.length === 1 ? 'client' : 'clients'}
                </div>
            </div>

            {/* Grouped Results */}
            {clientEntries.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4">
                    <p className="text-neutral-500 font-display text-2xl uppercase opacity-50">No sessions found.</p>
                    <p className="text-neutral-600 text-sm">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {clientEntries.map(([email, client]) => {
                        const isExpanded = expandedClients.has(email);
                        const sessionCount = client.sessions.length;

                        return (
                            <div key={email} className="glass-panel overflow-hidden">
                                {/* Client Header */}
                                <button
                                    onClick={() => toggleClientExpanded(email)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-void-purple/20 flex items-center justify-center text-void-purple font-bold">
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-display text-lg text-white font-bold">{client.name}</h3>
                                            <p className="text-xs text-neutral-500 font-mono">{client.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-neutral-400 font-mono">
                                            {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="text-void-purple" size={20} />
                                        ) : (
                                            <ChevronDown className="text-neutral-500" size={20} />
                                        )}
                                    </div>
                                </button>

                                {/* Sessions */}
                                {isExpanded && (
                                    <div className="border-t border-white/10 bg-black/20 p-4 space-y-3">
                                        {client.sessions.map((booking) => (
                                            <Link
                                                key={booking.id}
                                                href={`/brief/${booking.id}`}
                                                className="block p-4 rounded-xl bg-white/5 hover:bg-void-purple/10 hover:border-void-purple/30 border border-white/10 transition-all group"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-mono text-void-purple">
                                                            {format(new Date(booking.startTime), "MMM do, yyyy")}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${booking.brief
                                                                ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                                                : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                                                                }`}></div>
                                                            <span className={`text-[10px] uppercase tracking-widest font-bold ${booking.brief ? 'text-green-500' : 'text-orange-500'
                                                                }`}>
                                                                {booking.brief ? 'Completed' : 'Pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-neutral-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300">
                                                        &rarr;
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
