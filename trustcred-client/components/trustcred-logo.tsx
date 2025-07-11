import React from 'react';

interface TrustCredLogoProps {
  size?: number;
  className?: string;
  showAnimation?: boolean;
}

export function TrustCredLogo({ 
  size = 40, 
  className = "",
  showAnimation = true 
}: TrustCredLogoProps) {
  const gradientId = `logoGradient-${Math.random().toString(36).substr(2, 9)}`;
  const textGradientId = `textGradient-${Math.random().toString(36).substr(2, 9)}`;
  const accentGradientId = `accentGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size * 2}
      height={size}
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-lg ${showAnimation ? 'group-hover:drop-shadow-xl transition-all duration-500' : ''} ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="1" />
          <stop offset="30%" stopColor="#84cc16" stopOpacity="1" />
          <stop offset="70%" stopColor="#4ade80" stopOpacity="1" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ecfccb" stopOpacity="1" />
          <stop offset="100%" stopColor="#dcfce7" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={accentGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="1" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background rectangle with TrustCred gradient */}
      <rect 
        width="100%" 
        height="100%" 
        fill={`url(#${gradientId})`}
        className={showAnimation ? "group-hover:brightness-110 transition-all duration-300" : ""}
      />
      
      <g transform="translate(50, 100)">
        {/* Trust text */}
        <text 
          x="0" 
          y="0" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="60" 
          fill={`url(#${textGradientId})`}
          fontWeight="bold"
          className={showAnimation ? "group-hover:fill-white transition-all duration-300" : ""}
        >
          <tspan x="0" dy="0">Trust</tspan>
          <tspan x="0" dy="70">Cred</tspan>
        </text>
        
        {/* Digital connection path */}
        <path 
          d="M20 50 L40 30 L60 50 L80 30 L100 50" 
          stroke={`url(#${accentGradientId})`}
          strokeWidth="3" 
          fill="none"
          className={showAnimation ? "group-hover:stroke-white transition-all duration-300" : ""}
          filter="url(#glow)"
        />
        
        {/* Connection nodes with animation */}
        <circle 
          cx="40" 
          cy="30" 
          r="4" 
          fill={`url(#${accentGradientId})`}
          className={showAnimation ? "animate-pulse group-hover:fill-white transition-all duration-300" : ""}
        />
        <circle 
          cx="60" 
          cy="50" 
          r="4" 
          fill={`url(#${accentGradientId})`}
          className={showAnimation ? "animate-pulse group-hover:fill-white transition-all duration-300" : ""}
          style={showAnimation ? {animationDelay: '0.3s'} : {}}
        />
        <circle 
          cx="80" 
          cy="30" 
          r="4" 
          fill={`url(#${accentGradientId})`}
          className={showAnimation ? "animate-pulse group-hover:fill-white transition-all duration-300" : ""}
          style={showAnimation ? {animationDelay: '0.6s'} : {}}
        />
        
        {/* Additional decorative elements */}
        <circle 
          cx="20" 
          cy="50" 
          r="2" 
          fill="rgba(255,255,255,0.7)" 
          className={showAnimation ? "animate-pulse" : ""}
          style={showAnimation ? {animationDelay: '0.9s'} : {}}
        />
        <circle 
          cx="100" 
          cy="50" 
          r="2" 
          fill="rgba(255,255,255,0.7)" 
          className={showAnimation ? "animate-pulse" : ""}
          style={showAnimation ? {animationDelay: '1.2s'} : {}}
        />
      </g>
    </svg>
  );
}

// Simplified version for favicons and small uses
export function TrustCredIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  const gradientId = `iconGradient-${Math.random().toString(36).substr(2, 9)}`;
  const textGradientId = `iconTextGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ecfccb" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      
      {/* Simplified T for TrustCred */}
      <g transform="translate(25, 100)">
        <text 
          x="0" 
          y="0" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="120" 
          fill={`url(#${textGradientId})`}
          fontWeight="bold"
          textAnchor="start"
        >
          T
        </text>
        
        {/* Simple connection dots */}
        <circle cx="120" cy="-20" r="6" fill="rgba(255,255,255,0.8)" />
        <circle cx="140" cy="0" r="6" fill="rgba(255,255,255,0.8)" />
        <circle cx="120" cy="20" r="6" fill="rgba(255,255,255,0.8)" />
        
        {/* Connection lines */}
        <path 
          d="M120 -20 L140 0 L120 20" 
          stroke="rgba(255,255,255,0.6)" 
          strokeWidth="2" 
          fill="none"
        />
      </g>
    </svg>
  );
}
