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
        await prisma.brief.create({
            data: {
                bookingId,
                bpm,
                key,
                referenceTracks: references,
                notes,
                // files: TODO S3 integration
            }
        });
    } catch (error) {
        console.error("Brief creation failed:", error);
        return { success: false, error: "Failed to save brief." };
    }

    // "Clarity in writing" - Success.
    // Redirect to a confirmation or the "Client Portal" (future Module F)
    // For now, redirect to the main site
    redirect('https://thebeatfarda.com');
}
