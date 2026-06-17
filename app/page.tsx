import { 
  Navbar,
  Hero,
  DashboardPreview,
  Features,
  HowItWorks,
  FAQ,
  CTA,
  Footer, 
  Roadmap
} from "@/components/sellora";

export default function SelloraLandingPage() {
  return (
    <main className="bg-dark min-h-screen font-sans antialiased">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <hr className="border-none border-t border-white/8" />
      <Features />
      <hr className="border-none border-t border-white/8" />
      <HowItWorks />
      <hr className="border-none border-t border-white/8" />
      <Roadmap />
      <hr className="border-none border-t border-white/8" />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
