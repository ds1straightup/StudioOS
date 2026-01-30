import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
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

    // WIPE DATA FOR FRESH START
    console.log('Wiping old data...');
    await prisma.deliverable.deleteMany({});
    await prisma.sessionLog.deleteMany({});
    await prisma.brief.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.knowledgeBaseItem.deleteMany({});

    // Seed Wiki Items (Restoring Knowledge Base)
    console.log('Seeding Wiki Items...');
    const wikiItems = [
        {
            category: "Technical Protocols & File Standards",
            title: "Core Standards",
            content: `### The Anti-Chaos Naming Convention.
\`YYYY-MM-DD_ArtistName_TrackTitle_BPM_Key_v1\`
No files leave the studio named 'Final_Final_v2'. We dislike last-minute chaos.

### Vocal Chain Template
*   **Inputs Pre-Routed:** \`Input 1\` (Mic) is already assigned to all recording tracks. No menu diving required.
*   **Track Hierarchy (Standardised):**
    *   Track 1: \`Lead Ref\` (For guide vocals).
    *   Track 2-5: \`Lead Rec\` (Playlists enabled).
    *   Track 6-7: \`Dbl L / Dbl R\` (Hard panned Left/Right).
    *   Track 8: \`Adlibs Center\`.
*   **Colour Coding:** Lead vocals = **Blue**, Adlibs = **Green**, Beat = **Red**. (Visual cues reduce cognitive load).
*   **The "Vibe" Sends (Pre-Loaded):** Reverb and Delay Aux tracks are created and active on the Lead track, but muted.
    *   *Action:* Unmute immediately upon recording so the artist hears a "finished" sound, not a dry signal.
*   **Low Latency Mode:** Enabled by default to prevent monitoring delay.
*   **The "Safety" Bus:** All vocal tracks routed to a \`VOCAL BUS\` with a Limiter set to -1dB to protect speakers from sudden loud bursts.

> "The goal of the One-Click Setup is Energy Management. If an artist has an idea, we must be recording within 30 seconds. Fiddling with routing kills the vibe. This template ensures technical invisibility."`
        },
        {
            category: "Client Boundaries & Booking Rules",
            title: "Policies & Expectations",
            content: `> 💡 Clear expectations upfront prevent friction later. We value written communication over vague chats.

**The Payment Rule:** No slot is confirmed until payment is received. We do not hold slots based on verbal promises.

### The No-Hype Onboarding Checklist
- [ ] Send New Client PDF (contains pricing & revision limits).
- [ ] Confirm: "Written communication is preferred for mix notes. no voice notes."
- [ ] State Studio Code: "No unannounced guests." (Prevents "unnecessary noise")
- [ ] Send "24-Hour Check-in" email (Confirming time and file delivery).

### Communication Protocols.
*   **Mix Revisions:** Must be sent via email in bullet points. "Calls should have a purpose, not just a chat".
*   **Late Arrival:** If you are >30 minutes late without notice, the session is cancelled, and the deposit is forfeited.
*   **File Delivery:** Files are sent only *after* the final balance is settled. No exceptions.`
        },
        {
            category: "The Calm Protocol (Session Psychology)",
            title: "Session Guidelines",
            content: `> 💡 "We prioritise calm over chaos. Your job is to manage the energy in the room, not just the mixing board."

### The Reset Switch (De-escalation Tactic)

### Pre-Session Environment Prep.
- [ ] **Lighting:** Dimmed. (Bright lights encourage anxiety; low light encourages focus).
- [ ] **Phone Policy:** All phone’s set to DND. No notifications during vocal takes.
- [ ] **Visual Clutter:** Hide unnecessary cables and unused gear. "Substance over image", if we aren't using it, it shouldn't be seen.
- [ ] **Hospitality:** Water placed within reach of the artist so the flow isn't broken.

### Feedback Scripts.
> "Do not say: 'That was bad.' Say: 'The energy dropped on that take. Let's match the intensity of the first verse.'"`
        },
        {
            category: "Automation & AI Workflows (Soon!)",
            title: "Roadmap",
            content: "Coming Soon..."
        }
    ];

    for (const item of wikiItems) {
        // Simple deduplication check based on title + user
        const exists = await prisma.knowledgeBaseItem.findFirst({
            where: {
                userId: beatfarda.id,
                title: item.title
            }
        });

        if (!exists) {
            await prisma.knowledgeBaseItem.create({
                data: {
                    ...item,
                    userId: beatfarda.id
                }
            });
        }
    }

    // Realistic Test Data Lists
    const firstNames = ["James", "Sarah", "Michael", "Jessica", "David", "Emily", "Robert", "Emma", "William", "Olivia", "Daniel", "Sophia", "Matthew", "Ava", "Joseph", "Isabella", "Lucas", "Mia", "Alexander", "Charlotte"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
    // Service Price List
    const serviceMenu = [
        { name: "Vocal Recording", rate: 0, type: "tiered" }, // 1h=45, 2h=80, 3h=100
        { name: "Mixing Session", rate: 150, type: "flat" },
        { name: "Mixing & Mastering", rate: 200, type: "flat" }, // Mixing (150) + Mastering (50)
        { name: "Mastering", rate: 50, type: "flat" },
        { name: "Custom Instrumental", rate: 300, type: "flat" },
        { name: "Songwriting Session", rate: 30, type: "hourly" },
        { name: "Podcast Recording", rate: 45, type: "hourly" },
        { name: "Voiceover", rate: 40, type: "hourly" },
        { name: "Album Consultation", rate: 100, type: "flat" }
    ];

    console.log('Seeding 20 Clients and Bookings...');

    const clients = [];

    for (let i = 0; i < 20; i++) {
        const firstName = firstNames[i];
        const lastName = lastNames[i];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

        // Check if client exists to avoid unique constraint error
        const existingClient = await prisma.client.findUnique({
            where: {
                userId_email: {
                    userId: beatfarda.id,
                    email: email
                }
            }
        });

        if (existingClient) {
            // Already seeded this client
            clients.push(existingClient);
            continue;
        }

        const hasBrief = Math.random() > 0.3; // 70% have brief

        // Create Client
        const client = await prisma.client.create({
            data: {
                email,
                name: fullName,
                userId: beatfarda.id,
                status: "Active",
            }
        });

        // Create Bookings (Varied amount: 0-14 per client)
        const numBookings = Math.floor(Math.random() * 15);

        // Vary the timeline strategy for each client
        const timelineRandom = Math.random();
        let timelineStrategy;
        if (timelineRandom < 0.7) {
            timelineStrategy = 0; // 70% Past-only
        } else if (timelineRandom < 0.85) {
            timelineStrategy = 1; // 15% Upcoming-only
        } else {
            timelineStrategy = 2; // 15% Mixed
        }
        // 0 = Past-only (ended 30-90 days ago)
        // 1 = Upcoming-only (starting 1-60 days from now)
        // 2 = Mixed (started in past, extends to future)

        let sessionDate = new Date();
        if (timelineStrategy === 0) {
            // Past-only: start 60-90 days ago
            sessionDate.setDate(sessionDate.getDate() - (60 + Math.floor(Math.random() * 30)));
        } else if (timelineStrategy === 1) {
            // Upcoming-only: start 1-10 days from now
            sessionDate.setDate(sessionDate.getDate() + (1 + Math.floor(Math.random() * 10)));
        } else {
            // Mixed: start 50-70 days ago (so most will be past, some future)
            sessionDate.setDate(sessionDate.getDate() - (50 + Math.floor(Math.random() * 20)));
        }
        sessionDate.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0);

        // Brief completion strategy (varies by client)
        const briefCompletionRate = Math.random();
        // 0-0.3 = Low completion (30% complete)
        // 0.3-0.7 = Medium completion (60% complete)
        // 0.7-1.0 = High completion (90% complete)

        for (let j = 0; j < numBookings; j++) {
            // Each subsequent booking is 7-14 days after the previous one
            if (j > 0) {
                const daysGap = 7 + Math.floor(Math.random() * 8); // 7-14 days
                const nextDate = new Date(sessionDate);
                nextDate.setDate(nextDate.getDate() + daysGap);

                // If past-only strategy, don't leak into the future
                if (timelineStrategy === 0 && nextDate >= new Date()) {
                    break; // stop generating for this client
                }
                sessionDate = nextDate;
                sessionDate.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0);
            }

            // Select Service
            const service = serviceMenu[Math.floor(Math.random() * serviceMenu.length)];

            // Adjust duration based on service type
            let durationHours = 2; // default
            if (service.name === "Vocal Recording") {
                // 1, 2, or 3 hours
                durationHours = Math.floor(Math.random() * 3) + 1;
            } else if (service.type === "hourly") {
                durationHours = 2 + Math.floor(Math.random() * 3); // 2-4 hours
            } else {
                durationHours = 2; // Flat rate usually implies a session block
            }

            const endTime = new Date(sessionDate);
            endTime.setHours(sessionDate.getHours() + durationHours);

            const isPast = sessionDate < new Date();
            const status = isPast ? "COMPLETED" : "CONFIRMED";

            // Financial logic based on Service
            let totalAmount = 0;
            if (service.name === "Vocal Recording") {
                if (durationHours === 1) totalAmount = 45;
                else if (durationHours === 2) totalAmount = 80;
                else if (durationHours >= 3) totalAmount = 100 + ((durationHours - 3) * 30); // 100 for 3h, +30/h after
            } else if (service.type === "hourly") {
                totalAmount = durationHours * service.rate;
            } else {
                totalAmount = service.rate;
            }

            const depositAmount = totalAmount * 0.5;

            // Randomize payment status
            const isFullyPaid = isPast ? Math.random() > 0.1 : Math.random() > 0.6; // Past sessions mostly paid
            const depositStatus = "PAID"; // Assume deposit always paid
            const balanceDue = isFullyPaid ? 0 : (totalAmount - depositAmount);

            // Create Booking
            const booking = await prisma.booking.create({
                data: {
                    userId: beatfarda.id,
                    clientId: client.id,
                    serviceName: service.name,
                    startTime: sessionDate,
                    endTime: endTime,
                    guestName: fullName,
                    guestEmail: email,
                    status: status,
                    totalAmount: totalAmount,
                    depositAmount: depositAmount,
                    depositStatus: depositStatus,
                    balanceDue: balanceDue,
                }
            });

            // CREATE BRIEF based on completion rate
            // Higher completion for past sessions, ensure "most" are completed
            let shouldCreateBrief = false;
            if (isPast) {
                // Past sessions: 95% completion to satisfy "most of sessions completed"
                shouldCreateBrief = Math.random() < 0.95;
            } else {
                // Upcoming sessions: lower completion rate (some prep ahead)
                if (briefCompletionRate < 0.3) shouldCreateBrief = Math.random() < 0.1;
                else if (briefCompletionRate < 0.7) shouldCreateBrief = Math.random() < 0.3;
                else shouldCreateBrief = Math.random() < 0.5;
            }

            if (shouldCreateBrief) {
                const keys = ["Am", "C", "Gm", "Em", "F", "Dm", "G"];
                await prisma.brief.create({
                    data: {
                        bookingId: booking.id,
                        bpm: (120 + Math.floor(Math.random() * 40)).toString(),
                        key: keys[Math.floor(Math.random() * keys.length)],
                        referenceTracks: `https://spotify.com/track/random${i}${j}\nhttps://youtube.com/watch?v=random${i}${j}`,
                        notes: `Looking for a ${service.name} vibe.`, // Pattern matcher expects this
                    }
                });
            }
        }

        clients.push(client);
    }

    console.log(`Seeding Complete. Wiki items synced.`);
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
