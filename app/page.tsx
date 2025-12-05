import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import TransitionSection from '@/components/TransitionSection';
import AboutSection from '@/components/AboutSection';
import HorizontalScrollBridge from '@/components/HorizontalScrollBridge';
import ExperienceSection from '@/components/ExperienceSection';
import CoolingSection from '@/components/CoolingSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <TransitionSection />
      <AboutSection />
      <HorizontalScrollBridge />
      <ExperienceSection />
      <CoolingSection />
      <ContactSection />
    </main>
  );
}
