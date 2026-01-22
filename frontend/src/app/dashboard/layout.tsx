'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();

    return (
        <div className="bg-[#121212] text-white font-sans antialiased overflow-hidden h-screen flex">
            {/* Left Sidebar */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#121212] relative">
                {/* Sticky Top Bar */}
                <header className="h-16 bg-[#121212]/80 backdrop-blur-md border-b border-[#2A2A2A] flex items-center justify-between px-8 sticky top-0 z-10 w-full">
                    {/* Search */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-500 group-focus-within:text-[#FF8C00] transition-colors" />
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF8C00] sm:text-sm transition-shadow duration-200"
                                placeholder="Search venues, bands, or gigs..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6 ml-6">
                        {/* Filters */}
                        <div className="hidden md:flex items-center gap-2">
                            <button className="px-3 py-1.5 rounded-full border border-[#2A2A2A] bg-[#1E1E1E] text-xs font-medium text-gray-300 hover:border-[#FF8C00] hover:text-white transition-colors flex items-center gap-1">
                                Genre <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="px-3 py-1.5 rounded-full border border-[#2A2A2A] bg-[#1E1E1E] text-xs font-medium text-gray-300 hover:border-[#FF8C00] hover:text-white transition-colors flex items-center gap-1">
                                Date <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-[#2A2A2A] mx-2" />

                        {/* User Profile */}
                        <button className="flex items-center gap-3 group">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold font-display leading-none group-hover:text-[#FF8C00] transition-colors">
                                    {user?.email?.split('@')[0] || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 leading-none mt-1 capitalize">{user?.role || 'Member'}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 overflow-hidden relative flex items-center justify-center text-white font-bold">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                        </button>
                    </div>
                </header>

                {/* Feed Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
