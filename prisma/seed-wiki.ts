
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const STUDIO_OWNER_Email = 'admin@beatfarda.com';

async function main() {
    console.log('Start seeding Wiki...');

    const user = await prisma.user.findUnique({ where: { email: STUDIO_OWNER_Email } });
    if (!user) {
        console.error('Studio Owner not found.');
        return;
    }

    // Clear existing items for this user
    console.log('Clearing old wiki items...');
    await prisma.knowledgeBaseItem.deleteMany({
        where: { userId: user.id }
    });

    const wikiItems = [
        {
            category: 'Technical Standards',
            title: 'Technical Protocols & File Standards',
            content: `The Anti-Chaos Naming Convention

YYYY-MM-DD_ArtistName_TrackTitle_BPM_Key_v1

No files leave the studio named 'Final_Final_v2'. We dislike last-minute chaos.

Vocal Chain Template

• Inputs Pre-Routed: Input 1 (Mic) is already assigned to all recording tracks. No menu diving required.

• Track Hierarchy (Standardised):
   - Track 1: Lead Ref (For guide vocals)
   - Track 2-5: Lead Rec (Playlists enabled)
   - Track 6-7: Dbl L / Dbl R (Hard panned Left/Right)
   - Track 8: Adlibs Center

• Colour Coding: Lead vocals = Blue, Adlibs = Green, Beat = Red. (Visual cues reduce cognitive load).

• The "Vibe" Sends (Pre-Loaded): Reverb and Delay Aux tracks are created and active on the Lead track, but muted.
   - Action: Unmute immediately upon recording so the artist hears a "finished" sound, not a dry signal.

• Low Latency Mode: Enabled by default to prevent monitoring delay.

• The "Safety" Bus: All vocal tracks routed to a VOCAL BUS with a Limiter set to -1dB to protect speakers from sudden loud bursts.

"The goal of the One-Click Setup is Energy Management. If an artist has an idea, we must be recording within 30 seconds. Fiddling with routing kills the vibe. This template ensures technical invisibility."`
        },
        {
            category: 'Workflow',
            title: 'Client Boundaries & Booking Rules',
            content: `💡 Clear expectations upfront prevent friction later. We value written communication over vague chats.

The Payment Rule: No slot is confirmed until payment is received. We do not hold slots based on verbal promises.

The No-Hype Onboarding Checklist

☐ Send New Client PDF (contains pricing & revision limits).
☐ Confirm: "Written communication is preferred for mix notes. no voice notes."
☐ State Studio Code: "No unannounced guests." (Prevents "unnecessary noise")
☐ Send "24-Hour Check-in" email (Confirming time and file delivery).

Communication Protocols

• Mix Revisions: Must be sent via email in bullet points. "Calls should have a purpose, not just a chat".
• Late Arrival: If you are >30 minutes late without notice, the session is cancelled, and the deposit is forfeited.
• File Delivery: Files are sent only after the final balance is settled. No exceptions.`
        },
        {
            category: 'De-escalation',
            title: 'The Calm Protocol (Session Psychology)',
            content: `💡 "We prioritise calm over chaos. Your job is to manage the energy in the room, not just the mixing board."

The Reset Switch (De-escalation Tactic)

• Trigger: If an artist becomes visibly frustrated, aggressive, or starts making "emotional decisions" regarding the music.
• The Action: Do not push through. Stop the playback.
• The Script: "My ears are fatigued. We are taking a mandatory 10-minute silence break outside the room."
• The Result: This breaks the chaotic loop and resets the room's focus.

Pre-Session Environment Prep

☐ Lighting: Dimmed. (Bright lights encourage anxiety; low light encourages focus).
☐ Phone Policy: All phones set to DND. No notifications during vocal takes.
☐ Visual Clutter: Hide unnecessary cables and unused gear. "Substance over image", if we aren't using it, it shouldn't be seen.
☐ Hospitality: Water placed within reach of the artist so the flow isn't broken.

Feedback Scripts

"Do not say: 'That was bad.' Say: 'The energy dropped on that take. Let's match the intensity of the first verse.'"

"Do not say: 'You are off beat.' Say: 'The flow is cool, but let's lock in tighter with the snare on the next pass.'"

"Do not say: 'I don't like that melody.' Say: 'That works, but let's explore a variation that lifts the energy even higher for the chorus.'"`
        },
        {
            category: 'Technical Standards',
            title: 'Automation & AI Workflows',
            content: `(Coming Soon)`
        }
    ];

    for (const item of wikiItems) {
        await prisma.knowledgeBaseItem.create({
            data: {
                ...item,
                userId: user.id
            }
        });
        console.log(`Created: ${item.title}`);
    }

    console.log('Wiki formatting complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
