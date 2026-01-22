'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui/Base';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import { Music, MapPin, Users, Instagram, Mail, Phone, ArrowLeft, Upload } from 'lucide-react';

export default function EditProfilePage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    const isBand = user?.role === 'band';
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                reset(res.data);
            } catch (err) {
                console.error('No profile found, starting fresh');
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, [reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.put('/profile/me', data);
            router.push('/dashboard/profile');
        } catch (err) {
            console.error('Update failed', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center animate-pulse">Loading form...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 glass rounded-xl hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-black">Edit Your Profile</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass p-10 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={isBand ? "Band Name" : "Venue Name"}
                        {...register(isBand ? 'band_name' : 'venue_name', { required: 'This field is required' })}
                        error={errors[isBand ? 'band_name' : 'venue_name']?.message as string}
                    />
                    <Input
                        label="Location (City)"
                        {...register('location_city', { required: 'City is required' })}
                        error={errors.location_city?.message as string}
                    />
                    <Input
                        label="State / Region"
                        {...register('location_state', { required: 'State is required' })}
                        error={errors.location_state?.message as string}
                    />
                    {isBand ? (
                        <Input
                            label="Genre"
                            placeholder="e.g. Blues, Rock"
                            {...register('genre', { required: 'Genre is required' })}
                            error={errors.genre?.message as string}
                        />
                    ) : (
                        <Input
                            label="Capacity"
                            type="number"
                            {...register('capacity')}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted ml-1">Bio (Tell your story)</label>
                    <textarea
                        {...register('bio')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder={isBand ? "We've been rocking since..." : "Our venue is the heart of..."}
                    />
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2">Contact Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Instagram Handle"
                            placeholder="@youraccount"
                            {...register('instagram')}
                            icon={<Instagram size={16} />}
                        />
                        <Input
                            label="WhatsApp Number"
                            placeholder="+123456789"
                            {...register('whatsapp_number')}
                            icon={<Phone size={16} />}
                        />
                        <Input
                            label="Contact Email"
                            placeholder="booking@example.com"
                            {...register('contact_email')}
                            icon={<Mail size={16} />}
                        />
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted ml-1">Preferred Contact Method</label>
                            <select
                                {...register('contact_method')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="email">Email</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="instagram">Instagram</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" className="w-full py-4 text-lg" loading={loading}>
                        Save Profile
                    </Button>
                </div>
            </form>

            <div className="p-8 glass rounded-3xl border-dashed border-2 border-white/10 text-center space-y-4">
                <h3 className="font-bold">Media Uploads</h3>
                <p className="text-sm text-muted">Photos and demos will be available for upload in the next step (Cloudflare R2 integration).</p>
                <Button variant="outline" size="sm" disabled>
                    <Upload size={16} />
                    Coming Soon
                </Button>
            </div>
        </div>
    );
}
