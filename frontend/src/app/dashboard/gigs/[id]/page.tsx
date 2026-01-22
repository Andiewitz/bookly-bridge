'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/ui/Base';
import { ContactButton } from '@/components/ui/ContactButton';
import { Calendar, MapPin, Music, DollarSign, ArrowLeft, Users, Clock } from 'lucide-react';

export default function GigDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [gig, setGig] = useState<any>(null);
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const gigRes = await api.get(`/gigs/${id}`);
                setGig(gigRes.data);

                // Fetch venue profile to get contact info
                const venueRes = await api.get(`/profile/${gigRes.data.venue_id}`);
                setVenue(venueRes.data);
            } catch (err) {
                console.error('Failed to fetch gig details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="p-20 text-center animate-pulse">Loading gig details...</div>;
    if (!gig) return <div className="p-20 text-center">Gig not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-4 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to browse
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <header className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                                {gig.genre}
                            </span>
                            {gig.pay_range && (
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                                    {gig.pay_range}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl font-black">{gig.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-muted">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-primary" />
                                <span className="font-medium text-foreground">{new Date(gig.date_time).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-primary" />
                                <span className="font-medium text-foreground">{new Date(gig.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-primary" />
                                <span className="font-medium text-foreground">{venue?.location_city}, {venue?.location_state}</span>
                            </div>
                        </div>
                    </header>

                    <section className="glass p-8 rounded-3xl space-y-4">
                        <h3 className="text-xl font-bold">Project Description</h3>
                        <p className="text-muted leading-relaxed whitespace-pre-wrap">{gig.description}</p>
                    </section>

                    <section className="glass p-8 rounded-3xl space-y-6">
                        <h3 className="text-xl font-bold">About the Venue</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-card border border-white/10 overflow-hidden shadow-lg">
                                <img src={venue?.photo_url || 'https://via.placeholder.com/150'} alt={venue?.venue_name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{venue?.venue_name}</h4>
                                <p className="text-sm text-muted">Capacity: {venue?.capacity} people</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">{venue?.bio}</p>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="glass p-8 rounded-3xl space-y-6 sticky top-28">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Interested?</h3>
                            <p className="text-sm text-muted">Contact the venue directly to discuss details and book the gig.</p>
                        </div>

                        {venue && (
                            <ContactButton
                                method={venue.contact_method}
                                value={venue.contact_method === 'whatsapp' ? venue.whatsapp_number : venue.contact_method === 'instagram' ? venue.instagram : venue.contact_email}
                                className="w-full py-4 text-lg"
                            />
                        )}

                        <p className="text-[10px] text-center text-muted uppercase tracking-widest font-bold">
                            Secure payments & details handled externally
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
