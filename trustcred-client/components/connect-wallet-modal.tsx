"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from '../lib/wallet-context';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connectWallet, isConnecting, isConnected } = useWallet();
  const [localConnecting, setLocalConnecting] = useState(false);

  // Add global error handler to suppress JsonRpcError
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('User canceled the request') || 
          event.error?.message?.includes('JsonRpcError')) {
        event.preventDefault();
        console.log('Suppressed wallet connection cancellation error');
        return false;
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  // Close modal when wallet connects
  useEffect(() => {
    if (isConnected) {
      setLocalConnecting(false);
      // Close the modal after successful connection
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [isConnected, onClose]);

  const handleConnectWallet = useCallback(async () => {
    setLocalConnecting(true);

    try {
      // Use the context's connect wallet method
      connectWallet('stacks-wallet');

    } catch (err: unknown) {
      console.error('Wallet connection error:', err);
      setLocalConnecting(false);
    }
  }, [connectWallet]);

  // When modal opens, automatically trigger wallet connection
  useEffect(() => {
    if (isOpen && !isConnecting && !localConnecting && !isConnected) {
      handleConnectWallet();
    }
  }, [isOpen, isConnecting, localConnecting, isConnected, handleConnectWallet]);

  // This component now just handles the connection logic
  // The actual modal UI is handled by Stacks.js
  return null;
}
