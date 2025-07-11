"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const floatingIcons = [
  { icon: Shield, delay: 0, position: "top-20 left-10" },
  { icon: CheckCircle, delay: 1, position: "bottom-20 right-10" },
  { icon: Zap, delay: 2, position: "top-1/2 left-1/4" }
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-lemon-lime-400 via-security-green-400 to-security-green-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} w-20 h-20 opacity-20`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <item.icon className="w-full h-full text-white" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm mb-8"
          >
            <motion.div
              className="w-2 h-2 bg-lemon-lime-300 rounded-full mr-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Building the future of digital credentials
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-white to-lemon-lime-100 bg-clip-text text-transparent"
          >
            TrustCred
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Secure, verifiable digital credentials powered by blockchain technology. 
            Build trust in the digital world with our comprehensive credential management platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex gap-6 justify-center flex-wrap"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-white to-lemon-lime-50 text-security-green-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
              >
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
