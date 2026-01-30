'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const STUDIO_OWNER_Email = 'admin@beatfarda.com';

export async function getWiki() {
    const items = await prisma.knowledgeBaseItem.findMany({
        where: { user: { email: STUDIO_OWNER_Email } },
        orderBy: { category: 'asc' } // Simple sort
    });

    // Group by category manually since minimal SQLite support
    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    }
    return grouped;
}

export async function createWikiItem(formData: FormData) {
    const rawData = {
        category: formData.get('category') as string,
        title: formData.get('title') as string,
        content: formData.get('content') as string,
    }

    if (!rawData.title || !rawData.content) return { success: false, error: "Missing fields" };

    try {
        const user = await prisma.user.findUnique({ where: { email: STUDIO_OWNER_Email } });
        if (!user) throw new Error("Studio Owner not found");

        await prisma.knowledgeBaseItem.create({
            data: {
                ...rawData,
                userId: user.id
            }
        });

        revalidatePath('/wiki');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to create item" };
    }
}
