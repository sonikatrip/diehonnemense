import { loadAnimals, loadGratitude, loadOutreaches } from '@/lib/content';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UrgentSection from '@/components/UrgentSection';
import AnimalGrid from '@/components/AnimalGrid';
import AboutSection from '@/components/AboutSection';
import OutreachSection from '@/components/OutreachSection';
import DonationSection from '@/components/DonationSection';
import GratitudeSection from '@/components/GratitudeSection';
import Footer from '@/components/Footer';

export default function Home() {
  const animals = loadAnimals();
  const gratitude = loadGratitude();
  const outreaches = loadOutreaches();

  return (
    <>
      <Navbar />
      <Hero />
      <UrgentSection animals={animals} />
      <AnimalGrid animals={animals} />
      <AboutSection />
      <OutreachSection outreaches={outreaches} />
      <DonationSection />
      <GratitudeSection entries={gratitude} />
      <Footer />
    </>
  );
}
