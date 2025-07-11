"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe, Users, Lock, CheckCircle, BarChart3, Smartphone, Cloud } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "Advanced cryptographic protection with zero-knowledge proofs and blockchain immutability ensuring your credentials are tamper-proof.",
    color: "from-trust-blue-500 to-trust-blue-600",
    hoverColor: "group-hover:from-trust-blue-400 group-hover:to-trust-blue-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast Verification",
    description: "Instant credential verification in under 2 seconds. Our optimized infrastructure processes millions of verifications daily.",
    color: "from-lemon-lime-500 to-lemon-lime-600",
    hoverColor: "group-hover:from-lemon-lime-400 group-hover:to-lemon-lime-500"
  },
  {
    icon: Globe,
    title: "Global Standards Compliance",
    description: "Built on W3C standards and compliant with GDPR, SOC 2, and international credential frameworks for worldwide acceptance.",
    color: "from-security-green-500 to-security-green-600",
    hoverColor: "group-hover:from-security-green-400 group-hover:to-security-green-500"
  },
  {
    icon: Users,
    title: "Enterprise Scale",
    description: "Designed for organizations of all sizes. From startups to Fortune 500 companies, our platform scales with your needs.",
    color: "from-professional-gray-600 to-professional-gray-700",
    hoverColor: "group-hover:from-professional-gray-500 group-hover:to-professional-gray-600"
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    description: "Zero-knowledge architecture ensures credential verification without exposing sensitive personal information.",
    color: "from-trust-blue-600 to-security-green-600",
    hoverColor: "group-hover:from-trust-blue-500 group-hover:to-security-green-500"
  },
  {
    icon: CheckCircle,
    title: "Automated Workflows",
    description: "Streamline credential issuance and verification with intelligent automation and customizable business rules.",
    color: "from-lemon-lime-600 to-security-green-600",
    hoverColor: "group-hover:from-lemon-lime-500 group-hover:to-security-green-500"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive insights into credential usage, verification patterns, and compliance metrics with real-time dashboards.",
    color: "from-security-green-600 to-trust-blue-600",
    hoverColor: "group-hover:from-security-green-500 group-hover:to-trust-blue-500"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Native mobile apps and responsive web interfaces ensure seamless credential management across all devices.",
    color: "from-professional-gray-600 to-trust-blue-600",
    hoverColor: "group-hover:from-professional-gray-500 group-hover:to-trust-blue-500"
  },
  {
    icon: Cloud,
    title: "Cloud-Native Infrastructure",
    description: "Built on modern cloud architecture with 99.9% uptime, automatic scaling, and enterprise-grade security.",
    color: "from-trust-blue-500 to-lemon-lime-500",
    hoverColor: "group-hover:from-trust-blue-400 group-hover:to-lemon-lime-400"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

export function FeaturesGrid() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Why Choose TrustCred?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the most advanced digital credential platform with enterprise-grade security, 
            lightning-fast performance, and unmatched reliability.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group relative bg-card rounded-xl p-6 border border-border hover:border-transparent hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon Container */}
              <motion.div
                className={`relative w-12 h-12 bg-gradient-to-br ${feature.color} ${feature.hoverColor} rounded-lg flex items-center justify-center mb-4 transition-all duration-500`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-3 text-card-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Lines */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
