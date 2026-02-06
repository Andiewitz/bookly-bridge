'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Home,
    MapPin,
    Users,
    ChevronRight,
    Loader2,
    Sparkles,
    Search
} from 'lucide-react';
import Link from 'next/link';

interface VenueProfile {
    user_id: string;
    venue_name: string;
    location_city: string;
    location_state: string;
    capacity: number;
    photo_url: string | null;
    bio: string | null;
}

export default function VenuesDiscoveryPage() {
    const [loading, setLoading] = useState(true);
    const [venues, setVenues] = useState<VenueProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const res = await api.get('/profiles/venues/all');
            setVenues(res.data);
        } catch (err) {
            console.error('Failed to fetch venues:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredVenues = venues.filter(v =>
        v.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location_city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="size-4 text-[#ff8c00]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bcad9a]">Marketplace</span>
                    </div>
                    <h1 className="font-display text-5xl font-black tracking-tight text-white italic uppercase leading-none">
                        Discovery <span className="text-[#ff8c00]">Hub</span>
                    </h1>
                    <p className="text-[#bcad9a] text-sm mt-4 max-w-md">
                        Find the perfect stage. Connect with top-tier venues across the city and build your booking network.
                    </p>
                </div>

                {/* Local Search */}
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#bcad9a] group-focus-within:text-[#ff8c00] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search venues by name or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#ff8c00]/50 transition-all placeholder:text-[#bcad9a]/50"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#bcad9a]">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                    <p className="font-display font-medium uppercase tracking-widest text-xs">Scanning the horizon...</p>
                </div>
            ) : filteredVenues.length === 0 ? (
                <div className="bg-[#1E1E1E] rounded-3xl border-2 border-dashed border-[#3a3127] p-20 text-center">
                    <Home className="size-12 text-[#bcad9a]/30 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2 font-display uppercase italic">No venues found</h3>
                    <p className="text-[#bcad9a] text-sm">Try refining your search term or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVenues.map((venue) => (
                        <Link
                            key={venue.user_id}
                            href={`/dashboard/profile/${venue.user_id}`}
                            className="group bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl overflow-hidden hover:border-[#ff8c00]/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff8c00]/5"
                        >
                            {/* Card Image / Placeholder */}
                            <div className="h-40 bg-[#121212] relative overflow-hidden">
                                {venue.photo_url ? (
                                    <img
                                        src={venue.photo_url}
                                        alt={venue.venue_name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#2A2A2A]">
                                        <Home size={64} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent" />

                                <div className="absolute bottom-4 left-6">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#ff8c00] text-black rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        <Users className="size-3" />
                                        Cap: {venue.capacity}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-white font-display tracking-tight group-hover:text-[#ff8c00] transition-colors uppercase italic leading-none">
                                        {venue.venue_name}
                                    </h3>
                                    <ChevronRight className="size-5 text-[#bcad9a] group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                </div>

                                <div className="flex items-center gap-2 text-xs text-[#bcad9a] font-medium mb-4">
                                    <MapPin className="size-3.5 text-[#ff8c00]" />
                                    {venue.location_city}, {venue.location_state}
                                </div>

                                <p className="text-[#bcad9a] text-xs line-clamp-2 leading-relaxed">
                                    {venue.bio || "No description provided. Connect with them to learn more about their vibe and booking requirements."}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
