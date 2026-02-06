'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import {
    User,
    Instagram,
    Globe,
    Mail,
    MessageCircle,
    Music2,
    Building2,
    Loader2,
    Save,
    Eye,
    MapPin,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfileEditorPage() {
    const { user, fetchUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, reset, watch } = useForm();
    const formData = watch();

    const isBand = user?.role === 'band';

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get('/profiles/me');
            reset(res.data);
        } catch (err) {
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setSaving(true);
        setSuccess(false);
        try {
            if (!isBand && typeof data.typical_genres === 'string') {
                data.typical_genres = data.typical_genres.split(',').map((g: string) => g.trim());
            }
            await api.put('/profiles/me', data);
            await fetchUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-[#bcad9a]">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                <p className="font-display font-medium uppercase tracking-widest text-[10px]">Loading Identity...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Editor Form */}
                <div className="flex-1">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            {isBand ? <Music2 className="text-[#ff8c00]" /> : <Building2 className="text-[#ff8c00]" />}
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bcad9a]">Account Settings</span>
                        </div>
                        <h1 className="font-display text-4xl font-black text-white italic uppercase tracking-tighter">
                            Edit <span className="text-[#ff8c00]">Profile</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {/* Identity Section */}
                        <section className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl p-8 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={16} className="text-[#ff8c00]" />
                                <h2 className="text-xs font-black text-white uppercase tracking-widest">General Info</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">{isBand ? 'Band Name' : 'Venue Name'}</label>
                                    <input
                                        {...register(isBand ? 'band_name' : 'venue_name')}
                                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3 text-sm text-white focus:border-[#ff8c00]/50 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Genre / Vibe</label>
                                    <input
                                        {...register(isBand ? 'genre' : 'typical_genres')}
                                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3 text-sm text-white focus:border-[#ff8c00]/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-[#bcad9a] uppercase tracking-widest mb-2 ml-1">Bio</label>
                                    <textarea
                                        {...register('bio')}
                                        rows={4}
                                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3 text-sm text-white focus:border-[#ff8c00]/50 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Socials Section */}
                        <section className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl p-8 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe size={16} className="text-[#ff8c00]" />
                                <h2 className="text-xs font-black text-white uppercase tracking-widest">Presence</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A3127] size-4" />
                                    <input
                                        {...register('instagram')}
                                        placeholder="Instagram Handle"
                                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3 pl-11 text-sm text-white focus:border-[#ff8c00]/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A3127] size-4" />
                                    <input
                                        {...register('contact_email')}
                                        placeholder="Contact Email"
                                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3 pl-11 text-sm text-white focus:border-[#ff8c00]/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-[#ff8c00] text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-orange-400 transition-all flex items-center justify-center gap-2 italic disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin size-5" /> : <><Save size={18} /> Save Changes</>}
                            </button>
                            {success && (
                                <span className="text-green-500 text-xs font-bold uppercase tracking-widest animate-pulse">Updated!</span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:w-80 shrink-0">
                    <div className="sticky top-28">
                        <div className="flex items-center gap-2 mb-4 ml-1">
                            <Eye size={12} className="text-[#bcad9a]" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#bcad9a]">Live Preview</span>
                        </div>

                        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Card Header Area */}
                            <div className="h-24 bg-[#121212] flex items-center justify-center text-white/5">
                                {isBand ? <Music2 size={48} strokeWidth={1} /> : <Building2 size={48} strokeWidth={1} />}
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-black text-white font-display mb-1 uppercase italic">
                                    {isBand ? (formData.band_name || 'Your Band') : (formData.venue_name || 'Your Venue')}
                                </h3>
                                <p className="text-[#ff8c00] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                    {isBand ? (formData.genre || 'Rock') : 'Elite Venue'}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-[10px] text-[#bcad9a] font-bold uppercase tracking-widest">
                                        <MapPin size={10} className="text-[#ff8c00]" />
                                        {formData.location_city || 'City'}, {formData.location_state || 'NY'}
                                    </div>
                                    {!isBand && (
                                        <div className="flex items-center gap-2 text-[10px] text-[#bcad9a] font-bold uppercase tracking-widest">
                                            <Users size={10} className="text-[#ff8c00]" />
                                            Capacity: {formData.capacity || '0'}
                                        </div>
                                    )}
                                </div>

                                <p className="text-[11px] text-[#bcad9a] leading-relaxed line-clamp-3 mb-6 min-h-[48px]">
                                    {formData.bio || "Fill in your bio to show venues and artists what makes your performance or space unique..."}
                                </p>

                                <div className="flex gap-2">
                                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[#ff8c00]">
                                        <Instagram size={14} />
                                    </div>
                                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[#ff8c00]">
                                        <Mail size={14} />
                                    </div>
                                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[#ff8c00]">
                                        <MessageCircle size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-[#ff8c00]/5 border border-[#ff8c00]/10 rounded-2xl">
                            <p className="text-[10px] text-[#bcad9a] font-medium leading-relaxed">
                                <span className="text-[#ff8c00] font-bold">Tip:</span> High-quality photos and social links increase your booking rate by up to 2.5x.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
