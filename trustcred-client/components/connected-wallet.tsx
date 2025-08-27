"use client";

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '../lib/wallet-context';

interface ConnectedWalletProps {
  className?: string;
}

export function ConnectedWallet({ className = '' }: ConnectedWalletProps) {
  const { address, walletType, disconnectWallet } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get wallet display name
  const getWalletDisplayName = (type: string | null) => {
    if (!type) return 'Wallet';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy address to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Add toast notification for successful copy
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('Address copied to clipboard (fallback)');
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  if (!address) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-security-green-50 to-lemon-lime-50 dark:from-security-green-950 dark:to-lemon-lime-950 border border-security-green-200 dark:border-security-green-800 rounded-lg hover:from-security-green-100 hover:to-lemon-lime-100 dark:hover:from-security-green-900 dark:hover:to-lemon-lime-900 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl min-w-[180px]"
      >
        {/* Wallet icon */}
        <div className="w-5 h-5 bg-gradient-to-r from-security-green-500 to-lemon-lime-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 3H2v5a2 2 0 002 2h12a2 2 0 002-2V7zM4 9a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Address and wallet type */}
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-security-green-700 dark:text-security-green-300 truncate">
            {formatAddress(address)}
          </span>
          <span className="text-xs text-security-green-600 dark:text-security-green-400">
            {getWalletDisplayName(walletType)}
          </span>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-security-green-600 dark:text-security-green-400 transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl transition-all duration-300 transform animate-scale-in z-50">
          <div className="p-3">
            {/* Wallet info header */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-security-green-50 to-lemon-lime-50 dark:from-security-green-950 dark:to-lemon-lime-950 rounded-lg mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-security-green-500 to-lemon-lime-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 3H2v5a2 2 0 002 2h12a2 2 0 002-2V7zM4 9a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-security-green-700 dark:text-security-green-300">
                  {getWalletDisplayName(walletType)} Connected
                </p>
                <p className="text-xs text-security-green-600 dark:text-security-green-400">
                  Stacks Mainnet
                </p>
              </div>
            </div>

            {/* Address section */}
            <div className="mb-3">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Address
              </label>
              <button
                onClick={() => copyToClipboard(address)}
                className="w-full p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200 group"
                title="Click to copy"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground truncate">
                    {address}
                  </span>
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to dashboard when implemented
                  console.log('Navigate to dashboard');
                }}
                className="w-full px-3 py-2 text-left rounded-lg hover:bg-gradient-to-r hover:from-lemon-lime-50 hover:to-security-green-50 dark:hover:from-lemon-lime-950 dark:hover:to-security-green-950 hover:text-foreground transition-all duration-300 group flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm">View Dashboard</span>
              </button>

              <button
                onClick={() => {
                  disconnectWallet();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left rounded-lg hover:bg-danger-red-50 dark:hover:bg-danger-red-950 hover:text-danger-red-600 dark:hover:text-danger-red-400 transition-all duration-300 group flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}