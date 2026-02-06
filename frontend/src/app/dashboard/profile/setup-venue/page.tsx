'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    Building2,
    Instagram,
    Globe,
    MessageCircle,
    Mail,
    Loader2,
    ArrowRight,
    MapPin,
    Users,
    Music2,
    Info
} from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function SetupVenuePage() {
    const router = useRouter();
    const { fetchUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            //典型的なジャンルを配列に変換
            const typical_genres = data.typical_genres ? data.typical_genres.split(',').map((t: string) => t.trim()) : [];
            await api.put('/profiles/me', { ...data, typical_genres });
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
                    <Building2 className="size-8" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Venue Verification</h1>
                <p className="text-[#bcad9a] text-lg">Register your space and start booking world-class talent.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Venue Identity */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="size-5 text-[#ff8c00]" />
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Venue Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 group">
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Venue Name</label>
                            <input
                                {...register('venue_name', { required: 'Venue name is required' })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white font-bold focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="E.g. The Blue Note"
                            />
                            {errors.venue_name && <span className="text-[10px] text-red-400 mt-2 block ml-1">{errors.venue_name.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                <Users className="size-3" /> Capacity
                            </label>
                            <input
                                type="number"
                                {...register('capacity', { valueAsNumber: true })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="250"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                <Music2 className="size-3" /> Typical Genres
                            </label>
                            <input
                                {...register('typical_genres')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Jazz, Blues, Acoustic..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">City</label>
                            <input
                                {...register('location_city', { required: 'City is required' })}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="New York"
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
                        <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Venue Bio & Vibe</label>
                        <textarea
                            {...register('bio')}
                            rows={4}
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all resize-none"
                            placeholder="Describe your venue's atmosphere, sound system, and what kind of performers you love..."
                        />
                    </div>
                </section>

                {/* Presence & Contact */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="size-5 text-[#ff8c00]" />
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Presence & Contact</h2>
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
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3A3127] size-5" />
                            <input
                                {...register('contact_email')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 pl-14 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="Contact Email for Artists"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Booking Method</label>
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
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">WhatsApp / Phone (Optional)</label>
                            <input
                                {...register('whatsapp_number')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Messenger Handle (Optional)</label>
                            <input
                                {...register('messenger_username')}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                placeholder="your.venue.messenger"
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
                            <>Verify Venue Profile <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                    <p className="text-center mt-6 text-[10px] text-[#bcad9a] uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                        <Info className="size-3" /> All addresses are verified via Google Maps for trust.
                    </p>
                </div>
            </form>
        </div>
    );
}
