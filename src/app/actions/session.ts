'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSessionDetails(bookingId: string) {
    return await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            client: true,
            brief: true,
            logs: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}

export async function addSessionLog(bookingId: string, content: string) {
    if (!content.trim()) return;

    await prisma.sessionLog.create({
        data: {
            bookingId,
            content,
        }
    });

    revalidatePath(`/session/${bookingId}`);
}
