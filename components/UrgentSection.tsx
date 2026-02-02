'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Animal } from '@/lib/types';

interface UrgentSectionProps {
  animals: Animal[];
}

export default function UrgentSection({ animals }: UrgentSectionProps) {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  const urgentAnimals = animals.filter(a => a.urgent);

  if (urgentAnimals.length === 0) return null;

  const handleSensitiveClick = (e: React.MouseEvent, animal: Animal) => {
    if (animal.sensitive && !revealedCards.has(animal.slug)) {
      e.preventDefault();
      setRevealedCards(prev => new Set(prev).add(animal.slug));
    }
  };

  return (
    <section className="urgent-section" id="urgent">
      <div className="container">
        <div className="section-header">
          <span className="urgent-badge">Urgent Plea</span>
          <h2 className="section-title">They Need Your Help Now</h2>
          <p className="section-subtitle">These animals are in critical need of medical care, food, or shelter. Your support can save their lives.</p>
        </div>
        <div className="urgent-grid">
          {urgentAnimals.map(animal => (
            <Link
              href={`/animal/${animal.slug}`}
              key={animal.slug}
              className={`urgent-card${animal.sensitive ? ' sensitive' : ''}${revealedCards.has(animal.slug) ? ' revealed' : ''}`}
              onClick={(e) => handleSensitiveClick(e, animal)}
            >
              {animal.images[0] && (
                <Image src={animal.images[0]} alt={animal.name} className="urgent-card-image" width={400} height={300} />
              )}
              {animal.sensitive && !revealedCards.has(animal.slug) && (
                <div className="sensitive-overlay">
                  <div className="sensitive-overlay-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <span className="sensitive-overlay-text">Sensitive Content</span>
                  <span className="sensitive-overlay-hint">Click to reveal</span>
                </div>
              )}
              <div className="urgent-card-content">
                <h3 className="urgent-card-name">{animal.name}</h3>
                <span className="urgent-card-need">{animal.urgentNeed}</span>
                <p className="urgent-card-story">{animal.urgentReason}</p>
                <span className="urgent-card-cta">
                  Help {animal.name}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
