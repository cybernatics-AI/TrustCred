"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { request } from "sats-connect";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletAddress {
  address: string;
  publicKey: string;
  purpose: 'payment' | 'ordinals' | 'stacks';
}

interface ConnectionResult {
  addresses: WalletAddress[];
}

const walletOptions = [
  {
    name: "Xverse",
    description: "Bitcoin & Stacks wallet with native DeFi support",
    icon: "🟠",
    popular: true,
    supported: true
  },
  {
    name: "Leather",
    description: "Open-source Stacks wallet",
    icon: "🟤",
    popular: false,
    supported: false
  },
  {
    name: "Asigna",
    description: "Multi-signature Stacks wallet",
    icon: "🔐",
    popular: false,
    supported: false
  }
];

const benefits = [
  { icon: Shield, text: "Secure blockchain authentication" },
  { icon: Zap, text: "Instant credential verification" },
  { icon: CheckCircle, text: "Decentralized identity management" }
];

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectedAddresses, setConnectedAddresses] = useState<WalletAddress[] | null>(null);

  const handleXverseConnect = useCallback(async () => {
    setSelectedWallet("Xverse");
    setIsConnecting(true);
    setError(null);

    try {
      const response = await request('wallet_connect', null, {
        addresses: ['stacks', 'payment', 'ordinals'],
        message: 'Connect to TrustCred for secure digital credentials',
        network: 'Mainnet'
      });

      if (response.status === 'success') {
        const result = response.result as ConnectionResult;
        setConnectedAddresses(result.addresses);
        
        // Store connection info in localStorage for persistence
        localStorage.setItem('trustcred_wallet_connected', 'true');
        localStorage.setItem('trustcred_wallet_type', 'xverse');
        
        const stacksAddress = result.addresses.find(addr => addr.purpose === 'stacks');
        if (stacksAddress) {
          localStorage.setItem('trustcred_stacks_address', stacksAddress.address);
          localStorage.setItem('trustcred_stacks_publickey', stacksAddress.publicKey);
        }

        // Close modal after short delay to show success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        let errorMessage = 'Failed to connect wallet';
        
        if (response.error.code === 'USER_REJECTION') {
          errorMessage = 'Connection was cancelled by user';
        } else if (response.error.code === 'WALLET_NOT_INSTALLED') {
          errorMessage = 'Xverse wallet is not installed. Please install it from the Chrome Web Store.';
        } else {
          errorMessage = response.error.message || 'Connection failed';
        }
        
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'An unexpected error occurred while connecting');
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  }, [onClose]);

  const handleWalletConnect = async (walletName: string) => {
    if (walletName === "Xverse") {
      await handleXverseConnect();
    } else {
      setError("This wallet is not supported yet. Please use Xverse wallet.");
    }
  };

  const resetModal = useCallback(() => {
    setError(null);
    setConnectedAddresses(null);
    setIsConnecting(false);
    setSelectedWallet(null);
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-lemon-lime-100 dark:bg-lemon-lime-900 rounded-lg">
                    <Wallet className="w-6 h-6 text-lemon-lime-600 dark:text-lemon-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">Connect Wallet</h2>
                    <p className="text-sm text-muted-foreground">Choose your preferred wallet to get started</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3 p-4 bg-danger-red-50 dark:bg-danger-red-950 border border-danger-red-200 dark:border-danger-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-danger-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-danger-red-800 dark:text-danger-red-200">Connection Failed</p>
                    <p className="text-sm text-danger-red-600 dark:text-danger-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display */}
            {connectedAddresses && !error && (
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3 p-4 bg-security-green-50 dark:bg-security-green-950 border border-security-green-200 dark:border-security-green-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-security-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-security-green-800 dark:text-security-green-200">Successfully Connected!</p>
                    <p className="text-sm text-security-green-600 dark:text-security-green-300 mt-1">
                      Connected {connectedAddresses.length} address{connectedAddresses.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {!connectedAddresses && (
              <div className="p-6 border-b border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Why connect your wallet?</h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="p-1 bg-security-green-100 dark:bg-security-green-900 rounded">
                        <benefit.icon className="w-4 h-4 text-security-green-600 dark:text-security-green-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet Options */}
            {!connectedAddresses && (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Select Wallet</h3>
                <div className="space-y-3">
                  {walletOptions.map((wallet, index) => (
                    <motion.button
                      key={wallet.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleWalletConnect(wallet.name)}
                      disabled={isConnecting || !wallet.supported}
                      className={`w-full p-4 border rounded-xl transition-all duration-200 group ${
                        wallet.supported
                          ? "border-border hover:border-lemon-lime-300 dark:hover:border-lemon-lime-700 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          : "border-muted bg-muted/30 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{wallet.icon}</span>
                          <div className="text-left">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-card-foreground">{wallet.name}</span>
                              {wallet.popular && wallet.supported && (
                                <span className="px-2 py-1 bg-lemon-lime-100 dark:bg-lemon-lime-900 text-lemon-lime-700 dark:text-lemon-lime-300 text-xs rounded-full">
                                  Popular
                                </span>
                              )}
                              {wallet.supported && (
                                <span className="px-2 py-1 bg-security-green-100 dark:bg-security-green-900 text-security-green-700 dark:text-security-green-300 text-xs rounded-full">
                                  Supported
                                </span>
                              )}
                              {!wallet.supported && (
                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{wallet.description}</p>
                          </div>
                        </div>
                        
                        {isConnecting && selectedWallet === wallet.name ? (
                          <div className="w-5 h-5 border-2 border-lemon-lime-500 border-t-transparent rounded-full animate-spin" />
                        ) : wallet.supported ? (
                          <svg className="w-5 h-5 text-muted-foreground group-hover:text-lemon-lime-600 dark:group-hover:text-lemon-lime-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="text-center">
                {error && (
                  <div className="mb-4">
                    <button
                      onClick={() => setError(null)}
                      className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}
                
                {!connectedAddresses && (
                  <>
                    <p className="text-xs text-muted-foreground mb-2">
                      Don&apos;t have Xverse wallet? <a href="https://www.xverse.app/" target="_blank" rel="noopener noreferrer" className="text-lemon-lime-600 dark:text-lemon-lime-400 hover:underline">Download here</a>
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span>Your wallet connection is secure and encrypted</span>
                    </div>
                  </>
                )}
                
                {connectedAddresses && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Connection successful! You can now access TrustCred features.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-security-green-600 dark:text-security-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Wallet securely connected</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
