'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import { Button } from '@/components/ui/Base';
import { Skeleton } from '@/components/ui/Skeleton';
import { Edit2, MapPin, Music, Users, Globe, Instagram, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                {/* Hero Skeleton */}
                <Skeleton className="h-64 w-full rounded-3xl" variant="glass" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="md:col-span-2 space-y-8">
                        <Skeleton className="h-40 w-full rounded-3xl" variant="glass" />
                        <Skeleton className="h-60 w-full rounded-3xl" variant="glass" />
                    </div>
                    {/* Sidebar Skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-80 w-full rounded-3xl" variant="glass" />
                        <Skeleton className="h-24 w-full rounded-3xl" variant="glass" />
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center space-y-6 py-20 glass rounded-3xl">
                <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto text-muted">
                    <User size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">You haven&apos;t set up your profile yet</h2>
                    <p className="text-muted">Tell the world who you are to start getting gigs.</p>
                </div>
                <Link href="/dashboard/profile/edit">
                    <Button>Create Profile</Button>
                </Link>
            </div>
        );
    }

    const isBand = user?.role === 'band';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Hero Section */}
            <div className="relative h-64 rounded-3xl overflow-hidden glass border-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-background" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />

                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                    <div className="flex items-end gap-6">
                        <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background shadow-2xl overflow-hidden">
                            {profile.photo_url ? (
                                <img src={profile.photo_url} alt={isBand ? profile.band_name : profile.venue_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary bg-primary/10">
                                    {isBand ? <Music size={48} /> : <Users size={48} />}
                                </div>
                            )}
                        </div>
                        <div className="pb-2 space-y-1">
                            <h1 className="text-4xl font-black text-white drop-shadow-md">
                                {isBand ? profile.band_name : profile.venue_name}
                            </h1>
                            <div className="flex items-center gap-4 text-white/90 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-primary" />
                                    {profile.location_city}, {profile.location_state}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/50" />
                                <span className="flex items-center gap-1.5 capitalize text-primary font-bold">
                                    {isBand ? profile.genre : 'Venue'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link href="/dashboard/profile/edit">
                        <Button variant="secondary" className="glass hover:bg-white/20">
                            <Edit2 size={18} />
                            Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <section className="glass p-8 rounded-3xl space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            About
                        </h3>
                        <p className="text-muted leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                    </section>

                    {isBand && profile.demo_url && (
                        <section className="glass p-8 rounded-3xl space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                                Demo
                            </h3>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <audio controls className="w-full custom-audio-player">
                                    <source src={profile.demo_url} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </section>
                    )}

                    {!isBand && (
                        <section className="glass p-8 rounded-3xl space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                Typical Genres
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.typical_genres?.map((g: string) => (
                                    <span key={g} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <section className="glass p-8 rounded-3xl space-y-6">
                        <h3 className="text-xl font-bold">Contact Info</h3>

                        <div className="space-y-4">
                            {profile.instagram && (
                                <div className="flex items-center gap-3 text-muted">
                                    <Instagram size={20} className="text-pink-500" />
                                    <span className="text-sm">@{profile.instagram}</span>
                                </div>
                            )}
                            {profile.contact_method === 'whatsapp' && profile.whatsapp_number && (
                                <div className="flex items-center gap-3 text-muted">
                                    <MessageCircle size={20} className="text-green-500" />
                                    <span className="text-sm">{profile.whatsapp_number}</span>
                                </div>
                            )}
                            {profile.contact_email && (
                                <div className="flex items-center gap-3 text-muted">
                                    <Globe size={20} className="text-blue-500" />
                                    <span className="text-sm truncate">{profile.contact_email}</span>
                                </div>
                            )}
                        </div>

                        <Button className="w-full flex items-center gap-2">
                            <MessageCircle size={18} />
                            Open Conversation
                        </Button>
                    </section>

                    <div className="p-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl">
                        <div className="glass p-6 rounded-[calc(1.5rem-1px)] text-center">
                            <p className="text-xs text-muted font-medium mb-1 uppercase tracking-wider">Member Since</p>
                            <p className="font-bold">{new Date(profile.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
