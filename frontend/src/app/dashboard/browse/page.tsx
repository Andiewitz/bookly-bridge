'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronDown, MapPin, Calendar, DollarSign, Star, Zap, ArrowRight } from 'lucide-react';

export default function BrowsePage() {
    const { user } = useAuthStore();

    return (
        <div className="p-8 pb-20 scroll-smooth">
            <div className="mx-auto max-w-7xl flex flex-col gap-10">
                {/* Page Heading Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">Discover New Talent</h1>
                        <p className="text-lg text-[#bcad9a] max-w-2xl">
                            Connect with the best local bands and book the perfect venues for your next gig.
                        </p>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="flex h-9 items-center gap-2 rounded-full bg-[#ff8c00] px-4 text-sm font-bold text-black shadow-[0_0_15px_rgba(255,140,0,0.3)] transition-transform active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            All Filters
                        </button>
                        <div className="h-6 w-[1px] bg-[#3a3127] mx-1" />

                        {/* Filter Chips */}
                        <button className="flex h-9 items-center gap-2 rounded-full border border-[#3a3127] bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]">
                            <span>Genre</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex h-9 items-center gap-2 rounded-full border border-[#3a3127] bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]">
                            <span>Location</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex h-9 items-center gap-2 rounded-full border border-[#3a3127] bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]">
                            <span>Date</span>
                            <Calendar className="w-4 h-4" />
                        </button>
                        <button className="flex h-9 items-center gap-2 rounded-full border border-[#3a3127] bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]">
                            <span>Price Range</span>
                            <DollarSign className="w-4 h-4" />
                        </button>
                        <div className="ml-auto text-sm text-[#bcad9a] hidden xl:block">
                            Showing 124 results in <span className="text-white font-bold">New York, NY</span>
                        </div>
                    </div>
                </div>

                {/* Suggested Bands Grid */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <span className="text-[#ff8c00]">♪</span> Suggested Bands
                        </h2>
                        <a className="text-sm font-bold text-[#ff8c00] hover:underline" href="#">View All</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* Band Card 1 */}
                        {[
                            { name: 'The Neon Lights', location: 'Brooklyn, NY', genres: ['Indie Rock', 'Synth'], rating: 4.9 },
                            { name: 'Midnight Jazz Trio', location: 'Harlem, NY', genres: ['Jazz', 'Fusion'], rating: 4.7 },
                            { name: 'Cyber Pulse', location: 'Queens, NY', genres: ['Techno', 'Electronic'], badge: 'New' },
                            { name: 'Sarah & The Strings', location: 'Lower East Side', genres: ['Folk', 'Acoustic'], rating: 5.0 },
                        ].map((band, i) => (
                            <div key={i} className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1E1E1E] border border-[#3a3127] transition-all hover:border-[#ff8c00]/50 hover:shadow-2xl hover:shadow-[#ff8c00]/10">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-80 z-10" />
                                    <div className="absolute top-3 right-3 z-20 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
                                        <div className="flex items-center gap-1 text-xs font-bold text-white">
                                            {band.rating ? (
                                                <>
                                                    <Star className="w-[14px] h-[14px] text-yellow-400 fill-yellow-400" /> {band.rating}
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-[14px] h-[14px] text-white" /> {band.badge}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-black transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="flex flex-col gap-4 p-5 pt-2 relative z-20">
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-white group-hover:text-[#ff8c00] transition-colors">
                                            {band.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-[#bcad9a]">
                                            <MapPin className="w-4 h-4" /> {band.location}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {band.genres.map((genre) => (
                                            <span key={genre} className="rounded-md bg-[#282828] px-2.5 py-1 text-xs font-semibold text-[#bcad9a] border border-[#3a3127]">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                    <button className="mt-2 w-full rounded-lg bg-[#ff8c00] py-2.5 text-sm font-bold text-black transition-colors hover:bg-white flex items-center justify-center gap-2 group/btn">
                                        View Profile
                                        <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#3a3127] to-transparent" />

                {/* Featured Venues Grid */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <span className="text-[#ff8c00]">🎪</span> Featured Venues
                        </h2>
                        <a className="text-sm font-bold text-[#ff8c00] hover:underline" href="#">View All</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[
                            { name: 'The Basement', location: 'Williamsburg, Brooklyn', capacity: 250 },
                            { name: 'Empire Hall', location: 'Midtown, NY', capacity: 800 },
                            { name: 'Velvet Lounge', location: 'SoHo, NY', capacity: 120 },
                        ].map((venue, i) => (
                            <div key={i} className="group flex flex-col overflow-hidden rounded-2xl bg-[#181510] border border-[#3a3127] hover:border-[#bcad9a]/30 transition-colors">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <div className="absolute bottom-3 left-3 z-10 flex gap-2">
                                        <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-1 text-xs font-bold text-white border border-white/10">
                                            Cap: {venue.capacity}
                                        </span>
                                    </div>
                                    <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="flex flex-1 flex-col gap-3 p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-display text-lg font-bold text-white">{venue.name}</h3>
                                            <p className="text-sm text-[#bcad9a] mt-1">{venue.location}</p>
                                        </div>
                                        <div className="rounded-full bg-[#3a3127] p-1.5 text-white">
                                            <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-2">
                                        <button className="w-full rounded-lg border border-[#3a3127] bg-transparent py-2.5 text-sm font-bold text-white hover:bg-[#3a3127] hover:text-white transition-colors">
                                            Check Availability
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
