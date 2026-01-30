'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Mock S3 Upload (Admin)
export async function uploadDeliverable(bookingId: string, formData: FormData) {
    const name = formData.get('filename') as string;
    const size = Math.floor(Math.random() * 50000000) + 1000000; // Random size 1MB-50MB

    await prisma.deliverable.create({
        data: {
            bookingId,
            name,
            s3Key: `mock-s3-key/${name}`,
            sizeBytes: size,
            isLocked: true, // Locked by default until balance is 0
        }
    });

    revalidatePath(`/session/${bookingId}`);
    revalidatePath(`/vault/${bookingId}`);
}

// Client View
export async function getVaultData(bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            deliverables: true
        }
    });
    return booking;
}

// Pay Balance (Client)
export async function payBalance(bookingId: string) {
    // Mock Stripe Interaction
    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            balanceDue: 0,
            depositStatus: 'PAID', // Fully paid
            status: 'CONFIRMED'
        }
    });

    // Unlock all files
    await prisma.deliverable.updateMany({
        where: { bookingId },
        data: { isLocked: false }
    });

    revalidatePath(`/vault/${bookingId}`);
}
