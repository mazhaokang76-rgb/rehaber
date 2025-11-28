import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {/* Stylized Runner / 'R' Shape */}
      {/* Head */}
      <circle cx="65" cy="25" r="10" fill="url(#brandGradient)" />
      
      {/* Body and Leg swoop representing motion/step */}
      <path
        d="M30 35 C 30 35, 55 35, 65 50 C 75 65, 65 85, 50 95"
        stroke="url(#brandGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Trailing leg / Back kick */}
      <path
        d="M60 55 L 85 45"
        stroke="url(#brandGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Arm swing */}
      <path
        d="M45 45 L 20 60"
        stroke="url(#brandGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};