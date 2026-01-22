'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui/Base';
import api from '@/services/api';
import { Calendar, Music, MapPin, Send, ArrowLeft } from 'lucide-react';

export default function NewRequestPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // API expects genres as an array
            await api.post('/gig-requests/', {
                ...data,
                genres: [data.genre], // Simplified for MVP
                willing_to_travel: data.willing_to_travel === 'true',
            });
            router.push('/dashboard/browse');
        } catch (err) {
            console.error('Failed to post availability', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 glass rounded-xl hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-black">Post Your Availability</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass p-10 rounded-3xl">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Available From"
                            type="date"
                            {...register('available_from', { required: 'Start date is required' })}
                            error={errors.available_from?.message as string}
                        />
                        <Input
                            label="Available Until"
                            type="date"
                            {...register('available_to', { required: 'End date is required' })}
                            error={errors.available_to?.message as string}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted ml-1">Primary Genre</label>
                            <select
                                {...register('genre', { required: 'Genre is required' })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="Blues">Blues</option>
                                <option value="Rock">Rock</option>
                                <option value="Jazz">Jazz</option>
                                <option value="Pop">Pop</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted ml-1">Willing to Travel?</label>
                            <select
                                {...register('willing_to_travel')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="false">No, local only</option>
                                <option value="true">Yes, I can travel</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Max Distance (km)"
                        type="number"
                        placeholder="50"
                        {...register('max_distance')}
                    />

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted ml-1">Additional Notes</label>
                        <textarea
                            {...register('notes')}
                            placeholder="Tell venues about your setup, set length, or specific requirements..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" className="w-full py-4 text-lg" loading={loading}>
                        <Send size={18} />
                        Post Availability
                    </Button>
                </div>
            </form>
        </div>
    );
}
