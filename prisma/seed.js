const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding...');
    const beatfarda = await prisma.user.upsert({
        where: { email: 'admin@beatfarda.com' },
        update: {},
        create: {
            email: 'admin@beatfarda.com',
            subdomain: 'beatfarda',
            name: 'Beatfarda',
        },
    });
    console.log('Seeded User:', beatfarda);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
