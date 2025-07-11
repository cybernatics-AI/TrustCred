"use client";

import Link from "next/link";
import { TrustCredLogo } from "./test-logo";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Security", href: "/security" },
      { name: "Integrations", href: "/integrations" },
      { name: "API", href: "/api" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Compliance", href: "/compliance" },
    ],
  },
};

const socialLinks = [
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-card to-card/50 border-t border-border backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <TrustCredLogo 
                  size={35} 
                  variant="full"
                  showAnimation={true}
                  className="transform transition-all duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Building the future of digital credentials with security, trust, and innovation. 
              Empowering organizations to issue and verify credentials with confidence.
            </p>
            
            {/* Newsletter signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Stay updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-background/50 backdrop-blur-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon-lime-400 focus:border-lemon-lime-400 transition-all duration-300 hover:bg-background/70"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-lemon-lime-400 via-lemon-lime-500 to-security-green-500 text-white rounded-lg hover:from-lemon-lime-500 hover:via-lemon-lime-600 hover:to-security-green-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 whitespace-nowrap shadow-lg hover:shadow-xl group relative overflow-hidden">
                  <span className="relative z-10">Subscribe</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 transition-all duration-300 text-sm relative group"
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-lemon-lime-400 to-security-green-500 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TrustCred. All rights reserved.
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-muted-foreground">Follow us</span>
              <div className="flex space-x-4">
                {socialLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-lemon-lime-500 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 p-2 rounded-lg hover:bg-gradient-to-br hover:from-lemon-lime-50 hover:to-security-green-50 dark:hover:from-lemon-lime-950 dark:hover:to-security-green-950"
                    aria-label={item.name}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2 group">
                <div className="w-3 h-3 bg-gradient-to-r from-security-green-400 to-security-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="group-hover:text-security-green-600 dark:group-hover:text-security-green-400 transition-colors duration-300">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <div className="w-3 h-3 bg-gradient-to-r from-lemon-lime-400 to-lemon-lime-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                <span className="group-hover:text-lemon-lime-600 dark:group-hover:text-lemon-lime-400 transition-colors duration-300">GDPR Ready</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <div className="w-3 h-3 bg-gradient-to-r from-trust-blue-400 to-trust-blue-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
                <span className="group-hover:text-trust-blue-600 dark:group-hover:text-trust-blue-400 transition-colors duration-300">ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
