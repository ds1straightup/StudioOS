'use server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addDays, startOfDay, endOfDay } from 'date-fns';
import prisma from '@/lib/prisma';

export type DashboardData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    today: any[]; // Typed generically for now, will refine
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upcoming: any[];
};

export async function getDashboardSessions(): Promise<DashboardData> {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // Fetch Today's Sessions (The "Active" view)
    const today = await prisma.booking.findMany({
        where: {
            startTime: {
                gte: todayStart,
                lte: todayEnd,
            },
            status: { not: 'CANCELLED' }
        },
        include: {
            client: true,
            brief: true,
        },
        orderBy: { startTime: 'asc' }
    });

    // Fetch Future Sessions (The "Noise" - hidden by default)
    const upcoming = await prisma.booking.findMany({
        where: {
            startTime: {
                gt: todayEnd,
            },
            status: { not: 'CANCELLED' }
        },
        include: {
            client: true,
            brief: true,
        },
        orderBy: { startTime: 'asc' },
        take: 10, // Limit for relevance
    });

    return { today, upcoming };
}
