'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Clock } from 'lucide-react';

interface SessionTimerProps {
    endTime: Date;
}

export default function SessionTimer({ endTime }: SessionTimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isLowTime, setIsLowTime] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const diff = differenceInSeconds(new Date(endTime), now);
            setTimeLeft(Math.max(0, diff));
            setIsLowTime(diff < 900); // Less than 15 mins
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return (
        <div className={`glass-panel p-4 flex items-center justify-between transition-colors duration-500 ${isLowTime ? 'bg-red-500/10 border-red-500/30 animate-pulse-slow' : 'bg-surface/50 border-white/5'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLowTime ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-secondary'}`}>
                    <Clock size={18} />
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Session Remaining</div>
                    <div className={`font-mono text-xl font-bold ${isLowTime ? 'text-red-500' : 'text-white'}`}>
                        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </div>
                </div>
            </div>
            {isLowTime && (
                <div className="animate-pulse text-red-500 font-bold text-xs uppercase tracking-wider px-2 py-1 bg-red-500/10 rounded">
                    Ending Soon
                </div>
            )}
        </div>
    );
}
