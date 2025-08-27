"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { TrustCredLogo } from "./test-logo";
import { ConnectWalletModal } from "./connect-wallet-modal";
import { ConnectedWallet } from "./connected-wallet";
import { MobileSidebar } from "./mobile-sidebar";
import { useWallet } from "../lib/wallet-context";

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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { isConnected, isConnecting } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <TrustCredLogo 
                size={40} 
                variant="full"
                showAnimation={true}
                className="transform transition-all duration-500 group-hover:scale-105 sm:w-auto w-32"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 text-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 transition-all duration-300 py-2 group">
                      <span className="relative">
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-lemon-lime-400 to-security-green-500 group-hover:w-full transition-all duration-300"></span>
                      </span>
                      <svg
                        className={`w-4 h-4 transition-all duration-300 ${
                          openDropdown === item.name ? "rotate-180 text-lemon-lime-500" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 xl:w-72 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl transition-all duration-300 transform ${
                        openDropdown === item.name
                          ? "opacity-100 translate-y-0 visible scale-100"
                          : "opacity-0 translate-y-2 invisible scale-95"
                      }`}
                    >
                      <div className="p-2">
                        {item.dropdown.map((subItem, index) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block p-3 rounded-lg hover:bg-gradient-to-r hover:from-lemon-lime-50 hover:to-security-green-50 dark:hover:from-lemon-lime-950 dark:hover:to-security-green-950 hover:text-foreground transition-all duration-300 group transform hover:scale-105"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="font-medium text-sm flex items-center justify-between">
                              {subItem.name}
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 mt-1">
                              {subItem.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 transition-all duration-300 py-2 relative group"
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-lemon-lime-400 to-security-green-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Desktop actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {!isConnected && (
                <>
                  <Link
                    href="/login"
                    className="text-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-lemon-lime-50 hover:to-security-green-50 dark:hover:from-lemon-lime-950 dark:hover:to-security-green-950"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    disabled={isConnecting}
                    className="px-6 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                  >
                    {isConnecting ? 'Connecting...' : 'Get Started'}
                  </button>
                </>
              )}
              {isConnected && (
                <ConnectedWallet />
              )}
            </div>

            {/* Tablet actions - simplified */}
            <div className="hidden md:flex lg:hidden items-center space-x-3">
              {!isConnected && (
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Connecting...' : 'Get Started'}
                </button>
              )}
              {isConnected && (
                <ConnectedWallet />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-foreground hover:text-accent transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onWalletConnect={() => setIsWalletModalOpen(true)}
      />

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </nav>
  );
}
