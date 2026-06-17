import { Navbar } from "@/components/sellora";
import { Hero } from "@/components/sellora";
import { TrustStrip } from "@/components/sellora";
import { DashboardPreview } from "@/components/sellora";
import { Features } from "@/components/sellora";
import { HowItWorks } from "@/components/sellora";
import { Testimonials } from "@/components/sellora";
import { CTA } from "@/components/sellora";
import { Footer } from "@/components/sellora";

export default function SelloraLandingPage() {
  return (
    <main className="bg-dark min-h-screen font-sans antialiased">
      <Navbar />
      <Hero />
      <TrustStrip />
      <DashboardPreview />
      <hr className="border-none border-t border-white/8" />
      <Features />
      <hr className="border-none border-t border-white/8" />
      <HowItWorks />
      <hr className="border-none border-t border-white/8" />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
