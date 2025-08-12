import type { Metadata } from "next";
import { Playfair_Display, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustCred - Secure Digital Credentials",
  description: "Building the future of digital credentials with security, trust, and innovation. Empowering organizations to issue and verify credentials with confidence.",
  icons: {
    icon: '/Trustcred.jpg',
    apple: '/Trustcred.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="trustcred-ui-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-30">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
