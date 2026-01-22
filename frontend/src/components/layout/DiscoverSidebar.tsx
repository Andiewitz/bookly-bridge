'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Music, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Discover', href: '/dashboard/browse', icon: Compass },
    { name: 'My Gigs', href: '/dashboard/gigs', icon: Music },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
];

export function DiscoverSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-64 flex-col justify-between border-r border-[#3a3127] bg-[#000000] p-6 shrink-0 z-20">
            <div className="flex flex-col gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-[#ff8c00] flex items-center justify-center text-black font-bold">
                        B
                    </div>
                    <h1 className="text-2xl font-bold leading-none tracking-tight">Booklyn</h1>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors group",
                                    isActive
                                        ? "bg-[#1E1E1E] border-l-4 border-[#ff8c00] text-white shadow-lg shadow-black/50"
                                        : "text-[#bcad9a] hover:bg-[#3a3127] hover:text-white"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-[#ff8c00]" : "text-[#bcad9a] group-hover:text-white"
                                )} />
                                <span className={cn(
                                    "text-sm font-medium",
                                    isActive && "font-bold text-[#ff8c00]"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4">
                {/* Profile Completion */}
                <div className="rounded-xl bg-[#1E1E1E] p-4 border border-[#3a3127]">
                    <p className="text-xs text-[#bcad9a] font-body mb-2">Your Profile Completion</p>
                    <div className="h-1.5 w-full bg-[#3a3127] rounded-full overflow-hidden">
                        <div className="h-full w-[75%] bg-[#ff8c00] rounded-full" />
                    </div>
                    <p className="text-right text-xs text-white mt-1 font-mono">75%</p>
                </div>

                {/* Settings */}
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-[#bcad9a] hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
}
