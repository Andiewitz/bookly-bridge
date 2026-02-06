'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Music, Calendar, Settings, Mail, User, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export function DashboardSidebar() {
    const pathname = usePathname();
    const { currentContext, switchContext } = useAuthStore();

    const isFinding = currentContext === 'finding';

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home, show: true },
        { name: 'Venues', href: '/dashboard/venues', icon: Compass, show: isFinding },
        { name: 'My Activity', href: '/dashboard/my-gigs', icon: Music, show: true },
        { name: 'Profile', href: '/dashboard/profile', icon: User, show: true },
    ];

    return (
        <aside className="hidden md:flex w-64 flex-col justify-between border-r border-[#3a3127] bg-[#000000] p-6 shrink-0 z-20 h-screen sticky top-0">
            <div className="flex flex-col gap-6">
                {/* Logo & Context Switcher */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-[#ff8c00] flex items-center justify-center text-black font-bold">
                            B
                        </div>
                        <h1 className="text-2xl font-bold leading-none tracking-tight text-white font-display">Booklyn</h1>
                    </div>

                    {/* Switcher */}
                    <button
                        onClick={() => switchContext(isFinding ? 'hosting' : 'finding')}
                        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#1E1E1E] border border-[#3a3127] group transition-all hover:border-[#ff8c00]/50"
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="text-[10px] uppercase tracking-widest text-[#bcad9a] font-bold">Mode</span>
                            <span className="text-sm font-bold text-white group-hover:text-[#ff8c00] transition-colors">
                                {isFinding ? 'Finding Gigs' : 'Hosting Gigs'}
                            </span>
                        </div>
                        <Repeat className="w-4 h-4 text-[#bcad9a] group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1.5 pt-2">
                    {navItems.filter(item => item.show).map((item) => {
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
                                    "text-sm font-medium font-display",
                                    isActive && "font-bold text-[#ff8c00]"
                                )}>
                                    {item.name}
                                </span>
                                {item.badge && (
                                    <span className="ml-auto bg-[#ff8c00] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4">
                {/* Profile Completion */}
                <div className="rounded-xl bg-[#1E1E1E] p-4 border border-[#3a3127]">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-[#bcad9a] font-bold uppercase tracking-tight">Onboarding</p>
                        <p className="text-xs text-white font-mono">75%</p>
                    </div>
                    <div className="h-1.5 w-full bg-[#3a3127] rounded-full overflow-hidden">
                        <div className="h-full w-[75%] bg-[#ff8c00] rounded-full" />
                    </div>
                </div>

                {/* Settings */}
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-[#bcad9a] hover:text-white transition-colors group"
                >
                    <Settings className="w-5 h-5 text-[#bcad9a] group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium font-display">Settings</span>
                </Link>
            </div>
        </aside>
    );
}
