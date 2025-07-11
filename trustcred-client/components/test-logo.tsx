import React from 'react';

interface TrustCredLogoProps {
  size?: number;
  className?: string;
  showAnimation?: boolean;
  variant?: 'full' | 'compact' | 'icon';
}

export function TrustCredLogo({ 
  size = 40, 
  className = "",
  showAnimation = true,
  variant = 'full'
}: TrustCredLogoProps) {
  return (
    <div 
      className={`flex items-center space-x-3 ${className}`}
      style={{ height: size }}
    >
      <div 
        className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg ${showAnimation ? 'hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300' : ''}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        T
      </div>
      {variant === 'full' && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Trust<span className="text-blue-600">Cred</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Digital Credentials
          </span>
        </div>
      )}
    </div>
  );
}

export function TrustCredIcon({ 
  size = 32, 
  className = "" 
}: { 
  size?: number; 
  className?: string; 
}) {
  return (
    <div 
      className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      T
    </div>
  );
}
