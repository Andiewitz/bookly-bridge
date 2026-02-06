'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import Link from 'next/link';
import { Music2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', data);
            const { access_token, refresh_token } = response.data;

            localStorage.setItem('access_token', access_token);

            const profileRes = await api.get('/users/me');

            setAuth(profileRes.data, access_token, refresh_token);
            router.push('/dashboard');
        } catch (err: any) {
            if (!err.response) {
                setError(`Network error: Cannot reach the server at ${api.defaults.baseURL}. Please check your connection.`);
            } else {
                setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Immersive Visual Panel */}
            <div className="relative hidden lg:flex lg:h-full lg:w-1/2 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[30%]"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfmeiADQqBzH9M8wEHh1usBuo5NTTlRWSK7_qMJr45qTXCqD0c2Hxlmgve3IUSO9Tffy62h_8zHkJrPn3K119izLVVqsH8ilT2QLGlTw0Ve_lsjCgGJBSXAz2xRtbXz0bTU65TeOyVq9U_DdPyvdkU_-GlrDwwFXj2DFVVeyAHC23YsM8R6mUPRUssKyxmSVsqrswuoeA2O46sGWhDBgVLmv5m8cYOHz2RcmnlQre_bQj4jvaUgG5FwQbON2enAePr3EvKmCofvg')" }}
                />
                {/* Amber Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,140,0,0.4)] to-[rgba(18,18,18,0.9)] mix-blend-multiply" />

                <div className="relative z-10 flex h-full w-full flex-col justify-end p-12 lg:p-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff8c00] text-[#121212]">
                            <Music2 className="w-7 h-7" />
                        </div>
                        <span className="font-display text-3xl font-bold tracking-tight">Booklyn</span>
                    </div>
                    <h2 className="font-display text-4xl font-bold leading-tight lg:text-6xl max-w-md">
                        Capture the <span className="text-[#ff8c00]">rhythm</span> of your soul.
                    </h2>
                    <p className="mt-6 text-lg text-white/70 max-w-sm">
                        Join the global community of music archivists and discover sounds that move you.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-1 flex-col justify-center bg-[#121212] px-6 py-12 lg:px-24 xl:px-32 h-full overflow-y-auto">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff8c00] text-[#121212]">
                            <Music2 className="w-5 h-5" />
                        </div>
                        <span className="font-display text-2xl font-bold">Booklyn</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">Welcome Back</h1>
                        <p className="text-white/50 text-base">Enter your credentials to access your account.</p>
                    </div>

                    {/* Manual Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <label className="flex flex-col">
                                <span className="text-white/60 text-sm font-medium mb-2 ml-1">Email Address</span>
                                <input
                                    className="w-full rounded-xl border border-[#424242] bg-[#212121] px-5 py-4 text-white placeholder:text-white/20 focus:border-[#ff8c00] focus:ring-0 transition-all shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                                    placeholder="name@example.com"
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <span className="text-xs text-red-400 ml-1 mt-1">{errors.email.message as string}</span>}
                            </label>

                            <label className="flex flex-col">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-white/60 text-sm font-medium">Password</span>
                                    <Link href="#" className="text-xs text-[#ff8c00]/70 hover:text-[#ff8c00] transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full rounded-xl border border-[#424242] bg-[#212121] px-5 py-4 text-white placeholder:text-white/20 focus:border-[#ff8c00] focus:ring-0 transition-all shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        {...register('password', { required: 'Password is required' })}
                                    />
                                    <button
                                        className="absolute right-4 text-white/30 hover:text-white/60 transition-colors"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-xs text-red-400 ml-1 mt-1">{errors.password.message as string}</span>}
                            </label>
                        </div>

                        {error && (
                            <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                className="flex w-full items-center justify-center rounded-xl bg-[#ff8c00] px-5 py-4 font-display text-lg font-bold text-[#121212] transition-transform active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] disabled:opacity-50"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login to Dashboard'}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-white/40">
                            Don't have an account?
                            <Link href="/auth/register" className="font-bold text-[#ff8c00] hover:underline underline-offset-4 ml-1">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Bottom Fine Print */}
                    <div className="mt-20 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-white/20 font-display">
                        <Link href="#" className="hover:text-white/40">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white/40">Terms of Service</Link>
                        <span className="hover:text-white/40">© 2026 Booklyn</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
