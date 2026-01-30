import type { Metadata } from "next";
import { Syncopate, Space_Grotesk } from "next/font/google";
import "./globals.css";
import StudioNav from "./components/StudioNav";
import BackButton from "./components/BackButton";

const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Beat Farda // STUDIO",
  description: "The Beat Farda. Audio Engineering, Music Production, Visuals & Websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-black" suppressHydrationWarning>
      <body className={`${syncopate.variable} ${spaceGrotesk.variable} font-body bg-black text-white selection:bg-void-purple selection:text-white overflow-x-hidden min-h-screen relative antialiased`} suppressHydrationWarning>
        {/* Main Content Wrapper */}
        <div className="relative z-10 w-full min-h-screen pb-24 md:pb-0">
          <BackButton />
          <StudioNav />
          {children}
        </div>
      </body>
    </html>
  );
}
