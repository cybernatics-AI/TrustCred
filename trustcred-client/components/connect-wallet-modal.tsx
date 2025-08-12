"use client";

import { useState, useCallback, useEffect } from "react";
import { walletManager } from '../lib/wallet';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);

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

  // Listen for wallet connection events
  useEffect(() => {
    const handleWalletConnected = (event: CustomEvent) => {
      const result = event.detail;
      setIsConnecting(false);
      
      // Close the modal after successful connection
      setTimeout(() => {
        onClose();
      }, 1000);
      
      console.log('Wallet connected successfully:', result);
    };

    const handleWalletConnectionCancelled = () => {
      console.log('Wallet connection cancelled');
      setIsConnecting(false);
      // Close the modal when user cancels
      onClose();
    };

    window.addEventListener('walletConnected', handleWalletConnected as EventListener);
    window.addEventListener('walletConnectionCancelled', handleWalletConnectionCancelled);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected as EventListener);
      window.removeEventListener('walletConnectionCancelled', handleWalletConnectionCancelled);
    };
  }, [onClose]);

  const handleConnectWallet = useCallback(async () => {
    setIsConnecting(true);

    try {
      // Check if any wallet is installed
      const isInstalled = await walletManager.checkWalletInstallation();
      if (!isInstalled) {
        console.error('No Stacks wallet is installed');
        setIsConnecting(false);
        return;
      }

      // Trigger the Stacks.js built-in modal
      walletManager.triggerWalletConnection('xverse'); // Default to Xverse, but user can choose in the modal

    } catch (err: unknown) {
      console.error('Wallet connection error:', err);
      setIsConnecting(false);
    }
  }, []);

  // When modal opens, automatically trigger wallet connection
  useEffect(() => {
    if (isOpen && !isConnecting) {
      handleConnectWallet();
    }
  }, [isOpen, isConnecting, handleConnectWallet]);

  // This component now just handles the connection logic
  // The actual modal UI is handled by Stacks.js
  return null;
}
