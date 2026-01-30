'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    // Don't show on root/home page
    if (pathname === '/') return null;

    return (
        <button
            onClick={() => router.back()}
            className="fixed top-6 left-6 z-50 p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-void-purple/50 transition-all duration-300 group shadow-lg"
            aria-label="Go Back"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
    );
}
