import { getVaultData, payBalance } from '@/app/actions/vault';
import { notFound } from 'next/navigation';
// import StudioNav from '@/app/components/StudioNav';

export default async function VaultPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = await params;
    const booking = await getVaultData(bookingId);

    if (!booking) notFound();

    const isLocked = booking.balanceDue > 0;

    async function handlePayment() {
        'use server';
        await payBalance(bookingId);
    }

    // Helper to format bytes
    const formatSize = (bytes: number) => {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="min-h-screen px-8 pt-12 pb-32 bg-background text-text flex justify-center font-body animate-fade-in">

            <div className="max-w-2xl w-full space-y-8">

                {/* Header */}
                <header className="border-b border-border pb-6 text-center">
                    <h1 className="h1-display text-primary uppercase tracking-widest text-4xl">THE VAULT</h1>
                    <p className="text-text-muted mt-2">
                        Secure Asset Delivery for <span className="text-text font-bold">{booking.guestName}</span>
                    </p>
                </header>

                {/* Invoice Status */}
                <div className={`p-6 rounded-lg border flex justify-between items-center shadow-lg transition-all ${isLocked ? 'border-danger/30 bg-danger/5' : 'border-success/30 bg-success/5'}`}>
                    <div>
                        <div className="text-xs uppercase tracking-widest font-bold text-text-muted">Outstanding Balance</div>
                        <div className={`text-4xl font-heading mt-1 ${isLocked ? 'text-danger' : 'text-success'}`}>
                            £{booking.balanceDue.toFixed(2)}
                        </div>
                    </div>

                    {isLocked ? (
                        <form action={handlePayment}>
                            <button className="btn bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/20 border-none">
                                PAY TO UNLOCK
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center gap-2 text-success font-bold px-4 py-2 bg-success/10 rounded-full">
                            <span>✓ PAID IN FULL</span>
                        </div>
                    )}
                </div>

                {/* Deliverables List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-l-4 border-cta pl-3 text-white">
                        Deliverables
                    </h2>

                    {booking.deliverables.length === 0 ? (
                        <div className="text-text-muted italic text-center p-8 border border-dashed border-border rounded-lg">
                            No files uploaded yet.
                        </div>
                    ) : (
                        booking.deliverables.map((file) => (
                            <div key={file.id} className="card flex justify-between items-center group hover:border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className={`text-2xl p-3 rounded-lg ${file.isLocked ? 'bg-surface-hover grayscale opacity-50' : 'bg-primary/10 text-primary'}`}>
                                        🎵
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{file.name}</div>
                                        <div className="text-xs text-text-muted font-mono">{formatSize(file.sizeBytes)}</div>
                                    </div>
                                </div>

                                {file.isLocked ? (
                                    <button disabled className="btn btn-outline border-border text-text-muted cursor-not-allowed opacity-50">
                                        🔒 LOCKED
                                    </button>
                                ) : (
                                    <button className="btn btn-outline border-success text-success hover:bg-success hover:text-background font-bold">
                                        DOWNLOAD ↓
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
