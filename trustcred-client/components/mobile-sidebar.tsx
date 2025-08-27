"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TrustCredLogo } from "./test-logo";
import { ConnectedWallet } from "./connected-wallet";
import { useWallet } from "../lib/wallet-context";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnect: () => void;
}

const navigation = [
  {
    name: "Solutions",
    href: "/solutions",
    dropdown: [
      { name: "Credential Issuance", href: "/solutions/issuance", description: "Issue verified digital credentials" },
      { name: "Verification", href: "/solutions/verification", description: "Verify credential authenticity" },
      { name: "Integration", href: "/solutions/integration", description: "API and SDK integration" },
      { name: "Analytics", href: "/solutions/analytics", description: "Credential usage insights" },
    ],
  },
  {
    name: "Platform",
    href: "/platform",
    dropdown: [
      { name: "Dashboard", href: "/platform/dashboard", description: "Manage your credentials" },
      { name: "API Reference", href: "/platform/api", description: "Developer documentation" },
      { name: "Security", href: "/platform/security", description: "Security standards" },
      { name: "Compliance", href: "/platform/compliance", description: "Regulatory compliance" },
    ],
  },
  {
    name: "Resources",
    href: "/resources",
    dropdown: [
      { name: "Documentation", href: "/resources/docs", description: "Technical guides" },
      { name: "Case Studies", href: "/resources/case-studies", description: "Success stories" },
      { name: "Blog", href: "/resources/blog", description: "Latest insights" },
      { name: "Community", href: "/resources/community", description: "Join our community" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
];

export function MobileSidebar({ isOpen, onClose, onWalletConnect }: MobileSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { isConnected, isConnecting } = useWallet();

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLinkClick = () => {
    onClose();
    setOpenDropdown(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-card border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-3">
                <TrustCredLogo 
                  size={35} 
                  variant="full"
                  showAnimation={false}
                />
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(item.name)}
                          className="flex items-center justify-between w-full p-4 text-left text-foreground hover:bg-muted rounded-lg transition-colors duration-200 group"
                        >
                          <span className="font-medium">{item.name}</span>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdown === item.name ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 space-y-1 border-l border-border pl-4">
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    onClick={handleLinkClick}
                                    className="block p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                                  >
                                    <div className="font-medium">{subItem.name}</div>
                                    <div className="text-xs mt-1 opacity-70">{subItem.description}</div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="block p-4 text-foreground hover:bg-muted rounded-lg transition-colors duration-200 font-medium"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Divider */}
              <div className="px-4 py-4">
                <div className="border-t border-border"></div>
              </div>

              {/* Actions */}
              <div className="px-4 space-y-3">
                {!isConnected && (
                  <>
                    <Link
                      href="/login"
                      onClick={handleLinkClick}
                      className="block w-full p-4 text-center text-foreground hover:bg-muted rounded-lg transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                    
                    <button
                      onClick={() => {
                        onWalletConnect();
                        onClose();
                      }}
                      disabled={isConnecting}
                      className="block w-full p-4 bg-accent text-accent-foreground font-medium rounded-lg text-center shadow-lg hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? 'Connecting...' : 'Get Started'}
                    </button>
                  </>
                )}
                {isConnected && (
                  <div className="flex justify-center">
                    <ConnectedWallet className="w-full" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-6 mt-6">
                <div className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>🔗</span>
                    <span>Mainnet Only</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Secure & Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
