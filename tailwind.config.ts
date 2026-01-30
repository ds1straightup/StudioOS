import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Void Palette
                black: '#050505',
                white: '#ffffff',
                void: {
                    black: '#050505',
                    glass: 'rgba(255, 255, 255, 0.03)',
                    border: 'rgba(255, 255, 255, 0.08)',
                    purple: '#a855f7', // Electric Purple
                    purpleGlow: 'rgba(168, 85, 247, 0.5)',
                    light: '#e9d5ff',
                }
            },
            fontFamily: {
                display: ['var(--font-syncopate)', 'sans-serif'],
                body: ['var(--font-space-grotesk)', 'sans-serif'],
            },
            // Animations removed as per user request (scan, pulse-fast, equalizer)
            boxShadow: {
                neon: '0 0 25px rgba(168,85,247,0.4)',
                'neon-strong': '0 0 40px rgba(168,85,247,0.6)',
            },
        },
    },
    plugins: [],
};
export default config;
