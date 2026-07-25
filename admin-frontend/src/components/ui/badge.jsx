import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-[#5E6AD2] text-white shadow",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                destructive: "border-transparent bg-rose-100 text-rose-800 border-rose-200",
                outline: "text-foreground border-border",
                success: "border-transparent bg-emerald-100 text-emerald-800 border-emerald-200",
                warning: "border-transparent bg-amber-100 text-amber-800 border-amber-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (<div className={cn(badgeVariants({ variant }), className)} {...props}/>);
}

export { Badge, badgeVariants };
