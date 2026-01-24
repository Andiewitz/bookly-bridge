'use client';

import React, { useEffect, useState } from 'react';
import { User, CheckCircle2, XCircle, MessageSquare, Phone, Instagram, Loader2, Music2, ExternalLink } from 'lucide-react';
import api from '@/services/api';

export default function ApplicationsView() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/applications/venue');
            setApplications(res.data);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (appId: string, status: string) => {
        setActionId(appId);
        try {
            await api.patch(`/applications/${appId}/status?status_update=${status}`);
            await fetchApplications(); // Refresh list to see contact info logic (simulated for now)
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#bcad9a]">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                <p className="font-display font-bold uppercase tracking-widest text-sm">Loading applicants...</p>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1e1e1e] rounded-2xl border border-dashed border-[#3a3127] text-center">
                <Music2 className="size-12 text-[#3a3127] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
                <p className="text-[#bcad9a] max-w-sm">When artists apply to your gigs, they will appear here for you to review and connect.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-6">Manage Applicants</h2>

            <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                    <article key={app.id} className="bg-[#1E1E1E] rounded-2xl border border-[#2A2A2A] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-xl bg-black border border-[#2A2A2A] flex items-center justify-center text-[#FF8C00] font-bold text-2xl">
                                {app.applicant_name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{app.applicant_name}</h3>
                                <p className="text-sm text-[#bcad9a]">{app.message || "No message provided."}</p>
                                <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                                    Applied {new Date(app.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {app.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => updateStatus(app.id, 'accepted')}
                                        disabled={!!actionId}
                                        className="flex-1 md:flex-none px-6 py-2.5 bg-green-500 text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Accept & Connect
                                    </button>
                                    <button
                                        onClick={() => updateStatus(app.id, 'declined')}
                                        disabled={!!actionId}
                                        className="px-4 py-2.5 bg-transparent border border-[#3a3127] text-gray-400 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                                    >
                                        Decline
                                    </button>
                                </>
                            ) : app.status === 'accepted' ? (
                                <div className="flex flex-col gap-2 w-full md:w-64">
                                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1 text-center">Connected! Shoot them a message:</span>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-[#25D366] text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                                            <Phone className="size-4" />
                                        </button>
                                        <button className="flex-1 py-2 bg-[#0084FF] text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                                            <MessageSquare className="size-4" />
                                        </button>
                                        <button className="flex-1 py-2 bg-gradient-to-tr from-[#F58529] via-[#D6249F] to-[#285AEB] text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                                            <Instagram className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-4 py-2 border border-red-500/20 rounded-lg">Declined</span>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
