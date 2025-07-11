import { trustCredTheme } from "../lib/theme";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Enhanced Green/Lemon Gradient */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-lemon-lime-400 via-security-green-400 to-security-green-600 animate-gradient opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-lemon-lime-300 rounded-full animate-pulse mr-2"></div>
            Building sustainable digital credentials
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 animate-fade-in bg-gradient-to-r from-white via-white to-lemon-lime-100 bg-clip-text text-transparent">
            TrustCred
          </h1>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Secure, verifiable digital credentials powered by blockchain technology. 
            Build trust in the digital world with our comprehensive credential management platform 
            featuring cutting-edge green technology and sustainable solutions.
          </p>
          <div className="flex gap-6 justify-center flex-wrap animate-scale-in">
            <button className="px-8 py-4 bg-gradient-to-r from-white to-lemon-lime-50 text-security-green-700 font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group">
              <span className="flex items-center">
                Get Started
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <button className="px-8 py-4 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-md transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-lemon-lime-300/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-security-green-300/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            Trusted by Organizations Worldwide
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Experience the future of digital credentials with our eco-friendly, secure platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature Cards */}
            <div className="group card p-8 hover:shadow-trust transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-lemon rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-lemon-lime-600 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Eco-Secure Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cryptographically secure credential verification using sustainable blockchain technology
                for tamper-proof authentication with minimal environmental impact.
              </p>
            </div>
            
            <div className="group card p-8 hover:shadow-trust transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-green-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-security-green-600 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Lightning Fast Issuance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Issue digital credentials instantly with our streamlined, carbon-neutral workflow
                and automated verification processes powered by renewable energy.
              </p>
            </div>
            
            <div className="group card p-8 hover:shadow-trust transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-hero-light rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-trust-blue-600 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Global Green Standards</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on open standards and interoperable with existing credential
                management systems worldwide, promoting sustainable digital practices.
              </p>
            </div>
          </div>

          {/* Enhanced Status Indicators Demo */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <h3 className="text-3xl font-semibold mb-8 text-card-foreground text-center">Credential Status Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground text-lg">✅ Verified Credential</h4>
                <div className="p-6 bg-gradient-green-white rounded-xl border border-security-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-card-foreground">Bachelor&apos;s Degree</span>
                    <span className="status-verified text-xs font-bold">Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground">University of Excellence</p>
                  <div className="mt-3 flex items-center text-xs text-security-green-600">
                    <div className="w-2 h-2 bg-security-green-500 rounded-full mr-2 animate-pulse"></div>
                    Carbon Neutral
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground text-lg">⏳ Pending Verification</h4>
                <div className="p-6 bg-muted rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-card-foreground">Professional Certificate</span>
                    <span className="status-pending text-xs font-bold">Pending</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tech Institute</p>
                  <div className="mt-3 flex items-center text-xs text-warning-amber-600">
                    <div className="w-2 h-2 bg-warning-amber-500 rounded-full mr-2 animate-pulse"></div>
                    Processing...
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground text-lg">❌ Revoked Credential</h4>
                <div className="p-6 bg-muted rounded-xl border border-border opacity-60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-card-foreground">Expired License</span>
                    <span className="status-revoked text-xs font-bold">Revoked</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Licensing Board</p>
                  <div className="mt-3 flex items-center text-xs text-danger-red-600">
                    <div className="w-2 h-2 bg-danger-red-500 rounded-full mr-2"></div>
                    Invalid
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-card-foreground text-lg">🚀 Quick Actions</h4>
                <div className="space-y-3">
                  <button className="btn-primary w-full text-sm py-3 bg-gradient-accent hover:bg-gradient-accent-dark transition-all duration-300 transform hover:scale-105">
                    Issue New Credential
                  </button>
                  <button className="btn-accent w-full text-sm py-3 bg-gradient-lemon hover:bg-gradient-lemon-dark transition-all duration-300 transform hover:scale-105">
                    Verify Credential
                  </button>
                  <button className="w-full text-sm py-3 border border-border rounded-lg hover:bg-muted transition-all duration-300 text-muted-foreground hover:text-foreground">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Color Palette Preview */}
      <section className="py-24 bg-gradient-hero-light">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            TrustCred Design System
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Our sustainable color palette and eco-friendly design principles
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Trust Blue Palette */}
            <div className="card p-6 backdrop-blur-sm bg-white/10">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Trust Blue</h3>
              <div className="space-y-3">
                {Object.entries(trustCredTheme.colors.trustBlue).slice(0, 5).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Green Palette */}
            <div className="card p-6 backdrop-blur-sm bg-white/10">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Security Green</h3>
              <div className="space-y-3">
                {Object.entries(trustCredTheme.colors.securityGreen).slice(0, 5).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lemon-Lime Palette */}
            <div className="card p-6 backdrop-blur-sm bg-white/10">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Lemon-Lime</h3>
              <div className="space-y-3">
                {Object.entries(trustCredTheme.colors.lemonLime).slice(0, 5).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Gray Palette */}
            <div className="card p-6 backdrop-blur-sm bg-white/10">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Professional Gray</h3>
              <div className="space-y-3">
                {Object.entries(trustCredTheme.colors.professionalGray).slice(0, 5).map(([shade, color]) => (
                  <div key={shade} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-mono text-muted-foreground">{shade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Gradient Examples */}
          <div className="mt-16">
            <h3 className="text-3xl font-semibold mb-8 text-center text-foreground">Sustainable Gradient Collection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-lemon h-32 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <span className="text-white font-bold text-lg">Eco Lemon</span>
              </div>
              <div className="bg-gradient-green-white h-32 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <span className="text-security-green-800 font-bold text-lg">Green Earth</span>
              </div>
              <div className="bg-gradient-lime-to-blue h-32 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <span className="text-white font-bold text-lg">Ocean Lime</span>
              </div>
              <div className="bg-gradient-hero-light h-32 rounded-2xl flex items-center justify-center border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <span className="text-foreground font-bold text-lg">Pure Light</span>
              </div>
            </div>
          </div>

          {/* Sustainability Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/20 backdrop-blur-sm">
              <div className="text-3xl font-bold text-security-green-600 mb-2">99.9%</div>
              <div className="text-muted-foreground">Carbon Reduction</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/20 backdrop-blur-sm">
              <div className="text-3xl font-bold text-lemon-lime-600 mb-2">100%</div>
              <div className="text-muted-foreground">Renewable Energy</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/20 backdrop-blur-sm">
              <div className="text-3xl font-bold text-trust-blue-600 mb-2">1M+</div>
              <div className="text-muted-foreground">Green Credentials</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
