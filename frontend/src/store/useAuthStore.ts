import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    role?: 'band' | 'venue';
    has_band_profile: boolean;
    has_venue_profile: boolean;
}

interface AuthState {
    user: User | null;
    currentContext: 'finding' | 'hosting';
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    switchContext: (context: 'finding' | 'hosting') => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            currentContext: 'finding',
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            setAuth: (user, accessToken, refreshToken) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('refresh_token', refreshToken);
                }
                set({ user, accessToken, refreshToken, isAuthenticated: true });
            },
            switchContext: (context) => set({ currentContext: context }),
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
                set({ user: null, currentContext: 'finding', accessToken: null, refreshToken: null, isAuthenticated: false });
            },
            fetchUser: async () => {
                const api = (await import('@/services/api')).default;
                try {
                    const res = await api.get('/users/me');
                    set({ user: res.data });
                } catch (err) {
                    console.error('Failed to refresh user:', err);
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
