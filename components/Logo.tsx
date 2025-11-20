import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true, variant = 'dark' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const subTextColor = variant === 'light' ? 'text-emerald-200' : 'text-emerald-600';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Animated Background Shape */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-xl transform rotate-3 shadow-lg"></div>
        <div className="absolute inset-0 bg-white/20 rounded-xl backdrop-blur-sm transform -rotate-3"></div>
        
        {/* R Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative w-6 h-6 text-white z-10 transform -skew-x-6">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <path d="M12 16V3" className="opacity-80" />
        </svg>
        
        {/* Motion dot */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-sm z-20 animate-pulse"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black text-xl tracking-tight italic ${textColor}`}>
            REHABER
          </span>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${subTextColor}`}>
            锐汗步
          </span>
        </div>
      )}
    </div>
  );
};