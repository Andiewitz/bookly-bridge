'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, MapPin, Loader2, MessageSquare, ArrowRight, Instagram, Phone } from 'lucide-react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function SetupVenueProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { fetchUser } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            await api.post('/profile/venue', data);
            await fetchUser();
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-[#ff8c00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,140,0,0.2)]">
                    <Building2 className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white">Venue Profile</h1>
                    <p className="text-[#bcad9a]">Verify your venue and set your contact preferences.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Venue Name</label>
                        <input
                            {...register('venue_name', { required: 'Venue name is required' })}
                            className="w-full bg-[#1E1E1E] border border-[#3a3127] rounded-xl px-5 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                            placeholder="E.g. The Midnight Lounge"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">City</label>
                        <input
                            {...register('location_city', { required: 'City is required' })}
                            className="w-full bg-[#1E1E1E] border border-[#3a3127] rounded-xl px-5 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                            placeholder="Manhattan"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Capacity</label>
                        <input
                            type="number"
                            {...register('capacity', { required: 'Capacity is required' })}
                            className="w-full bg-[#1E1E1E] border border-[#3a3127] rounded-xl px-5 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                            placeholder="200"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">About the Venue</label>
                        <textarea
                            {...register('bio')}
                            rows={4}
                            className="w-full bg-[#1E1E1E] border border-[#3a3127] rounded-xl px-5 py-4 text-white focus:border-[#ff8c00] outline-none transition-all resize-none"
                            placeholder="Describe your stage, sound system, and vibe..."
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#ff8c00] mb-6 flex items-center gap-2">
                            <MessageSquare className="size-4" /> Direct Contact Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black/40 rounded-2xl border border-[#3a3127]">
                            <div>
                                <label className="block text-[10px] font-bold text-[#bcad9a] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Phone className="size-3" /> WhatsApp
                                </label>
                                <input
                                    {...register('whatsapp_number')}
                                    className="w-full bg-[#121212] border border-[#3a3127] rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff8c00] outline-none transition-all"
                                    placeholder="+1 555 987 6543"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#bcad9a] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <MessageSquare className="size-3" /> Messenger
                                </label>
                                <input
                                    {...register('messenger_username')}
                                    className="w-full bg-[#121212] border border-[#3a3127] rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff8c00] outline-none transition-all"
                                    placeholder="venue.official"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#ff8c00] text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(255,140,0,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Create Venue Profile <ArrowRight className="w-5 h-5" /></>}
                    </button>
                    <p className="text-center text-[10px] text-[#bcad9a] uppercase tracking-widest font-bold mt-4">
                        Artists will see these links after you accept their application.
                    </p>
                </div>
            </form>
        </div>
    );
}
