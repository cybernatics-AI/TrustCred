"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, Zap, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const walletOptions = [
  {
    name: "MetaMask",
    description: "Connect using MetaMask wallet",
    icon: "🦊",
    popular: true
  },
  {
    name: "WalletConnect",
    description: "Connect using WalletConnect",
    icon: "🔗",
    popular: false
  },
  {
    name: "Coinbase Wallet",
    description: "Connect using Coinbase Wallet",
    icon: "🔵",
    popular: false
  },
  {
    name: "Phantom",
    description: "Connect using Phantom wallet",
    icon: "👻",
    popular: false
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

  const handleWalletConnect = async (walletName: string) => {
    setSelectedWallet(walletName);
    setIsConnecting(true);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnecting(false);
    setSelectedWallet(null);
    onClose();
  };

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
            onClick={onClose}
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
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Benefits */}
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

            {/* Wallet Options */}
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
                    disabled={isConnecting}
                    className="w-full p-4 border border-border rounded-xl hover:border-lemon-lime-300 dark:hover:border-lemon-lime-700 hover:bg-muted/50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{wallet.icon}</span>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-card-foreground">{wallet.name}</span>
                            {wallet.popular && (
                              <span className="px-2 py-1 bg-lemon-lime-100 dark:bg-lemon-lime-900 text-lemon-lime-700 dark:text-lemon-lime-300 text-xs rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{wallet.description}</p>
                        </div>
                      </div>
                      
                      {isConnecting && selectedWallet === wallet.name ? (
                        <div className="w-5 h-5 border-2 border-lemon-lime-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 text-muted-foreground group-hover:text-lemon-lime-600 dark:group-hover:text-lemon-lime-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>Your wallet connection is secure and encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
