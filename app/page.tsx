import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import CoolingSection from '@/components/CoolingSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <CoolingSection />
      <ContactSection />
    </main>
  );
}
