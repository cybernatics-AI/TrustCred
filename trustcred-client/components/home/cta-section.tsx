"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, CheckCircle, Star, Clock, } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: Zap, text: "Lightning-fast verification" },
  { icon: CheckCircle, text: "99.9% uptime guarantee" }
];

const stats = [
  { value: "10,000+", label: "Organizations" },
  { value: "50M+", label: "Credentials Issued" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Customer Rating" }
];

export function CTASection() {
  return (
    <section className="py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-20" />
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-lemon-lime-100 dark:bg-lemon-lime-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 bg-security-green-100 dark:bg-security-green-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main CTA Content */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Transform Your
                <span className="block bg-gradient-to-r from-lemon-lime-600 to-security-green-600 bg-clip-text text-transparent">
                  Credential Management?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Join thousands of organizations worldwide using our platform to secure, 
                verify, and manage digital credentials with unmatched reliability and trust.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg shadow-sm border border-border"
                >
                  <div className="p-2 bg-lemon-lime-100 dark:bg-lemon-lime-900/30 rounded-lg">
                    <benefit.icon className="w-5 h-5 text-lemon-lime-600 dark:text-lemon-lime-400" />
                  </div>
                  <span className="font-medium text-card-foreground">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Start Free Trial</span>
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
                  Schedule Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-muted-foreground text-sm space-y-2"
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-security-green-500" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 text-lemon-lime-500" />
                <span>Setup in under 5 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-lemon-lime-400 text-lemon-lime-400" />
                ))}
                <span className="ml-2">Rated 4.9/5 by 1,000+ customers</span>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-card rounded-2xl shadow-lg border border-border"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-lemon-lime-600 to-security-green-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}