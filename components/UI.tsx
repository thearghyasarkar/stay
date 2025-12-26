import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = "" }) => {
  const LucideIcon = (Icons as any)[name.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase()).replace(/^[a-z]/, (g: string) => g.toUpperCase())] || Icons.HelpCircle;
  return <LucideIcon size={size} className={className} />;
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }> = ({ 
  children, 
  className = "", 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 touch-manipulation";
  const variants = {
    primary: "bg-stone-800 text-stone-50 hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white shadow-sm",
    ghost: "bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input 
    className={`w-full bg-transparent border-b border-stone-300 dark:border-stone-700 px-2 py-3 focus:outline-none focus:border-stone-800 dark:focus:border-stone-200 transition-colors ${className}`}
    {...props}
  />
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-stone-900/50 backdrop-blur-sm border border-stone-100 dark:border-stone-800 rounded-xl p-4 md:p-6 shadow-sm transition-transform duration-200 active:scale-[0.99] ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ children, active, onClick }) => (
  <span 
    onClick={onClick}
    className={`
      inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border select-none active:scale-95
      ${active 
        ? 'bg-stone-800 text-white border-stone-800 dark:bg-stone-100 dark:text-stone-900' 
        : 'bg-transparent text-stone-500 border-stone-200 dark:border-stone-700 hover:border-stone-400'}
    `}
  >
    {children}
  </span>
);