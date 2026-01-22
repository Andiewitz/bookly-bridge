'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Base';
import { LogOut, User, Music, MapPin, Search } from 'lucide-react';

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Booklyn
                </Link>

                {isAuthenticated ? (
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/browse" className="text-sm font-medium text-muted hover:text-foreground flex items-center gap-1.5 transition-colors">
                            <Search size={18} />
                            Browse
                        </Link>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                    <User size={16} className="text-primary" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-bold leading-none">{user?.email.split('@')[0]}</p>
                                    <p className="text-[10px] text-muted capitalize">{user?.role}</p>
                                </div>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={logout} className="p-2">
                                <LogOut size={18} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                            Log in
                        </Link>
                        <Link href="/auth/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
