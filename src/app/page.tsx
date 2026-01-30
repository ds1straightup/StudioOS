import Link from "next/link";
import StudioAccess from "./components/StudioAccess";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
        <h1 className="font-display text-[12vw] md:text-[8rem] font-bold leading-[0.9] tracking-tighter text-white mix-blend-screen cursor-default neon-text-white">
          THE BEAT<br />
          <span className="text-void-purple neon-text">FARDA</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
          YOUR SOUND. PERFECTED.<br />
          <span className="text-neutral-500 text-sm normal-case font-normal block mt-2">
            Turn listeners into fans with professional Audio Engineering, Cinematic Visuals & Websites.
          </span>
        </p>

        <div className="flex flex-col md:flex-row gap-6 mt-8 w-full md:w-auto">
          <Link href="/book" className="btn-primary w-full md:w-auto group">
            <span>BOOK A SESSION</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 transition-transform group-hover:translate-y-1"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
          </Link>
        </div>
      </div>

      {/* Studio Status / Access */}
      <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end pointer-events-none z-50">
        <div className="pointer-events-auto">
          <StudioAccess />
        </div>

        <div className="hidden md:block text-right font-mono text-[10px] text-void-purple uppercase tracking-widest opacity-60">
          FARDA SYSTEM // ONLINE<br />
          LOC: 51.5074° N, 0.1278° W
        </div>
      </div>
    </main >
  );
}
