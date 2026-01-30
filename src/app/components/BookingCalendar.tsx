'use client';

import { useState, useTransition, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { holdSlot } from '../actions/booking';
import { ChevronLeft, ChevronRight, Lock, Clock, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]; // 10 AM to 10 PM

export default function BookingCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState("");
    const [unavailableSlots, setUnavailableSlots] = useState<number[]>([]);

    // Track loading state for slots specifically
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Mock availability fetch logic
    useEffect(() => {
        let isMounted = true;

        const fetchAvailability = async () => {
            if (!isMounted) return;
            setLoadingSlots(true);
            setUnavailableSlots([]);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!isMounted) return;

            // Simple mock: blocks past hours if selecting today
            if (isSameDay(selectedDate, new Date())) {
                const now = new Date();
                const currentHour = now.getHours();
                const pastHours = HOURS.filter(hour => hour <= currentHour);
                setUnavailableSlots(prev => [...prev, ...pastHours]);
            }
            setLoadingSlots(false);
        };

        fetchAvailability();

        return () => { isMounted = false; };
    }, [selectedDate]);

    const handleDateChange = (days: number) => {
        setSelectedDate(prev => addDays(prev, days));
    };

    const handleSlotClick = (hour: number) => {
        const startTime = new Date(selectedDate);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, 0, 0, 0);

        // Quick prompt (Mock Auth)
        const guestName = prompt("Enter your Artist Name:");
        if (!guestName) return;
        const guestEmail = prompt("Enter your Email:");
        if (!guestEmail) return;

        startTransition(async () => {
            const result = await holdSlot(startTime, endTime, guestEmail, guestName, "svc_vocal_1h");
            if (result.success) {
                setFeedback("Confirming...");
                window.location.href = `/brief/${result.data}`;
            } else {
                setFeedback(result.error || "Failed to hold slot.");
            }
        });
    };

    return (
        <div className="w-full space-y-8">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-2xl bg-surface/50 backdrop-blur-md border border-white/5 shadow-xl">
                <button
                    onClick={() => handleDateChange(-1)}
                    className="p-4 rounded-full bg-surface hover:bg-white/10 text-text-muted hover:text-white transition-all hover:scale-110 active:scale-95 duration-200"
                >
                    <ChevronLeft size={28} />
                </button>

                <div className="text-center space-y-2">
                    <h2 className="text-4xl md:text-5xl font-heading text-white drop-shadow-lg flex items-center justify-center gap-3">
                        <CalendarIcon className="text-primary w-8 h-8 md:w-10 md:h-10" />
                        {format(selectedDate, 'EEEE')}
                    </h2>
                    <p className="text-lg text-primary tracking-widest uppercase font-bold bg-primary/10 py-1 px-4 rounded-full inline-block">
                        {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                </div>

                <button
                    onClick={() => handleDateChange(1)}
                    className="p-4 rounded-full bg-surface hover:bg-white/10 text-text-muted hover:text-white transition-all hover:scale-110 active:scale-95 duration-200"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {HOURS.map((hour) => {
                    const isTaken = unavailableSlots.includes(hour);
                    const now = new Date();
                    const isPast = isSameDay(selectedDate, now) && hour <= now.getHours();
                    const disabled = isTaken || isPast || isPending;

                    return (
                        <button
                            key={hour}
                            disabled={disabled}
                            onClick={() => handleSlotClick(hour)}
                            className={`
                                group relative h-40 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden
                                ${disabled
                                    ? 'bg-surface/30 border-white/5 text-text-muted cursor-not-allowed opacity-50'
                                    : 'bg-surface hover:bg-surface-hover border-white/10 hover:border-primary/50 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-95'
                                }
                            `}
                        >
                            {/* Background decoration */}
                            {!disabled && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-500" />
                            )}

                            <span className="text-3xl md:text-4xl font-heading z-10 font-bold group-hover:text-primary transition-colors">
                                {format(new Date().setHours(hour), 'h a')}
                            </span>

                            <div className="z-10 text-sm md:text-base font-bold tracking-wider uppercase flex items-center gap-2">
                                {loadingSlots ? (
                                    <span className="flex items-center gap-2 text-text-muted animate-pulse">
                                        ...
                                    </span>
                                ) : isTaken ? (
                                    <span className="text-danger flex items-center gap-2">
                                        <Lock size={16} /> Booked
                                    </span>
                                ) : isPast ? (
                                    <span className="text-text-muted">Unavailable</span>
                                ) : (
                                    <span className="text-success group-hover:text-white flex items-center gap-2 transition-colors">
                                        <Clock size={16} /> Available
                                    </span>
                                )}
                            </div>

                            {/* Active Indicator Line */}
                            {!disabled && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Feedback Toast */}
            {feedback && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-cta text-white font-bold shadow-[0_0_50px_rgba(249,115,22,0.5)] animate-in fade-in slide-in-from-bottom-5 z-50 flex items-center gap-3">
                    {isPending && <Loader2 className="animate-spin" />} {feedback}
                </div>
            )}
        </div>
    );
}
