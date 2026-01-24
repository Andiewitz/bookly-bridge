'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Music, Calendar, User, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export function MobileNav() {
    const pathname = usePathname();
    const { currentContext } = useAuthStore();
    const isFinding = currentContext === 'finding';

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home, show: true },
        { name: 'Discover', href: '/dashboard/browse', icon: Compass, show: isFinding },
        { name: 'My Gigs', href: '/dashboard/gigs', icon: Music, show: true },
        { name: 'Inbox', href: '/dashboard/messages', icon: Mail, show: true },
        { name: 'Profile', href: '/dashboard/profile', icon: User, show: true },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-xl border-t border-[#3a3127] px-4 py-2 flex items-center justify-between z-50 h-16 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
            {navItems.filter(item => item.show).map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 px-3 py-1.5 transition-all duration-300",
                            isActive ? "text-[#ff8c00]" : "text-[#bcad9a]"
                        )}
                    >
                        <Icon className={cn("size-6", isActive && "scale-110")} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
