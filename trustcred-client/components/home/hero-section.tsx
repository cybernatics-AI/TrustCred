"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-20 bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-30" />
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-lemon-lime-50 dark:bg-lemon-lime-900/20 border border-lemon-lime-200 dark:border-lemon-lime-800 text-lemon-lime-700 dark:text-lemon-lime-300 text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4 mr-2 text-lemon-lime-600 dark:text-lemon-lime-400" />
              Trusted by 10,000+ organizations
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-lemon-lime-600 to-security-green-600 bg-clip-text text-transparent">
                  Digital Credentials
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Secure, verifiable, and tamper-proof digital credentials powered by blockchain technology. 
                Transform how you issue, verify, and manage certificates.
              </p>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center text-muted-foreground">
                <Shield className="w-5 h-5 mr-2 text-security-green-600 dark:text-security-green-400" />
                <span className="font-medium">Blockchain Secured</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Zap className="w-5 h-5 mr-2 text-lemon-lime-600 dark:text-lemon-lime-400" />
                <span className="font-medium">Instant Verification</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="w-5 h-5 mr-2 text-trust-blue-600 dark:text-trust-blue-400" />
                <span className="font-medium">Multi-Platform</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300"
                >
                  Watch Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-8">
              {/* Certificate Preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lemon-lime-100 dark:bg-lemon-lime-900 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-lemon-lime-600 dark:text-lemon-lime-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">Digital Certificate</h3>
                      <p className="text-sm text-muted-foreground">Blockchain Verified</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-security-green-500 border-t-transparent rounded-full"
                  />
                </div>

                {/* Certificate Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Issued to</span>
                    <span className="font-medium text-card-foreground">John Doe</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Credential</span>
                    <span className="font-medium text-card-foreground">Web3 Developer</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="font-medium text-card-foreground">July 2025</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center px-2 py-1 bg-security-green-100 dark:bg-security-green-900 text-security-green-800 dark:text-security-green-200 rounded-full text-sm">
                      <div className="w-2 h-2 bg-security-green-500 rounded-full mr-1" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-3 -right-3 w-6 h-6 bg-lemon-lime-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-4 h-4 bg-security-green-500 rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>

            {/* Background Decorations */}
            <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-lemon-lime-100 dark:bg-lemon-lime-900/30 rounded-full blur-xl" />
            <div className="absolute -z-10 bottom-8 left-8 w-24 h-24 bg-security-green-100 dark:bg-security-green-900/30 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}