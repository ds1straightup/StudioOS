import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    let user = await prisma.user.findUnique({ where: { email: 'admin@beatfarda.com' } })

    if (!user) {
        console.log("User not found, creating default...")
        user = await prisma.user.upsert({
            where: { email: 'admin@beatfarda.com' },
            update: {},
            create: {
                email: 'admin@beatfarda.com',
                subdomain: 'beatfarda',
                name: 'Beatfarda',
            },
        })
    }

    // Locked Booking
    const locked = await prisma.booking.create({
        data: {
            startTime: new Date(),
            endTime: new Date(),
            status: 'CONFIRMED',
            guestName: 'Test Artist (Locked)',
            balanceDue: 250.00,
            totalAmount: 500.00,
            userId: user.id,
            deliverables: {
                create: [
                    { name: 'Master_Final_v3.wav', s3Key: 'dummy', sizeBytes: 45000000, isLocked: true },
                    { name: 'Mix_Reference.mp3', s3Key: 'dummy2', sizeBytes: 5000000, isLocked: true }
                ]
            }
        }
    })

    // Paid Booking
    const paid = await prisma.booking.create({
        data: {
            startTime: new Date(),
            endTime: new Date(),
            status: 'CONFIRMED',
            guestName: 'Test Artist (Paid)',
            balanceDue: 0,
            totalAmount: 500.00,
            userId: user.id,
            deliverables: {
                create: [
                    { name: 'Album_Master.zip', s3Key: 'dummy3', sizeBytes: 150000000, isLocked: false }
                ]
            }
        }
    })

    console.log("VISUALIZATION_IDS:", JSON.stringify({ lockedId: locked.id, paidId: paid.id }))
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
