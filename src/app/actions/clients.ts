'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const STUDIO_OWNER_Email = 'admin@beatfarda.com'; // Hardcoded for single-tenant demo

export async function getClients() {
    return await prisma.client.findMany({
        where: { user: { email: STUDIO_OWNER_Email } },
        orderBy: { updatedAt: 'desc' },
        include: {
            _count: {
                select: { bookings: true }
            }
        }
    });
}

export async function createClient(formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
    }

    if (!rawData.email) return { success: false, error: "Email is required" };

    try {
        const user = await prisma.user.findUnique({ where: { email: STUDIO_OWNER_Email } });
        if (!user) throw new Error("Studio Owner not found");

        await prisma.client.create({
            data: {
                ...rawData,
                userId: user.id
            }
        });

        revalidatePath('/clients');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to create client" };
    }
}

export async function getClientDetails(clientId: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                bookings: {
                    orderBy: { startTime: 'desc' },
                    include: {
                        logs: true, // For future notes integration if needed
                        brief: true, // For service details
                    }
                }
            }
        });

        if (!client) return null;

        // Calculate Stats
        const totalSessions = client.bookings.length;
        const totalSpend = client.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const lastSession = client.bookings.length > 0 ? client.bookings[0].startTime : null;

        return {
            ...client,
            stats: {
                totalSessions,
                totalSpend,
                lastSession
            }
        };

    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function updateClientNotes(clientId: string, notes: string) {
    try {
        await prisma.client.update({
            where: { id: clientId },
            data: { notes }
        });
        revalidatePath(`/clients/${clientId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to update notes" };
    }
}

export async function deleteClient(clientId: string) {
    try {
        await prisma.client.delete({
            where: { id: clientId }
        });
        revalidatePath('/clients');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to delete client" };
    }
}

export async function updateClientStatus(clientId: string, status: string) {
    try {
        await prisma.client.update({
            where: { id: clientId },
            data: { status }
        });
        revalidatePath('/clients');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to update status" };
    }
}
