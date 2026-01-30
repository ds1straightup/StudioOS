
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany();
    console.log(users);

    console.log('\n--- CLIENTS ---');
    const clients = await prisma.client.findMany();
    console.log(clients);

    console.log('\n--- BOOKINGS ---');
    const bookings = await prisma.booking.findMany();
    console.log(JSON.stringify(bookings, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
