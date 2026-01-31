'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Animal } from '@/lib/types';

interface AnimalCardProps {
  animal: Animal;
  onOpenModal: (animal: Animal) => void;
}

function getMonthsSince(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}

export default function AnimalCard({ animal, onOpenModal }: AnimalCardProps) {
  const [revealed, setRevealed] = useState(false);
  
  const monthsAgo = getMonthsSince(animal.rescueDate);
  const timeText = monthsAgo === 0 ? 'Recently rescued' :
                   monthsAgo === 1 ? 'Rescued 1 month ago' :
                   `Rescued ${monthsAgo} months ago`;

  const statusClass = animal.status === 'adopted' ? 'adopted' : animal.status === 'foster' ? 'foster' : '';
  const statusText = animal.status === 'adopted' ? 'Found a Forever Home' :
                     animal.status === 'foster' ? 'In Loving Foster Care' : '';
  const hasStatus = animal.status === 'adopted' || animal.status === 'foster';

  const handleClick = () => {
    if (animal.sensitive && !revealed) {
      setRevealed(true);
    } else {
      onOpenModal(animal);
    }
  };

  return (
    <div 
      className={`animal-card${hasStatus ? ' has-status' : ''}${animal.sensitive ? ' sensitive' : ''}${revealed ? ' revealed' : ''}`}
      onClick={handleClick}
    >
      {animal.images[0] && (
        <Image src={animal.images[0]} alt={animal.name} className="animal-card-image" fill sizes="(max-width: 768px) 100vw, 280px" />
      )}
      {animal.sensitive && !revealed && (
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
      <div className="animal-card-overlay">
        <h3 className="animal-card-name">{animal.name}</h3>
        <p className="animal-card-meta">{timeText}</p>
      </div>
      {statusText && <span className={`animal-card-status ${statusClass}`}>{statusText}</span>}
    </div>
  );
}
