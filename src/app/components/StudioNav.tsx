'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, ClipboardList, Database, Plus, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudioNav() {
    const pathname = usePathname();

    // Hide on login/home page
    if (pathname === '/') return null;

    const navItems = [
        { name: 'Dashboard', sub: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Clients', sub: 'Roster', href: '/clients', icon: Users },
        { name: 'Knowledge Base', sub: 'Protocols', href: '/wiki', icon: BookOpen },
        { name: 'Briefing Room', sub: 'Intake', href: '/brief', icon: ClipboardList },
        { name: 'The Vault', sub: 'Deliverables', href: '/vault', icon: Database },
    ];

    return (
        <header className="fixed inset-0 z-40 pointer-events-none md:inset-auto md:bottom-0 md:left-0 md:w-full md:h-20 md:bg-black/80 md:backdrop-blur-xl md:border-t md:border-white/10">
            <div className="h-full w-full md:h-full md:max-w-7xl md:mx-auto md:px-6 flex flex-col md:flex-row items-center md:justify-between">

                {/* Branding - Studio OS */}
                {/* Mobile: Top Left, Absolute. Desktop: Static inside flex container */}
                <Link
                    href="/dashboard"
                    className="absolute top-6 left-6 pointer-events-auto md:static group flex flex-col leading-none"
                    title="Studio Dashboard"
                >
                    <span className="font-display text-xl font-bold tracking-tighter text-white group-hover:text-void-purple transition-colors relative z-10 neon-text-white uppercase shadow-black drop-shadow-md">
                        THE BEAT <span className="text-void-purple">FARDA</span>
                    </span>
                    <span className="text-[8px] font-mono text-neutral-500 tracking-[0.3em] uppercase group-hover:text-white transition-colors">
                        Farda Internal v6.5
                    </span>
                </Link>

                {/* Navigation Items - Centered Pill (Desktop) / Bottom Bar (Mobile) */}
                <nav className="fixed bottom-0 left-0 w-full h-16 bg-black/90 backdrop-blur-xl border-t border-white/10 pointer-events-auto md:static md:pointer-events-auto md:w-auto md:h-auto md:bg-white/5 md:border md:rounded-full md:p-1 flex items-center justify-around md:justify-center z-50">
                    {/* Public Site Link (Mobile Hidden, Desktop Visible) */}
                    <Link
                        href="/"
                        className="hidden md:flex p-2 text-neutral-500 hover:text-white hover:bg-white/10 rounded-full transition-colors items-center justify-center group mr-2"
                        title="Return to Public Site"
                    >
                        <Home size={16} className="group-hover:scale-110 transition-transform" />
                    </Link>

                    <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-full transition-all duration-300 relative group",
                                    isActive
                                        ? "text-void-purple md:bg-void-purple md:text-white md:shadow-glow"
                                        : "text-neutral-500 hover:text-white md:hover:bg-white/5"
                                )}
                            >
                                <Icon size={20} className="md:w-[14px] md:h-[14px]" />
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider md:block">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Book Session CTA */}
                    <Link
                        href="/book"
                        className="hidden md:flex items-center gap-2 bg-white text-black hover:bg-void-purple hover:text-white px-5 py-2.5 rounded-full transition-all font-bold text-xs uppercase tracking-widest shadow-neon hover:shadow-neon-strong"
                    >
                        <Plus size={14} />
                        <span>Book Session</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
