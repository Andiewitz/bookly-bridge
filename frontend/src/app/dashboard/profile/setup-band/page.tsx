'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    Music2,
    Instagram,
    Globe,
    Youtube,
    MessageCircle,
    Mail,
    Loader2,
    ArrowRight,
    Music,
    Mic2,
    Users
} from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function SetupBandPage() {
    const router = useRouter();
    const { fetchUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            await api.put('/profiles/me', { ...data });
            await fetchUser(); // Update global user state
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to setup profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[#ff8c00]/10 border border-[#ff8c00]/20 mb-6 text-[#ff8c00]">
                    <Music2 className="size-8" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Artist Onboarding</h1>
                <p className="text-[#bcad9a] text-lg">Define your sound and get ready to be booked.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Core Identity */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="size-5 text-[#ff8c00]" />
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Core Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Band/Artist Name</label>
                            <input
                                {...register('band_name', { required: 'Band name is required' })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white font-bold focus:border-[#ff8c00] outline-none transition-all placeholder:opacity-20"
                                placeholder="E.g. The Electric Mayhem"
                            />
                            {errors.band_name && <span className="text-[10px] text-red-400 mt-2 block ml-1">{errors.band_name.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Genre</label>
                            <input
                                {...register('genre', { required: 'Genre is required' })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Jazz, Punk, Synth-pop..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">City</label>
                            <input
                                {...register('location_city', { required: 'City is required' })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Brooklyn"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">State</label>
                            <input
                                {...register('location_state', { required: 'State is required' })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="NY"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Bio</label>
                        <textarea
                            {...register('bio')}
                            rows={4}
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all resize-none"
                            placeholder="Tell venues what makes your performance unique..."
                        />
                    </div>
                </section>

                {/* Presence & Media */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Mic2 className="size-5 text-[#ff8c00]" />
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Presence & Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3A3127] size-5" />
                            <input
                                {...register('instagram')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 pl-14 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Instagram Profile"
                            />
                        </div>

                        <div className="relative">
                            <Youtube className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3A3127] size-5" />
                            <input
                                {...register('youtube')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 pl-14 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="YouTube / Video Link"
                            />
                        </div>

                        <div className="relative md:col-span-2">
                            <Music className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3A3127] size-5" />
                            <input
                                {...register('demo_url')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 pl-14 text-white focus:border-[#ff8c00] outline-none transition-all font-mono text-sm"
                                placeholder="Spotify / SoundCloud / Audio Demo (URL)"
                            />
                        </div>
                    </div>
                </section>

                {/* Booking Contact */}
                <section className="space-y-6 border-t border-[#2A2A2A] pt-12">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="size-5 text-[#ff8c00]" />
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Booking Contact</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Preferred Method</label>
                            <select
                                {...register('contact_method')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all appearance-none"
                            >
                                <option value="email">Email</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="instagram">Instagram DM</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Contact Detail</label>
                            <input
                                {...register('contact_email')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Where should venues reach you?"
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-[#ff8c00] text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_40px_rgba(255,140,0,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xl italic"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>Complete Onboarding <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                    <p className="text-center mt-6 text-[10px] text-[#bcad9a] uppercase tracking-widest font-bold">You can update these details anytime from your profile settings</p>
                </div>
            </form>
        </div>
    );
}
