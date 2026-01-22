'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Music, Compass, Mail, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'My Gigs', href: '/dashboard/gigs', icon: Music },
    { name: 'Discover', href: '/dashboard/browse', icon: Compass },
    { name: 'Messages', href: '/dashboard/messages', icon: Mail, badge: 2 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[240px] flex-shrink-0 bg-black border-r border-[#2A2A2A] flex flex-col justify-between z-20 h-screen sticky top-0">
            <div>
                {/* Logo */}
                <div className="h-20 flex items-center px-6">
                    <span className="text-2xl font-bold font-display tracking-tight text-white">
                        BOOKLYN<span className="text-[#FF8C00]">.</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-4 px-6 py-3 border-l-[4px] transition-all duration-200",
                                    isActive
                                        ? "border-[#FF8C00] bg-[#1E1E1E]/50 text-[#FF8C00]"
                                        : "border-transparent text-gray-400 hover:text-white hover:bg-[#1E1E1E]/30"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                                <span className="font-medium font-display text-base">{item.name}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-[#FF8C00] text-black text-xs font-bold px-1.5 rounded-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-[#2A2A2A]">
                <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium font-display text-sm">Settings</span>
                </button>
            </div>
        </aside>
    );
}
