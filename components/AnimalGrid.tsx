import { Animal } from '@/lib/types';
import AnimalCard from './AnimalCard';

interface AnimalGridProps {
  animals: Animal[];
}

export default function AnimalGrid({ animals }: AnimalGridProps) {
  const sortedAnimals = [...animals].sort((a, b) => {
    const statusOrder: Record<string, number> = { 'available': 0, 'foster': 1, 'adopted': 2 };
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
  });

  return (
    <section className="animals-section" id="animals">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Rescues Looking for Forever Homes</h2>
          <p className="section-subtitle">These animals have been given a second chance and are ready to find their loving families. Click on any photo to learn their story and how you can help.</p>
        </div>
        <div className="animal-grid">
          {sortedAnimals.map((animal, index) => (
            <div key={animal.slug} style={{ animationDelay: `${Math.min(index * 0.05, 0.65)}s` }}>
              <AnimalCard animal={animal} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
