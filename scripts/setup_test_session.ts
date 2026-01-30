
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Setting up test session...');

    // 1. Get or Create User
    let user = await prisma.user.findFirst({
        where: { email: 'admin@beatfarda.com' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'admin@beatfarda.com',
                subdomain: 'beatfarda',
                name: 'Beatfarda',
            }
        });
        console.log('Created User');
    }

    // 2. Get or Create Client
    let client = await prisma.client.findFirst({
        where: { userId: user.id } // Just grab any client
    });

    if (!client) {
        client = await prisma.client.create({
            data: {
                userId: user.id,
                name: 'Test Artist',
                email: 'test@artist.com',
                status: 'Active'
            }
        });
        console.log('Created Client');
    }

    // 3. Create a Session for TODAY (Now -> +2 hours)
    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const booking = await prisma.booking.create({
        data: {
            userId: user.id,
            clientId: client.id,
            serviceName: 'Vocal Recording',
            startTime: now,
            endTime: endTime,
            guestName: client.name,
            guestEmail: client.email,
            status: 'CONFIRMED',
            totalAmount: 100,
            depositAmount: 50,
            depositStatus: 'PAID',
            balanceDue: 50,
        }
    });

    console.log(`TEST_SESSION_ID: ${booking.id}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
