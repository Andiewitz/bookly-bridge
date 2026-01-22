import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl",
                variant === "default" ? "bg-white/10" : "bg-white/5 border border-white/5 shadow-sm",
                className
            )}
            {...props}
        />
    );
}
