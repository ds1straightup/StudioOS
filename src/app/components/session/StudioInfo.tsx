import { Wifi, Info } from 'lucide-react';

export default function StudioInfo() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-3 bg-white/5 border-white/5 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/10 transition-colors">
                <Wifi size={16} className="text-void-purple" />
                <div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Wi-Fi</div>
                    <div className="text-xs font-bold text-white">Studio_5G</div>
                    <div className="text-[10px] font-mono text-neutral-500">Pass: fardavision</div>
                </div>
            </div>

            <div className="glass-panel p-3 bg-white/5 border-white/5 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/10 transition-colors">
                <Info size={16} className="text-void-purple" />
                <div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Help</div>
                    <div className="text-xs font-bold text-white pointer-events-none">Room Rules</div>
                    <div className="text-[10px] font-mono text-neutral-500">Scan QR on Door</div>
                </div>
            </div>
        </div>
    );
}
