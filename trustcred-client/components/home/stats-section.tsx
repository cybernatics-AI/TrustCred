"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Shield, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10M+",
    label: "Verified Credentials",
    description: "Digital credentials secured on our platform",
    color: "from-trust-blue-500 to-trust-blue-600"
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Security Uptime",
    description: "Enterprise-grade reliability and protection",
    color: "from-security-green-500 to-security-green-600"
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries Served",
    description: "Global reach with local compliance",
    color: "from-lemon-lime-500 to-lemon-lime-600"
  },
  {
    icon: TrendingUp,
    value: "2.3s",
    label: "Average Verification",
    description: "Lightning-fast credential processing",
    color: "from-professional-gray-500 to-professional-gray-600"
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

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-card to-card/50 border-y border-border">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of organizations worldwide who trust TrustCred for their digital credential needs.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative bg-background rounded-2xl p-8 border border-border hover:border-transparent hover:shadow-xl transition-all duration-500 text-center overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <motion.div
                className={`relative inline-flex w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl items-center justify-center mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Value */}
              <motion.div
                className="relative mb-2"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-foreground">
                  {stat.value}
                </div>
              </motion.div>

              {/* Label */}
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground group-hover:text-card-foreground/80 transition-colors duration-300">
                {stat.description}
              </p>

              {/* Pulse Effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 rounded-2xl`}
                animate={{
                  opacity: [0, 0.1, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
