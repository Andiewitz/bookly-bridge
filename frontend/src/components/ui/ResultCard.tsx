'use client';

import React from 'react';
import { Button } from './Base';
import { MapPin, Calendar, Music, Users, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface ResultCardProps {
    type: 'gig' | 'band';
    data: any;
}

export const ResultCard = ({ type, data }: ResultCardProps) => {
    const isGig = type === 'gig';

    return (
        <div className="group relative glass rounded-3xl p-6 hover:border-primary/30 transition-all hover:scale-[1.01] flex flex-col justify-between gap-6 overflow-hidden">
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        {isGig ? <Calendar size={24} /> : <Music size={24} />}
                    </div>
                    {isGig && data.pay_range && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                            {data.pay_range}
                        </span>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {isGig ? data.title : data.band_name}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary" />
                            {data.location_city || data.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Music size={14} className="text-accent" />
                            {isGig ? data.genre : data.genre}
                        </span>
                        {isGig && (
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-blue-500" />
                                {new Date(data.date_time).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-muted line-clamp-2 leading-relaxed italic">
                    &quot;{isGig ? data.description : data.bio}&quot;
                </p>
            </div>

            <div className="flex items-center gap-3 relative z-10">
                <Link href={isGig ? `/dashboard/gigs/${data.id}` : `/dashboard/profile/${data.user_id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                        View Details
                    </Button>
                </Link>
                <Button size="sm" variant="ghost" className="p-2 aspect-square">
                    <MessageCircle size={18} />
                </Button>
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
        </div>
    );
};
