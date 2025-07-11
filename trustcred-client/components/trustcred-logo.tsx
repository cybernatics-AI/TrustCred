import React from 'react';
import Image from 'next/image';

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
  return (
    <div 
      className={`relative ${showAnimation ? 'group-hover:scale-110 transition-all duration-500' : ''} ${className}`}
      style={{ width: size * 2, height: size }}
    >
      <Image
        src="/Trustcred.jpg"
        alt="TrustCred Logo"
        fill
        className={`object-contain drop-shadow-lg ${showAnimation ? 'group-hover:drop-shadow-xl transition-all duration-500' : ''}`}
        priority
      />
    </div>
  );
}

// Simplified version for favicons and small uses
export function TrustCredIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/Trustcred.jpg"
        alt="TrustCred Icon"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
