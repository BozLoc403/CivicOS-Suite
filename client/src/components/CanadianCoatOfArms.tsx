import React from 'react';

interface CanadianCoatOfArmsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CanadianCoatOfArms({ size = 'md', className = '' }: CanadianCoatOfArmsProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-white rounded-lg border-2 border-red-200 flex items-center justify-center shadow-sm`}>
      {/* Simplified Canadian Coat of Arms inspired design */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-1">
        {/* Shield background */}
        <path
          d="M50 10 L20 25 L20 70 Q20 85 50 90 Q80 85 80 70 L80 25 Z"
          fill="#dc2626"
          stroke="#b91c1c"
          strokeWidth="1"
        />
        
        {/* Maple leaf */}
        <path
          d="M50 25 L52 35 L60 35 L54 40 L56 50 L50 45 L44 50 L46 40 L40 35 L48 35 Z"
          fill="white"
        />
        
        {/* Crown on top */}
        <rect x="45" y="12" width="10" height="8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
        <circle cx="50" cy="16" r="2" fill="#fbbf24"/>
        
        {/* Side emblems */}
        <circle cx="35" cy="45" r="6" fill="white" stroke="#dc2626" strokeWidth="1"/>
        <circle cx="65" cy="45" r="6" fill="white" stroke="#dc2626" strokeWidth="1"/>
        
        {/* Lions simplified */}
        <rect x="32" y="42" width="6" height="6" fill="#dc2626" rx="1"/>
        <rect x="62" y="42" width="6" height="6" fill="#dc2626" rx="1"/>
      </svg>
    </div>
  );
}

export function CanadianMapleLeaf({ size = 'md', className = '' }: CanadianCoatOfArmsProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M50 10 L55 25 L70 25 L60 35 L65 50 L50 40 L35 50 L40 35 L30 25 L45 25 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}