'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui/Base';
import api from '@/services/api';
import { Calendar, Music, DollarSign, AlignLeft, ArrowLeft, Send } from 'lucide-react';

export default function NewGigPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.post('/gigs/', {
                ...data,
            });
            router.push('/dashboard/browse');
        } catch (err) {
            console.error('Failed to create gig', err);
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
                <h1 className="text-3xl font-black">Post a New Gig</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass p-10 rounded-3xl">
                <div className="space-y-6">
                    <Input
                        label="Gig Title"
                        placeholder="e.g. Saturday Night Blues Special"
                        {...register('title', { required: 'Title is required' })}
                        error={errors.title?.message as string}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Date & Time"
                            type="datetime-local"
                            {...register('date_time', { required: 'Date and time are required' })}
                            error={errors.date_time?.message as string}
                        />
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted ml-1">Preferred Genre</label>
                            <select
                                {...register('genre', { required: 'Genre is required' })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="Blues">Blues</option>
                                <option value="Rock">Rock</option>
                                <option value="Jazz">Jazz</option>
                                <option value="Pop">Pop</option>
                                <option value="Metal">Metal</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Pay Range (Optional)"
                        placeholder="e.g. $200 - $500"
                        {...register('pay_range')}
                        icon={<DollarSign size={16} />}
                    />

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted ml-1">Description & Requirements</label>
                        <textarea
                            {...register('description')}
                            placeholder="Tell bands about the venue, equipment provided, and what you're looking for..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" className="w-full py-4 text-lg" loading={loading}>
                        <Send size={18} />
                        Publish Gig
                    </Button>
                </div>
            </form>
        </div>
    );
}
