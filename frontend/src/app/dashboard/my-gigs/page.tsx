'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import {
    Music,
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    Loader2,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActivityItem {
    id: string;
    gig_id: string;
    gig_title: string;
    gig_date: string;
    venue_name: string;
    status: string;
    created_at: string;
    message?: string;
}

export default function MyActivityPage() {
    const { currentContext } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<ActivityItem[]>([]);

    const isFinding = currentContext === 'finding';

    useEffect(() => {
        fetchActivity();
    }, [currentContext]);

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const endpoint = isFinding ? '/applications/my-applications' : '/gigs/me/managed';
            const res = await api.get(endpoint);
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch activity:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'declined':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'pending':
                return 'bg-[#ff8c00]/10 text-[#ff8c00] border-[#ff8c00]/20';
            default:
                return 'bg-white/5 text-[#bcad9a] border-white/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted': return <CheckCircle2 className="size-4" />;
            case 'declined': return <XCircle className="size-4" />;
            case 'pending': return <Clock className="size-4 animate-pulse" />;
            default: return <AlertCircle className="size-4" />;
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-2 italic uppercase">
                    My <span className="text-[#ff8c00]">{isFinding ? 'Applications' : 'Gigs'}</span>
                </h1>
                <p className="text-[#bcad9a] text-sm">
                    {isFinding
                        ? 'Track your sent applications and connection requests.'
                        : 'Manage your active gig postings and bookings.'}
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#bcad9a]">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                    <p className="font-display font-medium uppercase tracking-widest text-xs">Fetching records...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-[#1E1E1E] rounded-3xl border-2 border-dashed border-[#3a3127] p-16 text-center">
                    <div className="size-16 rounded-full bg-[#121212] flex items-center justify-center mx-auto mb-6 text-[#bcad9a]">
                        <Briefcase className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-display uppercase italic">Nothing to track yet</h3>
                    <p className="text-[#bcad9a] text-sm max-w-sm mx-auto mb-8">
                        {isFinding
                            ? "You haven't applied to any gigs yet. Head over to Discovery to find your next stage."
                            : "You haven't posted any gigs yet. Switch to 'Post' to start booking talent."}
                    </p>
                    <Link
                        href="/dashboard"
                        className="px-8 py-3 bg-[#ff8c00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-400 transition-all font-display italic"
                    >
                        {isFinding ? 'Discover Gigs' : 'Post a Gig'}
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 transition-all hover:border-[#ff8c00]/30 hover:shadow-2xl group relative overflow-hidden"
                        >
                            {/* Accent Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8c00]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#ff8c00]/10 transition-all" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                {/* Main Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn(
                                            "px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                                            getStatusStyles(item.status)
                                        )}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                        <span className="text-[10px] text-[#bcad9a] uppercase font-bold tracking-widest">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#ff8c00] transition-colors uppercase italic">
                                        {isFinding ? item.gig_title : (item as any).title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#bcad9a] font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Music className="size-3.5 text-[#ff8c00]" />
                                            {isFinding ? item.venue_name : 'Your Venue'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/50">
                                            <Calendar className="size-3.5" />
                                            {isFinding ? item.gig_date : (item as any).date}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center gap-4">
                                    {isFinding && item.status === 'accepted' ? (
                                        <Link
                                            href={`/dashboard/messages`}
                                            className="px-6 py-2.5 bg-[#ff8c00] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-orange-400 transition-all italic"
                                        >
                                            View Contact
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/dashboard/gigs/${item.gig_id || item.id}`}
                                            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all group/btn"
                                        >
                                            <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
