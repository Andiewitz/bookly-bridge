'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Bell,
    Music2,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    Loader2,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    title: string;
    content: string;
    type: string;
    is_read: boolean;
    link: string | null;
    created_at: string;
}

export default function NotificationsPage() {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        try {
            await Promise.all(notifications.filter(n => !n.is_read).map(n => api.post(`/notifications/${n.id}/read`)));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            fetchNotifications(); // Rollback
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'application_accepted': return <CheckCircle2 className="size-5 text-green-500" />;
            case 'new_gig': return <Music2 className="size-5 text-[#ff8c00]" />;
            default: return <Bell className="size-5 text-[#ff8c00]" />;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="size-2 rounded-full bg-[#ff8c00] animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bcad9a]">Alert Center</span>
                    </div>
                    <h1 className="font-display text-4xl font-black text-white italic uppercase leading-none tracking-tighter">
                        Platform <span className="text-[#ff8c00]">Feed</span>
                    </h1>
                </div>

                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#bcad9a] hover:text-white transition-colors"
                    >
                        <Check size={12} /> Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#bcad9a]">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ff8c00]" />
                    <p className="font-display font-medium uppercase tracking-widest text-[10px]">Updating Feed...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-[#1E1E1E] rounded-3xl border border-[#2A2A2A] p-20 text-center">
                    <Bell className="size-12 text-[#2A2A2A] mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2 font-display uppercase italic leading-none">All caught up</h3>
                    <p className="text-[#bcad9a] text-sm">You have no new notifications at this time.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={cn(
                                "group relative overflow-hidden bg-[#1E1E1E] border rounded-2xl p-5 transition-all transition-duration-300",
                                notif.is_read ? "border-[#2A2A2A] opacity-60" : "border-[#ff8c00]/30 shadow-lg shadow-[#ff8c00]/5"
                            )}
                        >
                            {!notif.is_read && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff8c00]" />
                            )}

                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "shrink-0 size-11 rounded-xl flex items-center justify-center border transition-all",
                                    notif.is_read ? "bg-[#121212] border-[#2A2A2A]" : "bg-[#ff8c00]/10 border-[#ff8c00]/20"
                                )}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1 gap-4">
                                        <h3 className={cn(
                                            "font-bold font-display uppercase italic tracking-tight truncate",
                                            notif.is_read ? "text-[#bcad9a]" : "text-white"
                                        )}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] font-medium text-[#bcad9a] whitespace-nowrap">
                                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#bcad9a] leading-relaxed mb-4">
                                        {notif.content}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        {notif.link && (
                                            <Link
                                                href={notif.link}
                                                onClick={() => markAsRead(notif.id)}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff8c00] hover:text-orange-400 transition-colors"
                                            >
                                                View Details <ChevronRight size={12} />
                                            </Link>
                                        )}
                                        {!notif.is_read && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-[#bcad9a] hover:text-white transition-colors ml-auto"
                                            >
                                                Dismiss
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
