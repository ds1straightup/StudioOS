import prisma from "@/lib/prisma";
import { addMinutes, startOfDay, endOfDay, isBefore, isAfter, setHours, setMinutes } from "date-fns";

// --- Types ---
export interface Service {
    id: string;
    durationMinutes: number;
    bufferBefore?: number;
    bufferAfter?: number;
}

export interface AvailabilitySlot {
    start: Date;
    end: Date;
    available: boolean;
}

// --- Configuration (Will be moved to DB later) ---
const STUDIO_CONFIG = {
    globalBufferBefore: 15,
    globalBufferAfter: 15,
    minLeadTimeHours: 24, // Hard rule: No same-day bookings < 24h
    dayStartHour: 10,
    dayEndHour: 22,
};

// --- Booking Engine ---

export class BookingEngine {

    /**
     * Calculates available slots for a given service on a specific date in UTC.
     * Respects: Global Buffers, Service Buffers, Existing Bookings.
     */
    static async getAvailableSlots(
        targetDate: Date,
        service: Service
    ): Promise<AvailabilitySlot[]> {

        // 1. Define Search Range (Standard Studio Day in UTC)
        // NOTE: In a real app, handle timezone offsets. 
        // For V1, assuming server time or simplistic 10am-10pm logic.

        const dayStart = setMinutes(setHours(startOfDay(targetDate), STUDIO_CONFIG.dayStartHour), 0);
        const dayEnd = setMinutes(setHours(startOfDay(targetDate), STUDIO_CONFIG.dayEndHour), 0);

        const now = new Date();
        const minStartTime = addMinutes(now, STUDIO_CONFIG.minLeadTimeHours * 60);

        // 2. Fetch Existing Bookings for this day
        // We fetch a bit wider to catch overlaps
        let bookings: { startTime: Date; endTime: Date; status: string }[] = [];
        try {
            bookings = await prisma.booking.findMany({
                where: {
                    startTime: {
                        gte: startOfDay(targetDate), // All bookings today
                        lt: endOfDay(targetDate)
                    },
                    status: { not: "CANCELLED" }
                }
            });
        } catch (error) {
            console.error("BookingEngine DB Error:", error);
            // Fallback: No bookings found (risk of double booking if DB down, but prevents crash)
        }

        // 3. Calculate Required Buffers (MAX Logic)
        // The slot needs: MAX(GlobalBefore, ServiceBefore)
        // And leaves: MAX(GlobalAfter, ServiceAfter)
        const requiredBufferBefore = Math.max(STUDIO_CONFIG.globalBufferBefore, service.bufferBefore || 0);
        const requiredBufferAfter = Math.max(STUDIO_CONFIG.globalBufferAfter, service.bufferAfter || 0);

        // 4. Generate Candidates
        const slots: AvailabilitySlot[] = [];
        let cursor = dayStart;

        // Step size: 30 mins
        while (addMinutes(cursor, service.durationMinutes) <= dayEnd) {

            const slotStart = cursor;
            const slotEnd = addMinutes(cursor, service.durationMinutes);

            // Check Lead Time
            if (isBefore(slotStart, minStartTime)) {
                cursor = addMinutes(cursor, 30);
                continue;
            }

            // Check Conflicts
            // For a slot to be valid, the range [Start - BufferBefore, End + BufferAfter]
            // must NOT intersect with any existing booking's [Start - BookBufferBefore, End + BookBufferAfter]

            // Simplification for V1: 
            // We treat existing bookings as hard blocks [BookingStart, BookingEnd].
            // We check if (SlotStart - BufferBefore) < BookingEnd AND (SlotEnd + BufferAfter) > BookingStart

            let isConflict = false;
            for (const booking of bookings) {
                // Effective Range of the Potential Slot
                const effectiveSlotStart = addMinutes(slotStart, -requiredBufferBefore);
                const effectiveSlotEnd = addMinutes(slotEnd, requiredBufferAfter);

                // Effective Range of the Existing Booking (Assumes standard buffer was applied)
                // To be safe, we assume existing bookings need their own clean-up time too.
                // But for conflict detection, simply checking overlap of "Occupied Time" is often enough
                // if we ensure we add buffers to OUR slot.

                // Overlap Logic: StartA < EndB && EndA > StartB
                if (isBefore(effectiveSlotStart, booking.endTime) && isAfter(effectiveSlotEnd, booking.startTime)) {
                    isConflict = true;
                    break;
                }
            }

            if (!isConflict) {
                slots.push({ start: slotStart, end: slotEnd, available: true });
            }

            cursor = addMinutes(cursor, 30);
        }

        return slots;
    }
}
