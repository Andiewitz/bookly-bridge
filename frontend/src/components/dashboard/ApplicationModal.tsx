'use client';

import React, { useState } from 'react';
import { X, Send, Music2, Loader2, Info } from 'lucide-react';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string) => Promise<void>;
    gigTitle: string;
    venueName: string;
}

export function ApplicationModal({ isOpen, onClose, onConfirm, gigTitle, venueName }: ApplicationModalProps) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!message.trim()) {
            setError('Please include a brief message for the venue.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onConfirm(message);
            onClose();
        } catch (err: any) {
            setError('Failed to send application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#121212] rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden p-8">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-8">
                    <div className="size-12 rounded-2xl bg-[#ff8c00]/10 border border-[#ff8c00]/20 flex items-center justify-center text-[#ff8c00] mb-6">
                        <Send className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Pitch to {venueName}</h2>
                    <p className="text-[#bcad9a] text-sm">Applying for: <span className="text-white font-bold">{gigTitle}</span></p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3">
                        <Info className="size-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Your Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full bg-black border border-[#2A2A2A] rounded-2xl p-5 text-white focus:border-[#ff8c00] outline-none transition-all resize-none text-sm leading-relaxed"
                            placeholder="Introduce your band, mention your best tracks, and why you're a perfect fit for this gig..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">Response</p>
                            <p className="text-[10px] text-white font-bold italic">~24 Hours</p>
                        </div>
                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">Direct</p>
                            <p className="text-[10px] text-white font-bold italic">To Manager</p>
                        </div>
                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">Safe</p>
                            <p className="text-[10px] text-white font-bold italic">Verified Venue</p>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-tight">By applying, the venue manager will receive access to your public profile and media demos.</p>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full py-4 bg-[#ff8c00] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-orange-400 hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="size-4 animate-spin" /> : <><Send className="size-4" /> Send Application</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
