"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { TrustCredLogo } from "./test-logo";
import { ConnectWalletModal } from "./connect-wallet-modal";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <TrustCredLogo 
                size={45} 
                variant="full"
                showAnimation={true}
                className="transform transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
                      className={`absolute top-full left-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl transition-all duration-300 transform ${
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
            
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/login"
                className="text-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-lemon-lime-50 hover:to-security-green-50 dark:hover:from-lemon-lime-950 dark:hover:to-security-green-950"
              >
                Sign In
              </Link>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-6 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-accent transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className="flex items-center justify-between w-full p-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`transition-all duration-200 overflow-hidden ${
                        openDropdown === item.name ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block p-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="pt-4 space-y-2">
              <Link
                href="/login"
                className="block p-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="block w-full p-3 bg-accent text-accent-foreground font-medium rounded-lg text-center shadow-lg hover:bg-accent/90 transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </nav>
  );
}
