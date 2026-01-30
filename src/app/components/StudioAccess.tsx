'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, X, ArrowRight } from 'lucide-react';

export default function StudioAccess() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [pin, setPin] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState(false);
    const [savedPin, setSavedPin] = useState("0000");

    // Load PIN from local storage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('studio_pin');
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (stored) setSavedPin(stored);
        }
    }, []);

    const verifyPin = (inputPin: string) => {
        if (inputPin === savedPin) {
            setIsVerifying(true);
            setError(false);

            // Artificial delay to allow browser to save password and show success state
            setTimeout(() => {
                setIsAuthenticated(true);
                setPin("");
                router.push('/dashboard');
            }, 1000);
        } else {
            setError(true);
            setPin("");
            setTimeout(() => setError(false), 2000);
        }
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPin(value);
        if (value.length === 4) {
            // Small delay before triggering verify to ensure last char renders
            // and browser autofill logic completes
            setTimeout(() => verifyPin(value), 300);
        }
    };

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyPin(pin);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setPin("");
            setError(false);
        }
    };

    // If authenticated, we hide the access control (redirect handled in verifyPin)
    if (isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-auto">
            {/* Expanded Menu / Auth Modal */}
            {isOpen && (
                <div className="bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl w-80 animate-in slide-in-from-bottom-10 fade-in duration-200">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                        <h3 className="font-heading text-lg text-white tracking-wide uppercase">
                            Security Check
                        </h3>
                        <button onClick={toggleOpen} className="text-text-muted hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handlePinSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Access Code</label>
                            <input
                                type="password"
                                autoFocus
                                value={pin}
                                onChange={handlePinChange}
                                placeholder="••••"
                                disabled={isVerifying}
                                className={`w-full bg-black/50 border rounded-lg p-3 text-center text-white text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 transition-all
                                    ${error
                                        ? 'border-red-500 text-red-500 focus:ring-red-500/50 animate-shake'
                                        : isVerifying
                                            ? 'border-green-500 text-green-500 animate-pulse'
                                            : 'border-white/10 focus:border-void-purple focus:ring-void-purple/50'
                                    }
                                `}
                                maxLength={4}
                            />
                            {error && <p className="text-xs text-danger text-center font-bold">ACCESS DENIED</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isVerifying}
                            className={`w-full btn btn-primary py-3 transition-opacity ${isVerifying ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {isVerifying ? 'Accessing...' : 'Verify Identity'} {!isVerifying && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            )}

            {/* Shield Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleOpen}
                    className="h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-white/5 border border-white/10 text-text-muted hover:bg-primary hover:text-white hover:border-primary"
                >
                    <Shield size={24} />
                </button>
            )}

            {/* Close Toggle Button (only when open) */}
            {isOpen && (
                <button
                    onClick={toggleOpen}
                    className="h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-surface text-text-muted rotate-90"
                >
                    <X size={24} />
                </button>
            )}
        </div>
    );
}
