import React from 'react';
import { Loader2 } from 'lucide-react';

export type NeumorphicButtonVariant =
  | 'default'
  | 'primary'
  | 'gold'
  | 'inset'
  | 'ghost'
  | 'danger';

export type NeumorphicButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface NeumorphicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeumorphicButtonVariant;
  size?: NeumorphicButtonSize;
  pressed?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const NeumorphicButton = React.forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      pressed = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded-xs transition-all select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    // Size variants
    const sizeClasses: Record<NeumorphicButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
      icon: 'w-9 h-9 p-0 text-sm',
    };

    // Visual variants
    let variantClasses = 'neu-btn';

    if (pressed) {
      variantClasses = 'neu-btn-pressed text-[#e28b37]';
    } else if (variant === 'primary') {
      variantClasses = 'neu-btn-amber';
    } else if (variant === 'gold') {
      variantClasses = 'neu-btn-gold';
    } else if (variant === 'inset') {
      variantClasses =
        'bg-[#12161e] shadow-[inset_3px_3px_6px_#070a0e,inset_-2px_-2px_5px_#202837] text-[#e28b37] border border-[#e28b37]/30';
    } else if (variant === 'ghost') {
      variantClasses =
        'bg-transparent hover:bg-[#1c222e] text-[#9aa1ac] hover:text-[#f5efe3] active:bg-[#141923] border border-transparent';
    } else if (variant === 'danger') {
      variantClasses =
        'bg-gradient-to-br from-[#802222] to-[#591414] shadow-[4px_4px_10px_#0a0d12,-2px_-2px_6px_rgba(255,100,100,0.15)] text-white hover:from-[#942929] hover:to-[#691a1a] active:shadow-[inset_3px_3px_6px_#3d0909,inset_-2px_-2px_5px_#9c3838]';
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

NeumorphicButton.displayName = 'NeumorphicButton';
