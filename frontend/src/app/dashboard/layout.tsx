'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Search, Bell, MessageSquare, Menu, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { PostGigModal } from '@/components/dashboard/PostGigModal';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, currentContext } = useAuthStore();
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await api.get('/notifications');
                setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
            } catch (err) {
                console.error('Failed to fetch unread count:', err);
            }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const isHosting = currentContext === 'hosting';

    return (
        <div className="bg-[#121212] text-white font-sans antialiased overflow-hidden h-screen flex">
            {/* Sidebar */}
            <DashboardSidebar />

            <PostGigModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSuccess={() => {
                    // Refresh data logic here if needed, or simple notification
                    console.log('Gig posted successfully');
                }}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#121212] relative">
                {/* Top Header */}
                <header className="flex h-20 items-center justify-between border-b border-[#3a3127] bg-[#121212]/95 backdrop-blur-md px-8 sticky top-0 z-10 w-full">
                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-white">
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-4">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-5 h-5 text-[#bcad9a] group-focus-within:text-[#ff8c00] transition-colors" />
                            </div>
                            <input
                                className="block w-full rounded-xl border border-[#3a3127] bg-[#1E1E1E] py-2.5 pl-10 pr-3 text-sm text-white placeholder-[#bcad9a] focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] focus:outline-none transition-all"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 ml-auto">
                        {isHosting && (
                            <Link
                                href="/dashboard/gigs/new"
                                className="flex items-center gap-2 bg-[#ff8c00] text-black px-4 py-2 rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(255,140,0,0.3)] transition-all mr-2"
                            >
                                <PlusCircle className="size-4" />
                                <span className="hidden sm:inline">Post Gig</span>
                            </Link>
                        )}

                        <Link
                            href="/dashboard/notifications"
                            className="relative flex size-10 items-center justify-center rounded-full bg-[#1E1E1E] text-white hover:bg-[#3a3127] transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[#ff8c00] border-2 border-[#1E1E1E]" />
                            )}
                        </Link>
                        <button className="flex size-10 items-center justify-center rounded-full bg-[#1E1E1E] text-white hover:bg-[#3a3127] transition-colors">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-[1px] bg-[#3a3127] mx-2" />
                        <Link href="/dashboard/settings/profile" className="flex items-center gap-3 cursor-pointer group">
                            <div className="size-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-transparent group-hover:border-[#ff8c00] transition-colors flex items-center justify-center text-white font-bold">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-bold leading-none text-white">{user?.email?.split('@')[0] || 'User'}</p>
                                <p className="text-xs text-[#bcad9a] mt-1 capitalize">{currentContext === 'hosting' ? 'Venue Manager' : 'Artist'}</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    {children}
                </div>

                {/* Mobile Navigation */}
                <MobileNav />
            </main>
        </div>
    );
}
