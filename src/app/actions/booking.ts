'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { addMinutes } from 'date-fns';


// The "Calm" protocol: 15 minutes to pay or lose the slot.
const PROVISIONAL_HOLD_MINUTES = 15;

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Public: Get slots for a specific date range.
 * Filters out any that are CONFIRMED or PROVISIONAL (if not expired).
 */
export async function getBookingsForRange(start: Date, end: Date) {
    try {
        // Prune expired provisional bookings first (lazy cleanup)
        await prisma.booking.updateMany({
            where: {
                status: 'PROVISIONAL',
                provisionalExpiresAt: { lt: new Date() },
            },
            data: { status: 'AVAILABLE', provisionalExpiresAt: null, userId: 'temp-cleanup' },
        });

        const bookings = await prisma.booking.findMany({
            where: {
                startTime: { gte: start },
                endTime: { lte: end },
                status: { in: ['CONFIRMED', 'PROVISIONAL', 'COMPLETED'] },
            },
            include: {
                brief: true
            }
        });

        return bookings;
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return [];
    }
}

/**
 * Gatekeeper: Attempt to hold a slot.
 * Returns success ONLY if no overlapping confirmed/valid-provisional booking exists.
 */
export async function holdSlot(
    startTime: Date,
    endTime: Date,
    guestEmail: string,
    guestName: string,
    serviceId: string
): Promise<ActionResult<string>> {

    // 1. Transactional check for overlap
    // We need to ensure no *active* booking overlaps this range.
    const now = new Date();

    // Get Service Details
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return { success: false, error: "Invalid Service" };

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Check: Overlapping bookings
            const overlapping = await tx.booking.findFirst({
                where: {
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                        {
                            OR: [
                                { status: 'CONFIRMED' },
                                { status: 'COMPLETED' },
                                {
                                    status: 'PROVISIONAL',
                                    provisionalExpiresAt: { gt: now } // Active hold
                                }
                            ]
                        }
                    ]
                }
            });

            if (overlapping) {
                throw new Error("Slot taken");
            }

            // Pricing Logic (Real)
            const totalAmount = service.price;

            // Find or Create Client (Lead)
            // Hardcoded Studio Owner for demo
            const STUDIO_OWNER_Email = 'admin@beatfarda.com';
            const user = await tx.user.findUnique({ where: { email: STUDIO_OWNER_Email } });

            let clientId = null;
            if (user) {
                let client = await tx.client.findFirst({
                    where: { email: guestEmail, userId: user.id }
                });

                if (!client) {
                    client = await tx.client.create({
                        data: {
                            email: guestEmail,
                            name: guestName,
                            userId: user.id,
                            status: 'Inquiry'
                        }
                    });
                }
                clientId = client.id;
            }

            const booking = await tx.booking.create({
                data: {
                    startTime,
                    endTime,
                    guestEmail,
                    guestName,
                    status: 'PROVISIONAL',
                    provisionalExpiresAt: addMinutes(now, PROVISIONAL_HOLD_MINUTES),
                    // TODO: In production, this comes from the subdomain/auth context.
                    userId: user?.id || 'temp-fallback',
                    totalAmount,
                    serviceName: service.name,
                    balanceDue: totalAmount, // Full amount due initially
                    clientId // Link the client
                }
            });

            return booking.id;
        });

        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Slot no longer available." };
    }
}

/**
 * Get available slots for a specific date and service.
 * Wraps BookingEngine logic.
 */
import { BookingEngine } from '@/lib/booking-engine';
import { SERVICES } from '@/lib/constants';

export async function getServices() {
    return { success: true, data: SERVICES };
}

export async function getAvailableSlots(dateString: string, serviceId: string) {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return { success: false, error: "Service not found" };

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { success: false, error: "Invalid date" };

        const slots = await BookingEngine.getAvailableSlots(date, service);
        return { success: true, data: slots };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to fetch slots" };
    }
}

/**
 * Simulates a successful payment provider callback.
 * Updates booking to CONFIRMED and clears balance (or marks as paid).
 */
export async function confirmBooking(bookingId: string): Promise<ActionResult<void>> {
    try {
        await prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({ where: { id: bookingId } });
            if (!booking) throw new Error("Booking not found");

            await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'CONFIRMED',
                    balanceDue: 0, // Paid in full
                    provisionalExpiresAt: null, // Clear expiration
                }
            });

            // Credit System Logic
            // If the user paid for the Monthly Package (£300), add 8 hours to their bank.
            // And assuming this current session counts towards it, we deduct the session hours?
            // "if they select 8 hours they a bank of 8hs that they can book"
            // Let's assume the purchase IS the first session.
            // +8 hours (Package) - 2 hours (Session Duration) = +6 hours NET gain.
            // We use the booking amount to detect the package for now (simplest without schema change for serviceId).

            if (booking.totalAmount === 300 && booking.clientId) {
                // Monthly Package Detected
                const sessionDurationHours = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);
                const bankAddition = 8 - sessionDurationHours;

                await tx.client.update({
                    where: { id: booking.clientId },
                    data: {
                        creditBalance: { increment: bankAddition },
                        status: 'Active' // Determine they are now an active client
                    }
                });
            } else if (booking.clientId) {
                // Normal Booking - Check if we should deduct credits?
                // For now, simpler: Just mark them Active.
                await tx.client.update({
                    where: { id: booking.clientId },
                    data: { status: 'Session Active' }
                });
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/clients');
        return { success: true, data: undefined };

    } catch (e) {
        console.error(e);
        return { success: false, error: "Payment simulation failed." };
    }
}
