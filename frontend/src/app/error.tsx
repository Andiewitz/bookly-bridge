'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md">
                {/* Icon */}
                <div className="mb-8 w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={40} className="text-red-500" />
                </div>

                <h2 className="font-display text-3xl font-bold text-white mb-4 uppercase tracking-tighter italic">
                    Static on the <span className="text-red-500">Line</span>
                </h2>

                <p className="text-[#bcad9a] text-lg mb-10 font-medium">
                    Something went wrong while processing the rhythm. Don't worry, we can try to patch it back in.
                </p>

                {/* Reset Button */}
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-3 px-8 py-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-white hover:border-red-500/50 hover:bg-white/5 transition-all group"
                >
                    <RotateCcw size={16} className="text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                    Try Again
                </button>

                <div className="mt-20 text-[10px] uppercase tracking-widest text-white/10 font-display font-medium">
                    Error ID: {error.digest || 'unknown'}
                </div>
            </div>
        </div>
    );
}
