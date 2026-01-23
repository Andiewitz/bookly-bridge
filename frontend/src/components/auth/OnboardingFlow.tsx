'use client';

import React from 'react';
import { Music2, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface OnboardingFlowProps {
    type: 'band' | 'venue';
}

export function OnboardingFlow({ type }: OnboardingFlowProps) {
    const isBand = type === 'band';

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto min-h-[60vh]">
            <div className="size-20 rounded-2xl bg-[#1E1E1E] border border-[#3a3127] flex items-center justify-center mb-8 shadow-2xl shadow-[#ff8c00]/10">
                {isBand ? (
                    <Music2 className="w-10 h-10 text-[#ff8c00]" />
                ) : (
                    <Building2 className="w-10 h-10 text-[#ff8c00]" />
                )}
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white mb-4 uppercase">
                {isBand ? 'Become a Performance Legend' : 'Host the Best Gigs in Town'}
            </h2>

            <p className="text-lg text-[#bcad9a] mb-10 leading-relaxed">
                {isBand
                    ? "You're currently in 'Finding Gigs' mode. To start applying to venues and appearing in search results, you need to set up your band profile."
                    : "You're currently in 'Hosting Gigs' mode. To start posting gig opportunities and booking talent, you need to verify your venue details."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
                {[
                    { title: 'Create Profile', desc: 'Add your bio and links' },
                    { title: 'Upload Media', desc: 'Photos and demo tracks' },
                    { title: 'Start Booking', desc: 'Direct contact, no fees' }
                ].map((step, i) => (
                    <div key={i} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#3a3127] text-left">
                        <CheckCircle2 className="w-5 h-5 text-[#ff8c00] mb-2" />
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-[#bcad9a] mt-1">{step.desc}</p>
                    </div>
                ))}
            </div>

            <Link
                href={isBand ? "/dashboard/profile/setup-band" : "/dashboard/profile/setup-venue"}
                className="flex items-center gap-3 rounded-xl bg-[#ff8c00] px-8 py-4 font-display text-lg font-bold text-[#121212] transition-transform active:scale-95 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)]"
            >
                {isBand ? 'Setup Band Profile' : 'Setup Venue Profile'}
                <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-8 text-xs text-[#bcad9a] uppercase tracking-widest font-bold">
                Takes less than 2 minutes
            </p>
        </div>
    );
}
