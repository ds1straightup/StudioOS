
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const deleted = await prisma.client.deleteMany({
        where: {
            OR: [
                { email: 'test@beatfarda.com' },
                { name: { contains: 'Test' } }
            ]
        }
    });
    console.log(`Deleted ${deleted.count} test clients.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
