"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    { name: "API", href: "/api" }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Compliance", href: "/compliance" },
    { name: "Security Policy", href: "/security-policy" }
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
    { name: "Status", href: "/status" }
  ]
};

const socialLinks = [
  { Icon: Twitter, href: "https://twitter.com/trustcred", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com/company/trustcred", label: "LinkedIn" },
  { Icon: Github, href: "https://github.com/trustcred", label: "GitHub" },
  { Icon: Mail, href: "mailto:contact@trustcred.com", label: "Email" }
];

const certifications = [
  { icon: Shield, label: "SOC 2 Type II" },
  { icon: Globe, label: "GDPR Compliant" },
  { icon: Zap, label: "ISO 27001" }
];

export function EnhancedFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/" className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-lemon-lime-500 to-security-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">TrustCred</span>
                </Link>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Secure, verifiable digital credentials powered by blockchain technology. 
                  Building trust in the digital world with cutting-edge green technology.
                </p>
                
                {/* Certifications */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Certifications & Compliance</h4>
                  <div className="flex flex-wrap gap-3">
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg border border-border"
                      >
                        <cert.icon className="w-4 h-4 text-lemon-lime-600" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {cert.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], sectionIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h4 className="text-sm font-semibold text-foreground mb-4 capitalize">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              © {new Date().getFullYear()} TrustCred. All rights reserved. Built with 💚 for a sustainable future.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-muted hover:bg-lemon-lime-100 dark:hover:bg-lemon-lime-900 text-muted-foreground hover:text-lemon-lime-600 dark:hover:text-lemon-lime-400 rounded-lg transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
