'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Heart, Share2, Calendar, Clock, DollarSign, Headphones, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const isBand = user?.role === 'band';

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {/* Section Title */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold font-display text-white">Recommended for You</h2>
                    <button className="text-sm text-[#FF8C00] hover:text-white transition-colors">View all</button>
                </div>

                {/* Card 1: Venue Post */}
                <article className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-gray-600 transition-colors duration-300 group">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-black border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-[#FF8C00] font-bold text-xl">
                                        R
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold font-display text-lg text-white group-hover:text-[#FF8C00] transition-colors">
                                            The Rusty Anchor
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-black border border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
                                            Venue
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">Brooklyn, NY • 2 hrs ago</p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <p className="text-gray-200 text-sm leading-relaxed mb-3">
                                We are hosting a prohibition-style night on Oct 24th and we need a solid Jazz Trio to set the mood. Ideally looking for upright bass, piano, and soft percussion.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-black rounded-md text-xs font-medium text-gray-300 border border-gray-800">#Jazz</span>
                                <span className="px-3 py-1 bg-black rounded-md text-xs font-medium text-gray-300 border border-gray-800">#LiveMusic</span>
                                <span className="px-3 py-1 bg-black rounded-md text-xs font-medium text-gray-300 border border-gray-800">#Trio</span>
                            </div>
                        </div>

                        {/* Context Image */}
                        <div className="w-full h-48 rounded-lg bg-black overflow-hidden relative mb-5 group-hover:brightness-110 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <div className="absolute bottom-3 left-4 z-20 flex flex-col">
                                <span className="text-xs text-[#FF8C00] font-bold uppercase tracking-wider mb-1">Gig Details</span>
                                <div className="flex items-center gap-4 text-white text-sm font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-[18px] h-[18px] text-[#FF8C00]" /> Oct 24th
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-[18px] h-[18px] text-[#FF8C00]" /> 8:00 PM
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-[18px] h-[18px] text-[#FF8C00]" /> $300
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black opacity-60" />
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                                    <Heart className="w-5 h-5" /> Save
                                </button>
                                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                                    <Share2 className="w-5 h-5" /> Share
                                </button>
                            </div>
                            <button className="bg-[#FF8C00] hover:bg-orange-500 text-black font-bold font-display text-sm px-6 py-2 rounded-md transition-colors shadow-[0_0_15px_rgba(255,140,0,0.2)]">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </article>

                {/* Card 2: Band Post */}
                <article className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-gray-600 transition-colors duration-300 group">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-black border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center text-[#FF8C00] font-bold text-xl">
                                        N
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold font-display text-lg text-white group-hover:text-[#FF8C00] transition-colors">
                                            Neon Echoes
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-black border border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
                                            Band
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">Synth-pop • Active now</p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <p className="text-gray-200 text-sm leading-relaxed mb-3">
                                We are booking for the holiday season! 5 years of experience playing high-energy sets. Equipped with our own sound system for smaller venues.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-black rounded-md text-xs font-medium text-gray-300 border border-gray-800">#SynthPop</span>
                                <span className="px-3 py-1 bg-black rounded-md text-xs font-medium text-gray-300 border border-gray-800">#Electronic</span>
                                <span className="px-3 py-1 bg-black rounded-md text-xs font-medium text-gray-300 border border-gray-800">#WeekendGigs</span>
                            </div>
                        </div>

                        {/* Stats / Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-black/40 rounded-lg p-3 border border-[#2A2A2A]">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Availability</p>
                                <p className="text-white font-medium text-sm mt-1">Weekends & Fridays</p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3 border border-[#2A2A2A]">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Experience</p>
                                <p className="text-white font-medium text-sm mt-1">5 Years / 200+ Gigs</p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                                    <Headphones className="w-5 h-5" /> Listen
                                </button>
                            </div>
                            <button className="bg-[#FF8C00] hover:bg-orange-500 text-black font-bold font-display text-sm px-6 py-2 rounded-md transition-colors shadow-[0_0_15px_rgba(255,140,0,0.2)]">
                                Book Us
                            </button>
                        </div>
                    </div>
                </article>

                {/* Card 3: Generic (No Image) */}
                <article className="bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-gray-600 transition-colors duration-300 group">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-[#FF8C00] flex items-center justify-center overflow-hidden text-black font-bold text-xl">
                                    M
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold font-display text-lg text-white group-hover:text-[#FF8C00] transition-colors">
                                            Max's Basement
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-black border border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
                                            Venue
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">Queens, NY • 5 hrs ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="pl-16">
                            <p className="text-gray-200 text-sm leading-relaxed mb-3">
                                Just had a cancellation for this Saturday night! Any local rock bands want to fill the 9pm slot? Standard door split.
                            </p>
                            <div className="flex items-center justify-start pt-2">
                                <button className="text-[#FF8C00] text-sm font-bold hover:underline">Message Venue</button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
