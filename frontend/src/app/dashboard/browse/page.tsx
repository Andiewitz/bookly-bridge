'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronDown, MapPin, Calendar, DollarSign, Search, Loader2, Music2, Heart, Share2, Clock } from 'lucide-react';
import api from '@/services/api';

export default function BrowsePage() {
    const { user } = useAuthStore();
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBorough, setSelectedBorough] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

    const fetchGigs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedBorough) params.append('borough', selectedBorough);
            if (searchQuery) params.append('search', searchQuery);

            const res = await api.get(`/gigs/?${params.toString()}`);
            setGigs(res.data);
        } catch (err) {
            console.error('Failed to fetch gigs:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get('/applications/my-applications');
            setAppliedIds(new Set(res.data.map((a: any) => a.gig_id)));
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        }
    };

    useEffect(() => {
        fetchGigs();
        if (user) fetchApplications();
    }, [selectedBorough]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGigs();
    };

    const handleApply = async (gigId: string) => {
        setApplyingId(gigId);
        try {
            await api.post('/applications/', { gig_id: gigId, message: "Interested!" });
            setAppliedIds(prev => new Set(prev).add(gigId));
        } catch (err) {
            console.error('Failed to apply:', err);
        } finally {
            setApplyingId(null);
        }
    };

    return (
        <div className="p-8 pb-20 scroll-smooth">
            <div className="mx-auto max-w-7xl flex flex-col gap-10">
                {/* Page Heading Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">Discover Gigs</h1>
                        <p className="text-lg text-[#bcad9a] max-w-2xl">
                            The best local opportunities, validated by the community. Direct booking, zero fees.
                        </p>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-4 bg-[#1E1E1E] p-4 rounded-2xl border border-[#3a3127]">
                        <form onSubmit={handleSearch} className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#bcad9a]" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black border border-[#3a3127] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Search by title, genre, or keywords..."
                            />
                        </form>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#ff8c00]" />
                                <select
                                    value={selectedBorough}
                                    onChange={(e) => setSelectedBorough(e.target.value)}
                                    className="bg-black border border-[#3a3127] rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:border-[#ff8c00] outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">All Boroughs</option>
                                    <option value="Brooklyn">Brooklyn</option>
                                    <option value="Manhattan">Manhattan</option>
                                    <option value="Queens">Queens</option>
                                    <option value="Bronx">The Bronx</option>
                                    <option value="StatenIsland">Staten Island</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gigs Grid */}
                <section className="flex flex-col gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#bcad9a]">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                            <p className="font-display font-medium uppercase tracking-widest text-sm">Finding the rhythm...</p>
                        </div>
                    ) : gigs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1e1e1e] rounded-2xl border border border-[#3a3127] text-center">
                            <Music2 className="size-16 text-[#3a3127] mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">No Gigs Found</h3>
                            <p className="text-[#bcad9a] max-w-sm">Try adjusting your filters or search terms to find more opportunities.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {gigs.map((gig) => (
                                <article key={gig.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1E1E1E] border border-[#3a3127] transition-all duration-300 hover:border-[#ff8c00]/50 hover:shadow-2xl hover:shadow-[#ff8c00]/10 hover-lift hover-glow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-black flex items-center justify-center text-[#ff8c00] font-bold border border-[#3a3127]">
                                                    {gig.avatar_char}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-[#ff8c00] transition-colors">{gig.author_name}</h3>
                                                    <p className="text-[10px] text-[#bcad9a] flex items-center gap-1 uppercase tracking-widest font-bold">
                                                        <MapPin className="size-3" /> {gig.borough}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-black/50 rounded-md text-[9px] font-black text-[#ff8c00] border border-[#ff8c00]/20 uppercase tracking-tighter">
                                                {gig.genre}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{gig.title}</h4>
                                        <p className="text-sm text-[#bcad9a] mb-6 line-clamp-2 h-10">{gig.description}</p>

                                        <div className="grid grid-cols-2 gap-3 mb-6 bg-black/30 p-4 rounded-xl border border-[#3a3127]">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date</span>
                                                <span className="text-xs text-white flex items-center gap-1"><Calendar className="size-3" /> {gig.date}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pay</span>
                                                <span className="text-xs text-[#ff8c00] font-bold flex items-center gap-1"><DollarSign className="size-3" /> {gig.pay}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleApply(gig.id)}
                                            disabled={appliedIds.has(gig.id) || applyingId === gig.id}
                                            className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${appliedIds.has(gig.id)
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-[#ff8c00] text-black hover:shadow-[0_0_15px_rgba(255,140,0,0.3)]'
                                                }`}
                                        >
                                            {applyingId === gig.id ? <Loader2 className="size-4 animate-spin mx-auto" /> : appliedIds.has(gig.id) ? 'Applied' : 'Apply Now'}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
