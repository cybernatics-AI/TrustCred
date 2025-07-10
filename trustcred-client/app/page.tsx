import { trustCredTheme } from "../lib/theme";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero animate-gradient"></div>
        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            TrustCred
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Secure, verifiable digital credentials powered by blockchain technology. 
            Build trust in the digital world with our comprehensive credential management platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-gradient">Get Started</button>
            <button className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
            Trusted by Organizations Worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature Cards */}
            <div className="card p-8 hover:shadow-trust transition-all duration-300">
              <div className="w-12 h-12 bg-trust-blue-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-trust-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Secure Verification</h3>
              <p className="text-muted-foreground">
                Cryptographically secure credential verification using blockchain technology
                for tamper-proof authentication.
              </p>
            </div>
            
            <div className="card p-8 hover:shadow-trust transition-all duration-300">
              <div className="w-12 h-12 bg-security-green-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-security-green-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Instant Issuance</h3>
              <p className="text-muted-foreground">
                Issue digital credentials instantly with our streamlined workflow
                and automated verification processes.
              </p>
            </div>
            
            <div className="card p-8 hover:shadow-trust transition-all duration-300">
              <div className="w-12 h-12 bg-warning-amber-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-warning-amber-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Global Standards</h3>
              <p className="text-muted-foreground">
                Built on open standards and interoperable with existing credential
                management systems worldwide.
              </p>
            </div>
          </div>

          {/* Status Indicators Demo */}
          <div className="bg-card rounded-xl p-8 border border-border">
            <h3 className="text-2xl font-semibold mb-8 text-card-foreground">Credential Status Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-card-foreground">Verified Credential</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-card-foreground">Bachelor&apos;s Degree</span>
                    <span className="status-verified">Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground">University of Excellence</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-card-foreground">Pending Verification</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-card-foreground">Professional Certificate</span>
                    <span className="status-pending">Pending</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tech Institute</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-card-foreground">Revoked Credential</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-card-foreground">Expired License</span>
                    <span className="status-revoked">Revoked</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Licensing Board</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-card-foreground">Action Buttons</h4>
                <div className="space-y-2">
                  <button className="btn-primary w-full text-sm">Issue Credential</button>
                  <button className="btn-accent w-full text-sm">Verify Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
            TrustCred Design System
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trust Blue Palette */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Trust Blue</h3>
              <div className="space-y-2">
                {Object.entries(trustCredTheme.colors.trustBlue).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Green Palette */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Security Green</h3>
              <div className="space-y-2">
                {Object.entries(trustCredTheme.colors.securityGreen).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Gray Palette */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Professional Gray</h3>
              <div className="space-y-2">
                {Object.entries(trustCredTheme.colors.professionalGray).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient Examples */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-8 text-center text-foreground">Gradient Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="gradient-primary h-24 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Primary</span>
              </div>
              <div className="gradient-secondary h-24 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Secondary</span>
              </div>
              <div className="gradient-hero h-24 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Hero</span>
              </div>
              <div className="gradient-card h-24 rounded-lg flex items-center justify-center border border-border">
                <span className="text-foreground font-semibold">Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-professional-gray-900 text-professional-gray-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold gradient-hero bg-clip-text text-transparent mb-4">
              TrustCred
            </h3>
            <p className="text-professional-gray-400 max-w-md mx-auto">
              Building the future of digital credentials with security, trust, and innovation.
            </p>
          </div>
          <div className="border-t border-professional-gray-700 pt-8">
            <p className="text-professional-gray-500">
              © 2024 TrustCred. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
