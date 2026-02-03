import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadGratitude, loadGratitudeEntry } from '@/lib/content';
import ImageCarousel from '@/components/ImageCarousel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface GratitudePageProps {
  params: { slug: string };
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    donation: 'Donation',
    volunteer: 'Volunteer',
    foster: 'Foster',
    adoption: 'Adoption',
    sponsor: 'Sponsor',
    supplies: 'Supplies',
  };
  return labels[type] || type;
}

export default function GratitudePage({ params }: GratitudePageProps) {
  const entry = loadGratitudeEntry(params.slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="gratitude-page">
        <div className="container">
          <Link href="/#gratitude" className="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </Link>

          <div className="gratitude-page-content">
            {entry.images.length > 0 && (
              <div className="gratitude-page-images">
                <ImageCarousel images={entry.images} alt={entry.name} />
              </div>
            )}

            <div className="gratitude-page-info">
              <h1 className="gratitude-page-name">{entry.name}</h1>
              <div className="gratitude-page-meta">
                <span className="gratitude-page-type">{getTypeLabel(entry.type)}</span>
                <span className="gratitude-page-date">{formatDate(entry.date)}</span>
              </div>

              <div className="gratitude-page-description">
                <p>{entry.description}</p>
              </div>

              <div className="gratitude-page-thanks">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p>Thank you for your support!</p>
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
  const entries = loadGratitude();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}
