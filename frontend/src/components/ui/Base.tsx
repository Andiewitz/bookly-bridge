import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    loading,
    children,
    disabled,
    ...props
}, ref) => {
    const variants = {
        primary: 'btn-gradient', // Uses global class
        secondary: 'bg-white/5 text-foreground hover:bg-white/10 border border-white/10 shadow-sm backdrop-blur-sm',
        ghost: 'hover:bg-white/5 text-muted hover:text-foreground',
        outline: 'border border-primary/50 text-foreground hover:bg-primary/5 hover:border-primary',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-11 px-6 py-2.5 rounded-xl',
        lg: 'h-14 px-8 text-lg rounded-2xl',
        icon: 'h-11 w-11 p-0 rounded-xl',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            {children}
        </button>
    );
});
Button.displayName = "Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...props }, ref) => {
    return (
        <div className="space-y-2 w-full">
            {label && <label className="text-sm font-medium text-muted ml-1">{label}</label>}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'glass-input w-full',
                        icon ? 'pl-11 pr-4' : 'px-4',
                        error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-400 ml-1 animate-slide-up">{error}</span>}
        </div>
    );
});
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...props }, ref) => {
    return (
        <div className="space-y-2 w-full">
            {label && <label className="text-sm font-medium text-muted ml-1">{label}</label>}
            <textarea
                ref={ref}
                className={cn(
                    'glass-input w-full min-h-[100px] resize-y',
                    error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-400 ml-1 animate-slide-up">{error}</span>}
        </div>
    );
});
Textarea.displayName = "Textarea";
