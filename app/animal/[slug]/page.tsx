import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadAnimals } from '@/lib/content';
import { loadBankDetails } from '@/lib/bankDetails';
import BankDetails from '@/components/BankDetails';
import EnquiryForm from '@/components/EnquiryForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AnimalPageProps {
  params: { slug: string };
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AnimalPage({ params }: AnimalPageProps) {
  const animals = loadAnimals();
  const animal = animals.find(a => a.slug === params.slug);
  const bankDetails = loadBankDetails();

  if (!animal) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="animal-page">
        <div className="container">
          <Link href="/#animals" className="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Animals
          </Link>

          <div className="animal-page-content">
            <div className="animal-page-left">
              <div className="animal-page-image">
                {animal.images[0] && (
                  <Image src={animal.images[0]} alt={animal.name} fill sizes="500px" />
                )}
              </div>

              <div className="animal-page-enquiry">
                <EnquiryForm animalName={animal.name} />
              </div>

              <div className="animal-page-cta">
                <h2>Help {animal.name}</h2>
                <p>Your donation directly supports this animal&apos;s care, food, and medical needs.</p>
                <BankDetails bankDetails={bankDetails} reference={animal.name} />
              </div>
            </div>

            <div className="animal-page-right">
              <h1 className="animal-page-name">{animal.name}</h1>
              <div className="animal-page-meta">
                <span className="animal-page-breed">{animal.breed}</span>
                <span className="animal-page-rescue-date">Rescued: {formatDate(animal.rescueDate)}</span>
              </div>

              <div className="animal-page-story">
                <h2>Their Story</h2>
                <p>{animal.story}</p>
              </div>

              <div className="animal-page-situation">
                <h2>Current Situation</h2>
                <p>{animal.currentSituation}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  const animals = loadAnimals();
  return animals.map((animal) => ({
    slug: animal.slug,
  }));
}
