import { HeroSection } from "../components/home/hero-section";
import { FeaturesGrid } from "../components/home/features-grid";
import { StatsSection } from "../components/home/stats-section";
import { ProductShowcase } from "../components/home/product-showcase";
import { TestimonialsSection } from "../components/home/testimonials-section";
import { CTASection } from "../components/home/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Hero Section */}
      <HeroSection />

      {/* Animated Features Grid */}
      <FeaturesGrid />

      {/* Interactive Product Showcase */}
      <ProductShowcase />

      {/* Animated Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call-to-Action Section */}
      <CTASection />
    </div>
  );
}
