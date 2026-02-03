'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, isLightboxOpen]);

  // Touch swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (images.length === 0) {
    return null;
  }

  const lightboxContent = isLightboxOpen && (
    <div className="lightbox" onClick={closeLightbox}>
      <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <Image src={images[currentIndex]} alt={`${alt} - Image ${currentIndex + 1}`} fill sizes="100vw" />

        {images.length > 1 && (
          <>
            <button
              className="lightbox-arrow lightbox-arrow-left"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              className="lightbox-arrow lightbox-arrow-right"
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="lightbox-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot${index === currentIndex ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goToIndex(index); }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const lightbox = typeof document !== 'undefined' && lightboxContent
    ? createPortal(lightboxContent, document.body)
    : null;

  if (images.length === 1) {
    return (
      <>
        <div className="image-carousel">
          <div className="carousel-image-container" onClick={openLightbox} style={{ cursor: 'pointer' }}>
            <Image src={images[0]} alt={alt} fill sizes="600px" />
          </div>
        </div>
        {lightbox}
      </>
    );
  }

  return (
    <>
      <div
        className="image-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="carousel-image-container" onClick={openLightbox} style={{ cursor: 'pointer' }}>
          <Image src={images[currentIndex]} alt={`${alt} - Image ${currentIndex + 1}`} fill sizes="600px" />

          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot${index === currentIndex ? ' active' : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {lightbox}
    </>
  );
}
