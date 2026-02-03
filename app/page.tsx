import { loadAnimals } from '@/lib/content';
import { loadBankDetails } from '@/lib/bankDetails';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UrgentSection from '@/components/UrgentSection';
import AnimalGrid from '@/components/AnimalGrid';
import AboutSection from '@/components/AboutSection';
import DonationSection from '@/components/DonationSection';
// import GratitudeSection from '@/components/GratitudeSection';
import Footer from '@/components/Footer';

export default function Home() {
  const animals = loadAnimals();
  // const gratitude = loadGratitude();
  const bankDetails = loadBankDetails();

  return (
    <>
      <Navbar />
      <Hero />
      <UrgentSection animals={animals} />
      <AnimalGrid animals={animals} />
      <DonationSection bankDetails={bankDetails} />
      {/* <GratitudeSection entries={gratitude} /> */}
      <AboutSection />
      <Footer />
    </>
  );
}
