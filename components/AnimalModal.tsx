'use client';

import Image from 'next/image';
import { useEffect, useCallback } from 'react';
import { Animal } from '@/lib/types';

interface AnimalModalProps {
  animal: Animal | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AnimalModal({ animal, isOpen, onClose }: AnimalModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!animal) return null;

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" aria-label="Close modal" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="modal-image-section">
            <div className="modal-image-container">
              {animal.images[0] && (
                <Image src={animal.images[0]} alt={animal.name} className="modal-image" fill sizes="450px" />
              )}
            </div>
          </div>
          <div className="modal-info">
            <h2 className="modal-animal-name">{animal.name}</h2>
            <div className="modal-meta">
              <span className="modal-breed">{animal.breed}</span>
              <span className="modal-rescue-date">Rescued: {formatDate(animal.rescueDate)}</span>
            </div>
            <div className="modal-story">
              <h3>Their Story</h3>
              <p>{animal.story}</p>
            </div>
            <div className="modal-situation">
              <h3>Current Situation</h3>
              <p>{animal.currentSituation}</p>
            </div>
            <div className="modal-cta">
              <h3>Help {animal.name}</h3>
              <p>Your donation directly supports this animal&apos;s care, food, and medical needs.</p>
              <Image src="/images/logo/donation-bank-account.png" alt="Donation Bank Details" className="modal-bank-details" width={300} height={150} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
