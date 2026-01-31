import Image from 'next/image';
import { GratitudeEntry } from '@/lib/types';

interface GratitudeSectionProps {
  entries: GratitudeEntry[];
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
}

export default function GratitudeSection({ entries }: GratitudeSectionProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="gratitude-section" id="gratitude">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Wall of Gratitude</h2>
          <p className="section-subtitle">Thank you to everyone who has helped our animals. Your kindness makes all the difference.</p>
        </div>
        <div className="gratitude-grid">
          {sortedEntries.map(entry => (
            <div key={entry.slug} className={`gratitude-card${!entry.image ? ' simple' : ''}`}>
              {entry.image ? (
                <>
                  <Image src={entry.image} alt={entry.name} className="gratitude-card-image" width={400} height={225} />
                  <div className="gratitude-card-content">
                    <h3 className="gratitude-card-name">{entry.name}</h3>
                    <p className="gratitude-card-date">{formatDate(entry.date)}</p>
                    <p className="gratitude-card-description">{entry.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="gratitude-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div className="gratitude-card-content">
                    <h3 className="gratitude-card-name">{entry.name}</h3>
                    <p className="gratitude-card-date">{formatDate(entry.date)}</p>
                    <p className="gratitude-card-description">{entry.description}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
