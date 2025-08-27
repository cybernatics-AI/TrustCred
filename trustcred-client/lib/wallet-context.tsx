"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletManager, WalletConnectionResult } from './wallet';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  walletType: string | null;
  network: string | null;
  publicKey: string | null;
}

interface WalletContextType extends WalletState {
  connectWallet: (walletName: string) => void;
  disconnectWallet: () => void;
  checkConnection: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    walletType: null,
    network: null,
    publicKey: null,
  });

  // Check for existing wallet connection on mount
  const checkConnection = () => {
    const connectionInfo = walletManager.getStoredConnectionInfo();
    
    setWalletState({
      isConnected: connectionInfo.isConnected,
      isConnecting: false,
      address: connectionInfo.stacksAddress,
      walletType: connectionInfo.walletType,
      network: connectionInfo.network,
      publicKey: connectionInfo.stacksPublicKey,
    });
  };

  // Initialize wallet connection state
  useEffect(() => {
    checkConnection();
  }, []);

  // Listen for wallet connection events
  useEffect(() => {
    const handleWalletConnected = (event: CustomEvent) => {
      const result: WalletConnectionResult = event.detail;
      
      const stacksAddress = result.addresses.find(addr => addr.purpose === 'stacks');
      
      setWalletState({
        isConnected: true,
        isConnecting: false,
        address: stacksAddress?.address || null,
        walletType: result.walletType,
        network: result.network,
        publicKey: stacksAddress?.publicKey || null,
      });
    };

    const handleWalletConnectionCancelled = () => {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
      }));
    };

    window.addEventListener('walletConnected', handleWalletConnected as EventListener);
    window.addEventListener('walletConnectionCancelled', handleWalletConnectionCancelled);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected as EventListener);
      window.removeEventListener('walletConnectionCancelled', handleWalletConnectionCancelled);
    };
  }, []);

  const connectWallet = (walletName: string) => {
    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
    }));

    walletManager.triggerWalletConnection(walletName);
  };

  const disconnectWallet = () => {
    walletManager.disconnect();
    
    setWalletState({
      isConnected: false,
      isConnecting: false,
      address: null,
      walletType: null,
      network: null,
      publicKey: null,
    });

    // Dispatch disconnect event for other components
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
    console.log('Wallet disconnected successfully');
  };

  const contextValue: WalletContextType = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    checkConnection,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}