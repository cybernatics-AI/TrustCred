"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: Zap, text: "Lightning-fast verification" },
  { icon: CheckCircle, text: "99.9% uptime guarantee" }
];

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-lemon-lime-600 via-security-green-600 to-trust-blue-600 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-white/15 rounded-full blur-lg"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Credential Management?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of organizations worldwide using TrustCred to secure, 
              verify, and manage digital credentials with unmatched reliability.
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center justify-center md:justify-start space-x-3 text-white"
              >
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <benefit.icon size={20} />
                </div>
                <span className="font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="group px-8 py-4 bg-white text-security-green-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <motion.div
                  className="transform transition-transform duration-300 group-hover:translate-x-1"
                >
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/demo"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
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
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12 text-white/80 text-sm"
          >
            <p className="mb-2">Trusted by 10,000+ organizations worldwide</p>
            <p>No credit card required • Setup in under 5 minutes</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
