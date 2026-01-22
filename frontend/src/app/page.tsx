'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Base';
import { Music, Calendar, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center space-y-12 animate-fade-in">
        <div className="space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Zap size={14} /> The stage is yours
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
            Book Gigs.<br />
            <span className="text-gradient-primary">
              No Bullshit.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted text-xl md:text-2xl leading-relaxed">
            The premium platform connecting world-class bands with elite venues.
            Direct contact. Manual bookings. Zero fees.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link href="/auth/register">
            <Button size="lg" className="px-10 py-5 text-xl shadow-xl shadow-primary/20">
              Get Started Now
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary" size="lg" className="px-10 py-5 text-xl">
              Log In
            </Button>
          </Link>
          <Link href="/auth/login?demo=true">
            <Button variant="ghost" size="lg" className="px-10 py-5 text-xl border border-white/10 glass hover:bg-white/10">
              Try Demo
            </Button>
          </Link>
        </div>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: <Music size={24} />, title: "Showcase Your Sound", desc: "Upload high-quality demos and reach venues searching for your specific vibe." },
            { icon: <Calendar size={24} />, title: "Direct Bookings", desc: "Connect via WhatsApp or Instagram. No middleman, no platform fees." },
            { icon: <Shield size={24} />, title: "Verified Network", desc: "A curated community of professional musicians and high-end venues." }
          ].map((feature, i) => (
            <div key={i} className="glass-card group animate-slide-up" style={{ animationDelay: `${300 + i * 100}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center text-muted text-sm font-medium animate-fade-in" style={{ animationDelay: '800ms' }}>
        <p>© 2026 Booklyn. Built for the stage.</p>
      </footer>
    </div>
  );
}
