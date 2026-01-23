import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Heart, Share2, Calendar, Clock, DollarSign, Headphones, MoreHorizontal, Loader2, Music2 } from 'lucide-react';
import Link from 'next/link';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';
import api from '@/services/api';

export default function DashboardPage() {
    const { user, currentContext } = useAuthStore();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const isFinding = currentContext === 'finding';

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await api.get('/gigs/');
                setPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user, currentContext]);

    // Onboarding Gate
    if (isFinding && !user?.has_band_profile) {
        return <OnboardingFlow type="band" />;
    }

    if (!isFinding && !user?.has_venue_profile) {
        return <OnboardingFlow type="venue" />;
    }

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {/* Section Title */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold font-display text-white">
                        {isFinding ? 'Recommended Gigs' : 'Recent Activity'}
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
                            <article key={post.id} className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] overflow-hidden hover:border-[#3a3127] transition-all duration-300 group hover:shadow-2xl hover:shadow-black/50">
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
                                                        {post.author_name || "The Venue"}
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
                                        <div className="grid grid-cols-3 gap-4">
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
                                        <button className="bg-[#FF8C00] hover:bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,140,0,0.1)]">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
