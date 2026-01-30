'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function saveBrief(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const bpm = formData.get('bpm') as string;
    const key = formData.get('key') as string;
    const references = formData.get('references') as string;
    const notes = formData.get('notes') as string;

    if (!bookingId || !bpm || !key) {
        return { success: false, error: "Mission critical data missing." };
    }

    try {
        await prisma.brief.upsert({
            where: { bookingId },
            update: {
                bpm,
                key,
                referenceTracks: references,
                notes,
            },
            create: {
                bookingId,
                bpm,
                key,
                referenceTracks: references,
                notes,
            }
        });
    } catch (error) {
        console.error("Brief update failed:", error);
        return { success: false, error: "Failed to save brief." };
    }

    // "Clarity in writing" - Success.
    redirect('/dashboard');
}
