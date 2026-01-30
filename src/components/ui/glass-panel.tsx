import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists, if not I will just use template literals or install clsx/tailwind-merge. Actually I should check if utils exists.

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverEffect?: boolean;
    className?: string;
}

export function GlassPanel({ children, hoverEffect = true, className, ...props }: GlassPanelProps) {
    return (
        <div
            className={cn(
                "glass-panel relative rounded-xl p-6 transition-all duration-300",
                hoverEffect && "hover:border-void-purple group",
                className
            )}
            {...props}
        >
            {/* Scanner Line Effect - Only if hoverEffect is true - REMOVED per request */}

            {/* Content */}
            <div className="relative z-20">
                {children}
            </div>

            {/* Background Noise/Gradient (Optional, can be added here) */}
        </div>
    );
}
