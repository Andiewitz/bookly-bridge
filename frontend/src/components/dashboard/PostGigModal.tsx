'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Tag, Music2, Loader2, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '@/services/api';

interface PostGigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PostGigModal({ isOpen, onClose, onSuccess }: PostGigModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    if (!isOpen) return null;

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            // Processing tags
            const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [];
            await api.post('/gigs/', { ...data, tags });
            reset();
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to post gig. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-[#1E1E1E] rounded-2xl border border-[#3a3127] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#3a3127] bg-[#1E1E1E]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#ff8c00] flex items-center justify-center text-black">
                            <Music2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold font-display uppercase tracking-tight">Post a New Gig</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#3a3127] rounded-full transition-colors text-[#bcad9a]">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Gig Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all placeholder:text-white/10"
                                placeholder="E.g. Jazz Night at The Rusty Anchor"
                            />
                            {errors.title && <span className="text-[10px] text-red-400 mt-1">{errors.title.message as string}</span>}
                        </div>

                        {/* Genre */}
                        <div>
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Primary Genre</label>
                            <input
                                {...register('genre', { required: 'Genre is required' })}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Jazz, Rock, Blues..."
                            />
                        </div>

                        {/* Pay */}
                        <div>
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                <DollarSign className="size-3" /> Pay / Budget
                            </label>
                            <input
                                {...register('pay', { required: 'Pay info is required' })}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="$300 - $500"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                <Calendar className="size-3" /> Date
                            </label>
                            <input
                                {...register('date', { required: 'Date is required' })}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Oct 24th, 2026"
                            />
                        </div>

                        {/* Borough */}
                        <div>
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                <MapPin className="size-3" /> Borough (NYC)
                            </label>
                            <select
                                {...register('borough', { required: 'Borough is required' })}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all appearance-none"
                            >
                                <option value="">Select Borough</option>
                                <option value="Brooklyn">Brooklyn</option>
                                <option value="Manhattan">Manhattan</option>
                                <option value="Queens">Queens</option>
                                <option value="Bronx">The Bronx</option>
                                <option value="StatenIsland">Staten Island</option>
                            </select>
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                <Clock className="size-3" /> Start Time
                            </label>
                            <input
                                {...register('time', { required: 'Time is required' })}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="8:00 PM"
                            />
                        </div>

                        {/* Tags */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                <Tag className="size-3" /> Tags (comma separated)
                            </label>
                            <input
                                {...register('tags')}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="LiveMusic, Trio, Nightlife..."
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Gig Description</label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full bg-black border border-[#3a3127] rounded-xl px-5 py-3.5 text-white focus:border-[#ff8c00] outline-none transition-all resize-none"
                                placeholder="Describe the gig requirements, equipment provided, etc."
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#ff8c00] text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover-glow focus-ring"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Post Gig Opportunity <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Adding missing icon
import { ArrowRight } from 'lucide-react';
