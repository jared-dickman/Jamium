import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-accent/20 focus-visible:ring-[3px] focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-accent text-accent-foreground shadow-sm shadow-black/5 dark:shadow-accent/20 hover:bg-accent-hover hover:shadow-md hover:shadow-black/10 dark:hover:shadow-accent/30 active:bg-accent-active active:scale-[0.97] active:shadow-sm [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 active:[&_svg]:scale-95',
        primary:
          'group relative overflow-hidden bg-accent text-accent-foreground shadow-sm shadow-black/5 dark:shadow-accent/20 hover:bg-accent-hover hover:shadow-md hover:shadow-black/10 dark:hover:shadow-accent/30 active:bg-accent-active active:scale-[0.97] active:shadow-sm [&>span]:transition-transform [&>span]:duration-200 hover:[&>span]:animate-[magnetic-pull_0.2s_ease-out_forwards] [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 active:[&_svg]:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm shadow-black/5 dark:shadow-destructive/20 hover:bg-destructive/90 hover:shadow-md hover:shadow-black/10 dark:hover:shadow-destructive/30 active:bg-destructive/80 active:scale-[0.97] active:shadow-sm focus-visible:ring-destructive/20 [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 active:[&_svg]:scale-95',
        outline:
          'border border-accent bg-transparent text-foreground shadow-sm shadow-black/5 dark:shadow-white/5 hover:bg-accent-subtle/30 hover:border-accent-hover hover:shadow hover:shadow-black/10 dark:hover:shadow-accent/20 active:bg-accent-subtle/50 active:border-accent-active active:scale-[0.97] [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 hover:[&_svg]:rotate-3 active:[&_svg]:scale-95 active:[&_svg]:rotate-0',
        secondary:
          'group border border-accent bg-transparent text-foreground shadow-sm shadow-black/5 dark:shadow-white/5 hover:bg-accent-subtle/30 hover:border-accent-hover hover:shadow hover:shadow-black/10 dark:hover:shadow-accent/20 active:bg-accent-subtle/50 active:border-accent-active active:scale-[0.97] [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 hover:[&_svg]:rotate-3 active:[&_svg]:scale-95 active:[&_svg]:rotate-0',
        ghost:
          'hover:bg-accent-subtle hover:text-accent active:bg-accent-subtle/80 active:scale-[0.97] [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 active:[&_svg]:scale-95',
        link: 'text-accent underline-offset-4 hover:underline hover:text-accent-hover [&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110 active:[&_svg]:scale-95',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
