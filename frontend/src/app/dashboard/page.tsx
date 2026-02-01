'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Heart, Share2, Calendar, Clock, DollarSign, MoreHorizontal, Loader2, Music2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';
import ApplicationsView from '@/components/dashboard/ApplicationsView';
import api from '@/services/api';
import { ApplicationModal } from '@/components/dashboard/ApplicationModal';

export default function DashboardPage() {
    const { user, currentContext } = useAuthStore();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

    // Application Modal State
    const [selectedGig, setSelectedGig] = useState<any>(null);
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const isFinding = currentContext === 'finding';

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const endpoint = isFinding ? '/discovery/gigs' : '/gigs/me/managed';
            const res = await api.get(endpoint);
            setPosts(res.data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
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
        if (user) {
            fetchPosts();
            if (isFinding) fetchApplications();
        }
    }, [user, currentContext, isFinding]);

    const handleApply = async (message: string) => {
        if (!selectedGig) return;
        setApplyingId(selectedGig.id);
        try {
            await api.post('/applications/', { gig_id: selectedGig.id, message });
            setAppliedIds(prev => new Set(prev).add(selectedGig.id));
        } catch (err) {
            console.error('Failed to apply:', err);
            alert('Failed to apply. You might have already applied.');
        } finally {
            setApplyingId(null);
        }
    };

    const handleOpenApply = (post: any) => {
        setSelectedGig(post);
        setIsAppModalOpen(true);
    };

    // Onboarding Gate
    if (isFinding && !user?.has_band_profile) {
        return <OnboardingFlow type="band" />;
    }

    if (!isFinding && !user?.has_venue_profile) {
        return <OnboardingFlow type="venue" />;
    }

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                {/* Conditional View for Hosts */}
                {!isFinding && <ApplicationsView />}

                {/* Section Title */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold font-display text-white">
                        {isFinding ? 'Recommended Gigs' : 'Your Live Gigs'}
                    </h2>
                    <button className="text-sm text-[#FF8C00] hover:text-white transition-colors">View all</button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#bcad9a]">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                        <p className="font-display font-bold uppercase tracking-widest text-sm">Syncing with the rhythm...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1e1e1e] rounded-2xl border border-dashed border-[#3a3127] text-center">
                        <div className="size-16 rounded-full bg-[#121212] flex items-center justify-center mb-6 text-[#bcad9a]">
                            <Music2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Gigs Found</h3>
                        <p className="text-[#bcad9a] max-w-sm">
                            {isFinding
                                ? "There are no open calls for talent right now. Check back soon or refine your discovery settings."
                                : "You haven't posted any gig opportunities yet. Switch to 'Post' to start booking talent."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] overflow-hidden transition-all duration-300 group hover:border-[#ff8c00]/50 hover:shadow-2xl hover:shadow-[#ff8c00]/10 hover-lift hover-glow">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-black border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-br from-[#121212] to-[#2a2a2a] flex items-center justify-center text-[#FF8C00] font-bold text-xl uppercase">
                                                    {post.avatar_char || post.author_name?.[0] || 'V'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold font-display text-lg text-white group-hover:text-[#FF8C00] transition-colors">
                                                        <Link href={`/dashboard/profile/${post.author_id}`} className="hover:underline">
                                                            {post.author_name || "The Venue"}
                                                        </Link>
                                                    </h3>
                                                    <span className="px-2 py-0.5 rounded-full bg-black border border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
                                                        Verified
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400">posted {new Date(post.created_at).toLocaleDateString()} • {post.genre}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-500 hover:text-white p-2">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <h4 className="text-lg font-bold text-white mb-2">{post.title}</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {post.description}
                                        </p>

                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.map((tag: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-black rounded-md text-[10px] font-bold uppercase tracking-widest text-[#FF8C00] border border-[#2A2A2A]">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Gig Visual Specs */}
                                    <div className="bg-black/40 rounded-xl p-4 border border-[#2A2A2A] mb-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <Calendar className="size-3" /> Date
                                                </span>
                                                <span className="text-white text-sm font-medium">{post.date}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <Clock className="size-3" /> Time
                                                </span>
                                                <span className="text-white text-sm font-medium">{post.time}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <DollarSign className="size-3" /> Pay
                                                </span>
                                                <span className="text-[#ff8c00] text-sm font-bold">{post.pay}</span>
                                            </div>
                                            <div className="flex flex-col col-span-2 md:col-span-1">
                                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <MapPin className="size-3" /> Location
                                                </span>
                                                <span className="text-white text-xs font-medium truncate" title={post.formatted_address}>{post.formatted_address || post.borough || 'TBD'}</span>
                                            </div>
                                        </div>
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
                                        {isFinding ? (
                                            <button
                                                onClick={() => handleOpenApply(post)}
                                                disabled={appliedIds.has(post.id) || applyingId === post.id}
                                                className={`font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,140,0,0.1)] ${appliedIds.has(post.id)
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                                                    : 'bg-[#FF8C00] hover:bg-orange-500 text-black'
                                                    }`}
                                            >
                                                {applyingId === post.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                ) : appliedIds.has(post.id) ? (
                                                    'Applied'
                                                ) : (
                                                    'Apply Now'
                                                )}
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-[#3a3127] rounded-lg hover:bg-white/5 transition-all text-[#bcad9a]">Edit</button>
                                                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all">Close</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <ApplicationModal
                isOpen={isAppModalOpen}
                onClose={() => setIsAppModalOpen(false)}
                onConfirm={handleApply}
                gigTitle={selectedGig?.title || ''}
                venueName={selectedGig?.author_name || 'the venue'}
            />
        </div>
    );
}
