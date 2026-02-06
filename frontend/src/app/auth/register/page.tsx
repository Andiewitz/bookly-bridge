'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import Link from 'next/link';
import { Music2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', data);
            const loginRes = await api.post('/auth/login', { email: data.email, password: data.password });
            const { access_token, refresh_token } = loginRes.data;

            localStorage.setItem('access_token', access_token);

            const profileRes = await api.get('/users/me');
            setAuth(profileRes.data, access_token, refresh_token);
            router.push('/dashboard');
        } catch (err: any) {
            if (!err.response) {
                setError(`Network error: Cannot reach the server at ${api.defaults.baseURL}. Please check your connection.`);
            } else {
                setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,140,0,0.4)] to-[rgba(18,18,18,0.9)] mix-blend-multiply" />

                <div className="relative z-10 flex h-full w-full flex-col justify-end p-12 lg:p-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff8c00] text-[#121212]">
                            <Music2 className="w-7 h-7" />
                        </div>
                        <span className="font-display text-3xl font-bold tracking-tight">Booklyn</span>
                    </div>
                    <h2 className="font-display text-4xl font-bold leading-tight lg:text-6xl max-w-md">
                        Start your <span className="text-[#ff8c00]">journey</span> today.
                    </h2>
                    <p className="mt-6 text-lg text-white/70 max-w-sm">
                        Connect with venues and bands. Build your network. Create unforgettable experiences.
                    </p>
                </div>
            </div>

            {/* Right Side: Register Form */}
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
                        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">Create Account</h1>
                        <p className="text-white/50 text-base">Join the music community and start connecting.</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col gap-4">
                            {/* Role Selection */}
                            <div className="flex flex-col mb-2">
                                <span className="text-white/60 text-sm font-medium mb-3 ml-1">I am a...</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setValue('role', 'band', { shouldValidate: true })}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 bg-[#212121]",
                                            watch('role') === 'band' ? "border-[#ff8c00] bg-orange-500/5" : "border-[#424242] hover:border-white/20"
                                        )}
                                    >
                                        <Music2 className={cn("size-6", watch('role') === 'band' ? "text-[#ff8c00]" : "text-white/40")} />
                                        <span className={cn("text-xs font-bold uppercase tracking-wider", watch('role') === 'band' ? "text-white" : "text-white/40")}>Band</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setValue('role', 'venue', { shouldValidate: true })}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 bg-[#212121]",
                                            watch('role') === 'venue' ? "border-[#ff8c00] bg-orange-500/5" : "border-[#424242] hover:border-white/20"
                                        )}
                                    >
                                        <div className={cn("size-6 rounded-md", watch('role') === 'venue' ? "bg-[#ff8c00]" : "bg-white/10")} />
                                        <span className={cn("text-xs font-bold uppercase tracking-wider", watch('role') === 'venue' ? "text-white" : "text-white/40")}>Venue</span>
                                    </button>
                                </div>
                                <input type="hidden" {...register('role', { required: 'Please select a role' })} />
                                {errors.role && <span className="text-xs text-red-400 ml-1 mt-2">{errors.role.message as string}</span>}
                            </div>

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
                                <span className="text-white/60 text-sm font-medium mb-2 ml-1">Password</span>
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full rounded-xl border border-[#424242] bg-[#212121] px-5 py-4 text-white placeholder:text-white/20 focus:border-[#ff8c00] focus:ring-0 transition-all shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Minimum 6 characters' }
                                        })}
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-white/40">
                            Already have an account?
                            <Link href="/auth/login" className="font-bold text-[#ff8c00] hover:underline underline-offset-4 ml-1">
                                Log In
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
