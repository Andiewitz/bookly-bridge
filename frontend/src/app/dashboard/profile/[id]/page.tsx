'use client';

import React, { useEffect, useState, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Calendar, Music, Users, Instagram, Phone,
    ExternalLink, Loader2, ArrowLeft, ShieldCheck, Heart, Share2,
    Play, Pause, Volume2, Globe, MessageCircle
} from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { AudioPlayer } from '@/components/profile/AudioPlayer';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/profile/${id}`);
                setProfile(res.data);
            } catch (err: any) {
                console.error('Failed to fetch profile:', err);
                setError('Profile not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#bcad9a]">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                <p className="font-display font-medium uppercase tracking-widest text-sm animate-pulse">Fetching public records...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
                <p className="text-[#bcad9a] max-w-sm mb-8">We couldn't find the profile you're looking for. It might be private or doesn't exist.</p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-[#ff8c00] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-orange-400 transition-all"
                >
                    Return to discovery
                </button>
            </div>
        );
    }

    const isBand = profile.band_name !== undefined;

    return (
        <div className="min-h-screen pb-20">
            {/* Header / Banner Area */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] z-10" />
                <div className="absolute inset-0 bg-[#1E1E1E]">
                    {/* Background Pattern/Abstact */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ff8c00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-8 z-20 size-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#ff8c00] hover:text-black transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-8 -mt-32 relative z-20">
                <div className="flex flex-col md:flex-row gap-8 items-end md:items-start">
                    {/* Profile Avatar */}
                    <div className="size-40 md:size-48 rounded-3xl bg-black border-4 border-[#121212] shadow-2xl flex items-center justify-center text-[#ff8c00] font-black text-6xl md:text-7xl overflow-hidden shrink-0">
                        {profile.photo_url ? (
                            <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            isBand ? profile.band_name[0] : profile.venue_name[0]
                        )}
                    </div>

                    <div className="flex-1 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                                        {isBand ? profile.band_name : profile.venue_name}
                                    </h1>
                                    <div className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                                        Verified {isBand ? 'Artist' : 'Venue'}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-[#bcad9a]">
                                    <span className="flex items-center gap-1.5 text-sm font-medium">
                                        <MapPin className="size-4 text-[#ff8c00]" /> {isBand ? `${profile.location_city}, ${profile.location_state}` : `${profile.location_city}, ${profile.location_state}`}
                                    </span>
                                    {isBand ? (
                                        <span className="flex items-center gap-1.5 text-sm font-medium">
                                            <Music className="size-4 text-[#ff8c00]" /> {profile.genre}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm font-medium">
                                            <Users className="size-4 text-[#ff8c00]" /> {profile.capacity} Capacity
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="size-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <Heart className="size-5" />
                                </button>
                                <button className="size-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <Share2 className="size-5" />
                                </button>
                                <button className="px-8 py-3.5 bg-[#ff8c00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] transition-all">
                                    Contact Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
                    {/* Left Column: Bio & Info */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff8c00] mb-4">About</h2>
                            <p className="text-lg text-white leading-relaxed font-light">
                                {profile.bio || "No biography provided yet. This user is probably too busy making music or hosting legendary nights."}
                            </p>
                        </section>

                        {isBand && (
                            <section className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] p-8">
                                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                                    <Music className="size-5 text-[#ff8c00]" /> Featured Demo
                                </h2>

                                {profile.demo_url ? (
                                    <AudioPlayer
                                        src={profile.demo_url}
                                        title={`${profile.band_name} - Official Demo`}
                                    />
                                ) : (
                                    <div className="bg-black/40 rounded-xl p-8 border border-[#3a3127] text-center">
                                        <Music className="size-10 text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 text-sm font-medium">No demo recordings available yet.</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {!isBand && profile.typical_genres && (
                            <section>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff8c00] mb-6">Typical Genres</h2>
                                <div className="flex flex-wrap gap-3">
                                    {profile.typical_genres.map((g: string) => (
                                        <span key={g} className="px-6 py-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-sm font-bold text-white hover:border-[#ff8c00]/50 transition-all uppercase tracking-tighter">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar / Stats */}
                    <div className="space-y-8">
                        <div className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] p-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff8c00] mb-6">Details</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#bcad9a]">Joined</span>
                                    <span className="text-sm font-bold text-white">{new Date(profile.created_at).getFullYear()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#bcad9a]">Status</span>
                                    <span className="text-sm font-bold text-green-400">Accepting Gigs</span>
                                </div>
                                <div className="h-px w-full bg-[#2A2A2A]" />
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">Fast Connections</p>
                                    <div className="flex gap-2">
                                        {profile.instagram_handle && (
                                            <button className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                                <Instagram className="size-4" />
                                            </button>
                                        )}
                                        {profile.whatsapp_number && (
                                            <button className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                                <Phone className="size-4" />
                                            </button>
                                        )}
                                        <button className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                            <Globe className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#ff8c00]/10 to-transparent rounded-2xl border border-[#ff8c00]/20 p-6">
                            <h3 className="font-bold text-lg text-white mb-2">Book {isBand ? 'this Band' : 'this Venue'}</h3>
                            <p className="text-sm text-[#bcad9a] mb-6 leading-relaxed">Direct messaging is encrypted and secure. Start a conversation today.</p>
                            <button className="w-full py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#ff8c00] transition-all">
                                <MessageCircle className="size-4 inline-block mr-2 -mt-0.5" /> Start Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
