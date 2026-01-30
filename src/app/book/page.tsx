"use client";

import { useState, useEffect } from "react";
import { getServices, getAvailableSlots, holdSlot, confirmBooking } from "@/app/actions/booking";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isBefore,
    startOfDay
} from "date-fns";
import { cn } from "@/lib/utils";


// --- Types ---
type Service = {
    id: string;
    name: string;
    category?: string;
    durationMinutes: number;
    price: number;
    description: string;
};

type Slot = {
    start: Date;
    end: Date;
    available: boolean;
};

// --- Main Component ---
export default function BookingPage() {
    // State
    const [step, setStep] = useState<"SERVICE" | "DATE" | "INTAKE" | "REVIEW" | "PROCESSING" | "SUCCESS">("SERVICE");
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Date & Calendar State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Slots State
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
    const [loading, setLoading] = useState(false);

    // Booking Result
    const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        getServices().then(res => {
            if (res.success) setServices(res.data as Service[]);
        });
    }, []);

    // Fetch Slots when Date/Service Changes
    useEffect(() => {
        if (step === "DATE" && selectedService && selectedDate) {
            // eslint-disable-next-line
            setLoading(true);
            setSlots([]); // Clear previous slots
            getAvailableSlots(selectedDate.toISOString(), selectedService.id).then(res => {
                if (res.success && res.data) {
                    type RawSlot = { start: string; end: string; available: boolean };
                    const parsedSlots = (res.data as unknown as RawSlot[]).map((s) => ({
                        ...s,
                        start: new Date(s.start),
                        end: new Date(s.end)
                    }));
                    setSlots(parsedSlots);
                }
                setLoading(false);
            });
        }
    }, [selectedDate, selectedService, step]);

    // Handlers
    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setStep("DATE");
        // Reset date selection if moving back
        setSelectedDate(null);
        setSlots([]);
    };

    const handleSlotSelect = (slot: Slot) => {
        setSelectedSlot(slot);
        setStep("INTAKE");
    };

    const handleBookingSubmit = async () => {
        if (!selectedSlot || !selectedService) return;

        setStep("PROCESSING");

        // 1. Create Provisional Booking (Hold Slot)
        const holdRes = await holdSlot(
            selectedSlot.start,
            selectedSlot.end,
            formData.email,
            formData.name,
            selectedService.id
        );

        if (!holdRes.success || !holdRes.data) {
            alert("Error: Slot may have been taken. Please try again.");
            setStep("DATE");
            return;
        }

        const bookingId = holdRes.data as string;

        // 2. Simulate Payment Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Confirm Booking (Simulate Webhook)
        const confirmRes = await confirmBooking(bookingId);

        if (confirmRes.success) {
            setConfirmedBookingId(bookingId);
            setStep("SUCCESS");
        } else {
            alert("Payment simulation failed.");
            setStep("INTAKE");
        }
    };
    // --- Render Helpers ---

    const renderServiceSelection = () => {
        // Group services by category
        const categories = services.reduce((acc, service) => {
            const cat = service.category || "Other Services";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(service);
            return acc;
        }, {} as Record<string, Service[]>);

        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category}>
                        <h2 className="font-display text-2xl text-white mb-6 pl-2 border-l-4 border-void-purple uppercase tracking-widest">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((service) => (
                                <GlassPanel
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service)}
                                    className="cursor-pointer hover:border-void-purple/50 group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-display text-xl text-white group-hover:text-void-purple transition-colors leading-tight">{service.name}</h3>
                                            <span className="font-mono text-void-purple whitespace-nowrap ml-4">£{service.price}</span>
                                        </div>
                                        <p className="text-neutral-400 text-xs mb-6 leading-relaxed">{service.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 mt-auto pt-4 border-t border-white/5">
                                        <span>{service.durationMinutes > 0 ? `${service.durationMinutes} Mins` : 'Custom'}</span>
                                        <span className="group-hover:text-white transition-colors">Select &rarr;</span>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCustomCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
        const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
        const isPast = (date: Date) => isBefore(date, startOfDay(new Date()));

        return (
            <div className="select-none">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="text-neutral-400 hover:text-white p-2">&larr;</button>
                    <span className="font-display text-lg text-white tracking-widest uppercase">
                        {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <button onClick={nextMonth} className="text-neutral-400 hover:text-white p-2">&rarr;</button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-2 text-center">
                    {weekDays.map(d => (
                        <div key={d} className="text-[10px] uppercase text-neutral-600 font-mono py-2">{d}</div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => {
                        const disabled = isPast(day);
                        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <div
                                key={i}
                                onClick={() => !disabled && setSelectedDate(day)}
                                className={cn(
                                    "aspect-square flex items-center justify-center text-sm font-mono cursor-pointer rounded-md transition-all duration-200 border border-transparent",
                                    !isCurrentMonth && "text-neutral-800 opacity-20",
                                    disabled && "opacity-30 cursor-not-allowed text-neutral-600",
                                    !disabled && isCurrentMonth && "text-neutral-300 hover:bg-white/5 hover:border-white/10",
                                    isSelected && "bg-void-purple text-white border-void-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                )}
                            >
                                {format(day, "d")}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDateSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Calendar */}
            <div className="md:col-span-5 lg:col-span-4">
                <GlassPanel className="h-full">
                    {renderCustomCalendar()}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                            Time Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </p>
                    </div>
                </GlassPanel>
            </div>

            {/* Slots */}
            <div className="md:col-span-7 lg:col-span-8">
                <GlassPanel className="h-full min-h-[400px]">
                    <h3 className="font-display text-xl mb-6 flex justify-between items-center">
                        <span>Available Slots</span>
                        {selectedDate && <span className="text-sm font-mono text-void-purple">{format(selectedDate, "MMM do")}</span>}
                    </h3>

                    {!selectedDate ? (
                        <div className="h-64 flex items-center justify-center text-neutral-600 font-mono text-sm uppercase tracking-widest">
                            &larr; Select a date to view slots
                        </div>
                    ) : loading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-void-purple animate-pulse gap-4">
                            <div className="w-8 h-8 border-2 border-void-purple border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-mono text-xs uppercase tracking-widest">Scanning Availability...</span>
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-neutral-500 font-mono text-sm">
                            NO AVAILABILITY
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {slots.map((slot, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSlotSelect(slot)}
                                    className="group relative border border-white/10 hover:border-void-purple bg-white/5 hover:bg-void-purple/10 p-3 rounded-lg transition-all text-center overflow-hidden"
                                >
                                    <span className="block font-mono text-lg text-white mb-1 group-hover:scale-110 transition-transform">
                                        {format(slot.start, 'HH:mm')}
                                    </span>
                                    <span className="block text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-void-purple/80 transition-colors">
                                        Until {format(slot.end, 'HH:mm')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </GlassPanel>
            </div>
        </div>
    );

    const renderIntake = () => (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassPanel>
                <h3 className="font-display text-2xl mb-2">Confirm Booking</h3>
                <p className="text-neutral-400 text-sm mb-8 border-b border-white/10 pb-6">
                    <span className="block text-white text-lg mb-1">{selectedService?.name}</span>
                    <span className="block font-mono text-void-purple">
                        {selectedDate && format(selectedDate, 'EEEE, MMMM do')} @ {selectedSlot && format(selectedSlot.start, 'HH:mm')}
                    </span>
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-white/10 p-4 rounded-lg text-white focus:border-void-purple outline-none transition-colors"
                            placeholder="Artist Name / Real Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/50 border border-white/10 p-4 rounded-lg text-white focus:border-void-purple outline-none transition-colors"
                            placeholder="confirms@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Session Notes / Links</label>
                        <textarea
                            className="w-full bg-black/50 border border-white/10 p-4 rounded-lg text-white focus:border-void-purple outline-none transition-colors min-h-[100px]"
                            placeholder="BPM, Key, Link to demo..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="bg-void-purple/10 p-4 rounded items-start gap-3 flex mt-4 border border-void-purple/20">
                        <div className="text-void-purple mt-1">ℹ️</div>
                        <p className="text-xs text-neutral-400">
                            PAYMENT TERMS: Full payment required upfront. No deposits. No pay-later. Non-transferable.
                        </p>
                    </div>

                    <button
                        onClick={handleBookingSubmit}
                        disabled={!formData.name || !formData.email}
                        className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Review & Pay £{selectedService?.price}
                    </button>

                    <button
                        onClick={() => setStep("DATE")}
                        className="w-full text-center text-xs uppercase tracking-widest text-neutral-600 hover:text-white mt-4"
                    >
                        Cancel & Go Back
                    </button>
                </div>
            </GlassPanel>
        </div>
    );

    const renderProcessing = () => (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
            <div className="w-16 h-16 border-4 border-void-purple border-t-white rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-display text-white mb-2">Securing Slot...</h2>
            <p className="font-mono text-neutral-400 uppercase tracking-widest text-sm animate-pulse">Processing Payment</p>
        </div>
    );

    const renderSuccess = () => (
        <div className="max-w-xl mx-auto py-12 animate-in zoom-in duration-500">
            <GlassPanel className="text-center p-12 border-void-purple/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <div className="w-20 h-20 bg-void-purple rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow">
                    ✓
                </div>
                <h2 className="text-4xl font-display text-white mb-4">BOOKING CONFIRMED</h2>
                <p className="text-neutral-300 text-lg mb-8">
                    Your session is locked in. We&apos;ve sent a confirmation email to <span className="text-white font-bold">{formData.email}</span>.
                </p>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-8 inline-block w-full max-w-sm">
                    <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Booking Reference</div>
                    <div className="font-mono text-xl text-void-purple font-bold tracking-wider">
                        #{confirmedBookingId?.substring(0, 8).toUpperCase()}
                    </div>
                </div>
                <button
                    onClick={() => window.location.href = 'https://thebeatfarda.com'}
                    className="btn-primary w-full"
                >
                    Return to thebeatfarda.com
                </button>
            </GlassPanel>
        </div>
    );

    // Add automatic redirect for success step
    useEffect(() => {
        if (step === "SUCCESS") {
            const timer = setTimeout(() => {
                window.location.href = 'https://thebeatfarda.com';
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 max-w-7xl mx-auto">
            {step !== "SUCCESS" && step !== "PROCESSING" && (
                <header className="mb-12 text-center">
                    <h1 className="font-display text-4xl md:text-6xl text-white mb-4 neon-text-white">BOOK SESSION</h1>
                    <p className="font-body text-neutral-400 max-w-xl mx-auto">Select a service, choose a slot, and lock it in.</p>
                </header>
            )}

            {/* Progress Steps (Simple) */}
            {step !== "SUCCESS" && step !== "PROCESSING" && (
                <div className="flex justify-center gap-2 mb-12">
                    {["SERVICE", "DATE", "INTAKE"].map((s, i) => (
                        <div key={s} className={`h-1 w-12 rounded-full transition-colors ${["SERVICE", "DATE", "INTAKE"].indexOf(step) >= i ? 'bg-void-purple shadow-[0_0_10px_#a855f7]' : 'bg-white/10'
                            }`} />
                    ))}
                </div>
            )}

            {step === "SERVICE" && renderServiceSelection()}
            {step === "DATE" && renderDateSelection()}
            {step === "INTAKE" && renderIntake()}
            {step === "PROCESSING" && renderProcessing()}
            {step === "SUCCESS" && renderSuccess()}

            {step !== "SERVICE" && step !== "INTAKE" && step !== "SUCCESS" && step !== "PROCESSING" && (
                <button
                    onClick={() => setStep("SERVICE")}
                    className="fixed bottom-8 left-8 text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
                >
                    &larr; Back to Services
                </button>
            )}

            {/* Quote Escape Fix */}
            {step === "SUCCESS" && (
                <p className="text-center text-neutral-500 text-xs mt-8">
                    Need help? Contact <a href="mailto:admin@beatfarda.com" className="text-void-purple hover:underline">Support</a>.
                </p>
            )}
        </div>
    );
}
