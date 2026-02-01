'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    Music2,
    Calendar,
    Clock,
    DollarSign,
    Tag,
    MapPin,
    Loader2,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    Info
} from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

declare const google: any;

export default function NewGigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Google Maps State
    const addressInputRef = React.useRef<HTMLInputElement | null>(null);
    const [locationData, setLocationData] = useState<{
        formatted_address: string;
        place_id: string;
        location: { type: string; coordinates: number[] };
        borough?: string;
    } | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    React.useEffect(() => {
        if (!addressInputRef.current || typeof google === 'undefined') return;

        const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
            componentRestrictions: { country: 'us' },
            fields: ['address_components', 'geometry', 'formatted_address', 'place_id'],
            types: ['establishment', 'geocode'],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            // Extract borough for NYC if possible
            let borough = '';
            const components = place.address_components || [];
            for (const component of components) {
                if (component.types.includes('sublocality_level_1')) {
                    borough = component.long_name;
                }
            }

            const data = {
                formatted_address: place.formatted_address || '',
                place_id: place.place_id || '',
                location: {
                    type: 'Point',
                    coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
                },
                borough
            };

            setLocationData(data);
            setValue('address', place.formatted_address);
        });
    }, [setValue]);

    const onSubmit = async (data: any) => {
        if (!locationData) {
            setError('Please select a verified address from the dropdown suggestions.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Processing tags
            const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [];

            await api.post('/gigs/', {
                ...data,
                tags,
                ...locationData
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to publish gig. Ensure all fields are valid.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="size-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/50">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Gig Published!</h1>
                <p className="text-[#bcad9a] text-lg max-w-md">Your gig is now live and being broadcasted to all local artists.</p>
                <div className="mt-10 flex gap-4">
                    <Link href="/dashboard" className="px-8 py-3 bg-[#1E1E1E] border border-[#3a3127] rounded-xl font-bold hover:bg-[#2A2A2A] transition-colors">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-8">
                <Link href="/dashboard" className="text-[#bcad9a] hover:text-white flex items-center gap-1 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4" /> Dashboard
                </Link>
                <span className="text-[#3a3127]">/</span>
                <span className="text-white text-sm font-bold uppercase tracking-widest">Post a Gig</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <div className="mb-10">
                        <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">Call for Talent</h1>
                        <p className="text-[#bcad9a] text-lg">Detail your event requirements to find the perfect match.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                                <Info className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Gig Title */}
                            <div className="group">
                                <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Gig Title</label>
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-5 text-white text-lg font-bold focus:border-[#ff8c00] focus:ring-4 focus:ring-[#ff8c00]/5 outline-none transition-all placeholder:text-white/10"
                                    placeholder="E.g. Saturday Night Jazz Explosion"
                                />
                                {errors.title && <span className="text-[10px] text-red-400 mt-2 block ml-1">{errors.title.message as string}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Genre */}
                                <div>
                                    <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Genre</label>
                                    <input
                                        {...register('genre', { required: 'Genre is required' })}
                                        className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                        placeholder="Rock, Jazz, Duo..."
                                    />
                                </div>

                                {/* Pay */}
                                <div>
                                    <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                        <DollarSign className="size-3 text-[#ff8c00]" /> Pay / Budget
                                    </label>
                                    <input
                                        {...register('pay', { required: 'Pay info is required' })}
                                        className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                        placeholder="$500 - $800"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                        <Calendar className="size-3 text-[#ff8c00]" /> Date
                                    </label>
                                    <input
                                        {...register('date', { required: 'Date is required' })}
                                        className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                        placeholder="Oct 24, 2026"
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                        <Clock className="size-3 text-[#ff8c00]" /> Start Time
                                    </label>
                                    <input
                                        {...register('time', { required: 'Time is required' })}
                                        className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all"
                                        placeholder="9:00 PM"
                                    />
                                </div>
                            </div>

                            {/* Address/Location (Maps Placeholder) */}
                            <div>
                                <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                    <MapPin className="size-3 text-[#ff8c00]" /> Full Address (Verified by Google)
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('address', { required: 'Address is required' })}
                                        ref={(e) => {
                                            register('address').ref(e);
                                            addressInputRef.current = e;
                                        }}
                                        className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 pl-12 text-white focus:border-[#ff8c00] outline-none transition-all"
                                        placeholder="Start typing your venue address..."
                                    />
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bcad9a] size-5" />
                                </div>
                                <p className="mt-2 text-[10px] text-[#bcad9a]/60 uppercase tracking-widest font-bold">Used for map discovery and artist navigation</p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                    <Tag className="size-3 text-[#ff8c00]" /> Search Tags
                                </label>
                                <input
                                    {...register('tags')}
                                    className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all font-mono text-sm"
                                    placeholder="Separated by commas (e.g. Trio, Outdoor, PA Provided)"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-black text-[#bcad9a] uppercase tracking-widest mb-3 ml-1">Event Details & Tech Rider</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    rows={6}
                                    className="w-full bg-black border border-[#3a3127] rounded-2xl px-6 py-4 text-white focus:border-[#ff8c00] outline-none transition-all resize-none leading-relaxed"
                                    placeholder="What kind of band are you looking for? What gear is available at the venue?"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-[#ff8c00] text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_40px_rgba(255,140,0,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xl italic"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>Publish Gig Opportunity <ArrowRight className="w-6 h-6" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar / Info */}
                <div className="space-y-6">
                    <div className="p-8 bg-[#1E1E1E] border border-[#3a3127] rounded-3xl sticky top-28">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-[#3a3127] pb-4">Posting Tips</h3>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="size-6 rounded-full bg-[#ff8c00]/10 border border-[#ff8c00]/20 flex items-center justify-center flex-shrink-0 text-[#ff8c00] text-xs font-bold">1</div>
                                <p className="text-sm text-[#bcad9a] leading-relaxed">
                                    <strong className="text-white block mb-1 uppercase tracking-tight">Be Specific</strong>
                                    Mention if a drum kit or backline is provided to attract better talent.
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="size-6 rounded-full bg-[#ff8c00]/10 border border-[#ff8c00]/20 flex items-center justify-center flex-shrink-0 text-[#ff8c00] text-xs font-bold">2</div>
                                <p className="text-sm text-[#bcad9a] leading-relaxed">
                                    <strong className="text-white block mb-1 uppercase tracking-tight">Fair Pay</strong>
                                    Gigs with clear pay ranges get 3x more applications.
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="size-6 rounded-full bg-[#ff8c00]/10 border border-[#ff8c00]/20 flex items-center justify-center flex-shrink-0 text-[#ff8c00] text-xs font-bold">3</div>
                                <p className="text-sm text-[#bcad9a] leading-relaxed">
                                    <strong className="text-white block mb-1 uppercase tracking-tight">Anti-Scam</strong>
                                    We verify every address through Google Maps to ensure trust on the platform.
                                </p>
                            </li>
                        </ul>

                        <div className="mt-10 p-4 rounded-2xl bg-black border border-[#3a3127]">
                            <div className="flex items-center gap-3 mb-2">
                                <Music2 className="size-5 text-[#ff8c00]" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">Live Preview</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-[#1E1E1E] rounded animate-pulse"></div>
                                <div className="h-3 w-1/2 bg-[#1E1E1E] rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
