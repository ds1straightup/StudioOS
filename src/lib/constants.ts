
export const SERVICES = [
    // STUDIO SESSIONS
    {
        id: "svc_vocal_1h",
        name: "1 Hour Studio Session",
        category: "STUDIO SESSIONS",
        durationMinutes: 60,
        price: 45,
        bufferBefore: 30,
        bufferAfter: 0,
        description: "Includes engineer, recording, session setup, and guidance during takes. Files exported at the end."
    },
    {
        id: "svc_vocal_2h",
        name: "2 Hour Studio Session",
        category: "STUDIO SESSIONS",
        durationMinutes: 120,
        price: 80,
        bufferBefore: 30,
        bufferAfter: 0,
        description: "Includes engineer, recording, session setup, and guidance during takes. Files exported at the end."
    },
    {
        id: "svc_vocal_3h",
        name: "3 Hour Studio Session",
        category: "STUDIO SESSIONS",
        durationMinutes: 180,
        price: 100,
        bufferBefore: 30,
        bufferAfter: 0,
        description: "Includes engineer, recording, session setup, and guidance during takes. Files exported at the end."
    },

    // PRODUCTION SERVICES
    {
        id: "svc_prod_custom",
        name: "Custom Beat / Instrumental",
        category: "PRODUCTION SERVICES",
        durationMinutes: 0, // Quote based / consultation
        price: 300,
        bufferBefore: 0,
        bufferAfter: 0,
        description: "Music Production (Instrumentals / Full Track Creation). Price varies depending on complexity, genre, and revisions. Starts from £300."
    },

    // MIXING & MASTERING
    {
        id: "svc_mix_std",
        name: "Standard Mix & Master",
        category: "MIXING & MASTERING",
        durationMinutes: 0, // Standalone service
        price: 150,
        bufferBefore: 0,
        bufferAfter: 0,
        description: "Includes: One full mix, One master, Up to 2 revisions."
    },
    {
        id: "svc_mix_addon",
        name: "Mixing & Mastering Add-On",
        category: "MIXING & MASTERING",
        durationMinutes: 0, // Add-on
        price: 50,
        bufferBefore: 0,
        bufferAfter: 0,
        description: "Must be booked alongside a 3-hour studio session. Normal Value £120."
    },

    // PACKAGE DEALS
    {
        id: "svc_pkg_monthly",
        name: "Monthly Studio Package (8 Hours)",
        category: "PACKAGE DEALS",
        durationMinutes: 120, // Books the first 2-hour session, banks the rest
        // Actually, packages usually mean buying credits. For V1 booking, we might just list it or treat as a "buy now" item.
        // Let's treat it as a purchasable item that doesn't book a specific slot immediately, or just a 2-hour block bookable under this rate?
        // User says: "£80 per 2-hour block, paid upfront".
        // For simplicity in this "Booking System V1", let's list it as a purchasable item or just informational since the user said "Full payment required upfront".
        price: 300,
        bufferBefore: 0,
        bufferAfter: 0,
        description: "8 Hours Per Month (£75 per 2-hour block). Discounted rate for regular clients. Hours must be used within the same month."
    },

    // DESIGN & DIGITAL
    {
        id: "svc_design_generic",
        name: "Artwork / Flyers / Digital Assets",
        category: "DESIGN & DIGITAL",
        durationMinutes: 0,
        price: 50,
        bufferBefore: 0,
        bufferAfter: 0,
        description: "Starts from £50. Web & Digital Projects quoted per project."
    }
];
