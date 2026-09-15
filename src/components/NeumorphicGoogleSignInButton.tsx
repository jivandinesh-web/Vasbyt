import React from 'react';
import { Loader2 } from 'lucide-react';

interface NeumorphicGoogleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  theme?: 'dark-neu' | 'light-neu';
}

export const NeumorphicGoogleSignInButton: React.FC<NeumorphicGoogleSignInButtonProps> = ({
  onClick,
  loading = false,
  className = '',
  size = 'md',
  label = 'Sign in with Google',
  theme = 'dark-neu',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-2',
    md: 'px-4.5 py-2.5 text-sm gap-3',
    lg: 'px-6 py-3.5 text-base gap-3.5',
  };

  const styleClasses =
    theme === 'dark-neu'
      ? 'neu-btn border border-[#2f394a] text-[#f5efe3] hover:text-white'
      : 'bg-[#f5efe3] text-[#1f2633] shadow-[5px_5px_12px_#090c10,-3px_-3px_8px_rgba(255,255,255,0.1)] active:shadow-[inset_3px_3px_6px_#c2baa8,inset_-2px_-2px_5px_#ffffff] border border-[#d9d0be]';

  return (
    <button
      type="button"
      id="btn-neumorphic-google-signin"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center font-bold rounded-xs transition-all cursor-pointer select-none active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${styleClasses} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#e28b37]" />
      ) : (
        <svg className="w-4.5 h-4.5 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span className="tracking-wide">{label}</span>
    </button>
  );
};
