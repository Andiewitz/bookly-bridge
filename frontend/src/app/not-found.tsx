'use client';

import Link from 'next/link';
import { Music2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff8c00]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md">
                {/* Logo / Icon */}
                <div className="mb-8 w-20 h-20 bg-gradient-to-tr from-[#ff8c00] to-[#ffae00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,140,0,0.3)] animate-pulse-slow">
                    <Music2 size={40} className="text-[#121212]" />
                </div>

                {/* Text Content */}
                <h1 className="font-display text-[120px] font-black leading-none text-white opacity-20 select-none">
                    404
                </h1>

                <h2 className="font-display text-3xl font-bold text-white mt-[-40px] mb-4 uppercase tracking-tighter italic">
                    Off the <span className="text-[#ff8c00]">Beat</span>
                </h2>

                <p className="text-[#bcad9a] text-lg mb-10 font-medium">
                    The stage you're looking for doesn't exist. It looks like the rhythm got lost in translation.
                </p>

                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-8 py-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-white hover:border-[#ff8c00] hover:bg-[#ff8c00]/5 hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all group"
                >
                    <ArrowLeft size={16} className="text-[#ff8c00] group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Fine Print / Footer */}
                <div className="mt-20 flex gap-6 text-[10px] uppercase tracking-widest text-white/10 font-display font-medium">
                    <span>© 2026 Booklyn</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full my-auto" />
                    <span>Silent records only</span>
                </div>
            </div>
        </div>
    );
}
