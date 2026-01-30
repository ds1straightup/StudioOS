'use client';

import { deleteClient } from '@/app/actions/clients';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteClientButton({ clientId }: { clientId: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation to client detail

        if (!confirm('Are you sure you want to delete this client? This cannot be undone.')) return;

        setLoading(true);
        await deleteClient(clientId);
        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-danger/50 hover:text-danger hover:underline transition-colors uppercase tracking-widest font-mono flex items-center justify-end gap-1 ml-auto"
        >
            {loading ? <Loader2 size={12} className="animate-spin" /> : null}
            DELETE
        </button>
    );
}
