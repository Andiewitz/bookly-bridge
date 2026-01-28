'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronDown, MapPin, Calendar, DollarSign, Search, Music2, Heart, Share2, Clock, Filter, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const GENRES = ["All", "Rock", "Jazz", "Blues", "Pop", "Metal", "Country", "Indie", "Electronic", "Techno", "Folk", "Acoustic"];

export default function BrowsePage() {
    const { user } = useAuthStore();
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBorough, setSelectedBorough] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
    const [showGenreMenu, setShowGenreMenu] = useState(false);

    const fetchGigs = async (isManualSearch = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedBorough) params.append('borough', selectedBorough);
            if (selectedGenre !== 'All') params.append('genre', selectedGenre);
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

    // Auto-fetch on filter change
    useEffect(() => {
        fetchGigs();
    }, [selectedBorough, selectedGenre]);

    // Initial auth check
    useEffect(() => {
        if (user) fetchApplications();
    }, [user]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGigs(true);
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
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-500/20">
                                Scalable Search Enabled
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">Discover Gigs</h1>
                        <p className="text-lg text-[#bcad9a] max-w-2xl">
                            Real-time talent marketplace. Filter by borough, genre, or keyword to find your next stage.
                        </p>
                    </div>

                    {/* Discovery Toolbelt */}
                    <div className="flex flex-wrap items-center gap-4 bg-[#1E1E1E] p-4 rounded-2xl border border-[#3a3127] shadow-xl relative z-30">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 min-w-[280px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#bcad9a]" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black border border-[#3a3127] rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#ff8c00] outline-none transition-all placeholder:text-gray-600"
                                placeholder="Search by tags, title, or bio..."
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchQuery(''); fetchGigs(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Borough Dropdown */}
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#ff8c00]" />
                                <select
                                    value={selectedBorough}
                                    onChange={(e) => setSelectedBorough(e.target.value)}
                                    className="bg-black border border-[#3a3127] rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:border-[#ff8c00] outline-none appearance-none cursor-pointer hover:bg-[#121212] transition-colors"
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

                            {/* Genre Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowGenreMenu(!showGenreMenu)}
                                    className={cn(
                                        "bg-black border border-[#3a3127] rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff8c00] outline-none flex items-center gap-2 hover:bg-[#121212] transition-colors",
                                        selectedGenre !== 'All' && "border-[#ff8c00] text-[#ff8c00]"
                                    )}
                                >
                                    <Filter className="size-4" />
                                    {selectedGenre}
                                    <ChevronDown className={cn("size-4 transition-transform", showGenreMenu && "rotate-180")} />
                                </button>

                                {showGenreMenu && (
                                    <div className="absolute top-full mt-2 left-0 w-48 bg-[#1E1E1E] border border-[#3a3127] rounded-xl shadow-2xl p-2 z-40 grid grid-cols-1 max-h-60 overflow-y-auto">
                                        {GENRES.map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => {
                                                    setSelectedGenre(g);
                                                    setShowGenreMenu(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                                    selectedGenre === g ? "bg-[#ff8c00] text-black" : "text-[#bcad9a] hover:bg-[#3a3127] hover:text-white"
                                                )}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gigs Grid */}
                <section className="flex flex-col gap-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] p-6 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-10 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Skeleton className="h-14 rounded-xl" />
                                        <Skeleton className="h-14 rounded-xl" />
                                    </div>
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : gigs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1e1e1e] rounded-2xl border border-dashed border-[#3a3127] text-center">
                            <Music2 className="size-16 text-[#3a3127] mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">No Gigs Found</h3>
                            <p className="text-[#bcad9a] max-w-sm">Try adjusting your filters or search terms to find more opportunities.</p>
                            <button
                                onClick={() => { setSelectedGenre('All'); setSelectedBorough(''); setSearchQuery(''); }}
                                className="mt-6 text-[#ff8c00] text-xs font-black uppercase tracking-tighter hover:underline"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {gigs.map((gig) => (
                                <article key={gig.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1E1E1E] border border-[#2A2A2A] transition-all duration-300 hover:border-[#ff8c00]/50 hover:shadow-2xl hover:shadow-[#ff8c00]/10 hover-lift hover-glow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-black flex items-center justify-center text-[#ff8c00] font-bold border border-[#2A2A2A]">
                                                    {gig.avatar_char || "V"}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-[#ff8c00] transition-colors">
                                                        <Link href={`/dashboard/profile/${gig.author_id}`} className="hover:underline">
                                                            {gig.author_name}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                                                        <MapPin className="size-3 text-[#ff8c00]" /> {gig.borough}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 bg-black/50 rounded-md text-[9px] font-black text-[#ff8c00] border border-[#ff8c00]/20 uppercase tracking-tighter">
                                                {gig.genre}
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{gig.title}</h4>
                                        <p className="text-sm text-[#bcad9a] mb-6 line-clamp-2 h-10 leading-relaxed">{gig.description}</p>

                                        {/* Tags display */}
                                        {gig.tags && gig.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-6">
                                                {gig.tags.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-[9px] font-bold text-gray-500 px-2 py-0.5 bg-black/40 rounded border border-white/5">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {gig.tags.length > 3 && <span className="text-[9px] font-bold text-gray-600">+{gig.tags.length - 3}</span>}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3 mb-6 bg-black/30 p-4 rounded-xl border border-[#2A2A2A]">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Calendar className="size-3" /> Date
                                                </span>
                                                <span className="text-xs text-white font-medium">{gig.date}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <DollarSign className="size-3" /> Pay
                                                </span>
                                                <span className="text-xs text-[#ff8c00] font-black font-display">{gig.pay}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleApply(gig.id)}
                                            disabled={appliedIds.has(gig.id) || applyingId === gig.id}
                                            className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all focus-ring ${appliedIds.has(gig.id)
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default'
                                                : 'bg-[#ff8c00] text-black hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:bg-orange-400'
                                                }`}
                                        >
                                            {applyingId === gig.id ? <Loader2 className="size-4 animate-spin mx-auto" /> : appliedIds.has(gig.id) ? 'Applied Successfully' : 'Quick Apply'}
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
