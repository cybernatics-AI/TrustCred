"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Monitor, Smartphone, Shield, Zap, Users, BarChart3, CheckCircle } from "lucide-react";

const productFeatures = [
  {
    id: "dashboard",
    title: "Credential Dashboard",
    description: "Centralized management of all your digital credentials with real-time status updates and analytics.",
    icon: Monitor,
    color: "from-trust-blue-500 to-trust-blue-600",
    features: ["Real-time monitoring", "Batch operations", "Custom workflows", "Advanced filtering"]
  },
  {
    id: "mobile",
    title: "Mobile Verification",
    description: "Instant credential verification on-the-go with our secure mobile application and QR code scanning.",
    icon: Smartphone,
    color: "from-lemon-lime-500 to-lemon-lime-600",
    features: ["QR code scanning", "Offline verification", "Biometric security", "Cross-platform support"]
  },
  {
    id: "security",
    title: "Advanced Security",
    description: "Military-grade encryption with blockchain immutability ensures your credentials are tamper-proof.",
    icon: Shield,
    color: "from-security-green-500 to-security-green-600",
    features: ["Zero-knowledge proofs", "Blockchain anchoring", "Multi-sig validation", "Audit trails"]
  }
];

const stats = [
  { icon: Users, value: "10M+", label: "Verified Credentials" },
  { icon: Zap, value: "2.3s", label: "Average Verification" },
  { icon: Shield, value: "99.9%", label: "Security Uptime" },
  { icon: BarChart3, value: "150+", label: "Countries Served" }
];

export function ProductShowcase() {
  const [activeFeature, setActiveFeature] = useState("dashboard");

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Complete Credential Lifecycle Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From issuance to verification, our comprehensive platform handles every aspect 
            of digital credential management with enterprise-grade security and reliability.
          </p>
        </motion.div>

        {/* Product Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {productFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`cursor-pointer transition-all duration-300 ${
                activeFeature === feature.id ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className={`bg-card rounded-xl p-6 border-2 transition-all duration-300 ${
                activeFeature === feature.id 
                  ? 'border-lemon-lime-400 shadow-lg bg-gradient-to-br from-lemon-lime-50/50 to-security-green-50/50 dark:from-lemon-lime-950/20 dark:to-security-green-950/20' 
                  : 'border-border hover:border-lemon-lime-200 dark:hover:border-lemon-lime-800 shadow-md hover:shadow-lg'
              }`}>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 transition-transform duration-300 ${
                  activeFeature === feature.id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Feature List */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: activeFeature === feature.id ? "auto" : 0,
                    opacity: activeFeature === feature.id ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: activeFeature === feature.id ? 1 : 0,
                          x: activeFeature === feature.id ? 0 : -20
                        }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-center space-x-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-lemon-lime-500" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Active Indicator */}
                {activeFeature === feature.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="mt-4 h-1 bg-gradient-to-r from-lemon-lime-400 to-security-green-500 rounded-full"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-card rounded-xl p-6 text-center border border-border shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-lemon-lime-100 to-security-green-100 dark:from-lemon-lime-900 dark:to-security-green-900 rounded-lg">
                  <stat.icon className="w-6 h-6 text-lemon-lime-600 dark:text-lemon-lime-400" />
                </div>
              </div>
              <motion.div
                className="text-2xl font-bold text-card-foreground mb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
