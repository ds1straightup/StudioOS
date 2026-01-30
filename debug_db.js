const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const bookingCount = await prisma.booking.count();
        console.log(`Total Bookings: ${bookingCount}`);

        const booking = await prisma.booking.findFirst({
            include: {
                client: true,
                brief: true,
                logs: { take: 1 }
            }
        });

        if (booking) {
            console.log('Latest Booking Sample:', JSON.stringify(booking, null, 2));
        } else {
            console.log('No bookings found.');
        }
    } catch (e) {
        console.error('Error querying DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
