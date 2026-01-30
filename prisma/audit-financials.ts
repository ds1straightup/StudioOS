
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Financial Integrity Check ---');
    const bookings = await prisma.booking.findMany();

    let errors = 0;
    for (const booking of bookings) {
        const expectedBalance = booking.totalAmount - booking.depositAmount;
        // Float comparison check with small epsilon
        if (Math.abs(booking.balanceDue - expectedBalance) > 0.01) {
            console.log(`[DISCREPANCY] Booking ${booking.id}:`);
            console.log(`  Total: ${booking.totalAmount}, Deposit: ${booking.depositAmount}`);
            console.log(`  Stored Balance: ${booking.balanceDue}, Expected: ${expectedBalance}`);

            // Fix it
            await prisma.booking.update({
                where: { id: booking.id },
                data: { balanceDue: expectedBalance }
            });
            console.log(`  -> FIXED.`);
            errors++;
        }
    }

    if (errors === 0) {
        console.log('No financial discrepancies found.');
    } else {
        console.log(`Fixed ${errors} financial discrepancies.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
