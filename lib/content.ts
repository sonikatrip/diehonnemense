import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Animal, GratitudeEntry, Outreach, Manifest } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

// Parse markdown sections (## headers)
function parseSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    const title = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    sections[title] = match[2].trim();
  }

  return sections;
}

// Get all images for an animal/entry (1.jpg, 2.jpg, etc.)
function getImages(basePath: string, type: 'animals' | 'gratitude' | 'outreaches', slug: string): string[] {
  const images: string[] = [];

  let index = 1;
  const maxImages = 10;

  while (index <= maxImages) {
    const jpgPath = path.join(basePath, `${index}.jpg`);
    const jpegPath = path.join(basePath, `${index}.jpeg`);

    if (fs.existsSync(jpgPath)) {
      images.push(`/images/content/${type}/${slug}/${index}.jpg`);
    } else if (fs.existsSync(jpegPath)) {
      images.push(`/images/content/${type}/${slug}/${index}.jpeg`);
    } else {
      break;
    }
    index++;
  }

  return images;
}

// Load a single animal
function loadAnimal(slug: string): Animal | null {
  const basePath = path.join(contentDirectory, 'animals', slug);
  const filePath = path.join(basePath, 'animal.md');

  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const sections = parseSections(content);
    const images = getImages(basePath, 'animals', slug);

    return {
      slug,
      name: data.name || slug,
      breed: data.breed || '',
      rescueDate: data.rescue_date || '',
      rescuedFrom: data.rescued_from || '',
      status: data.status || 'available',
      sensitive: data.sensitive === true,
      urgent: data.urgent === true,
      urgentNeed: data.urgent_need || '',
      urgentReason: data.urgent_reason || '',
      story: sections.story || '',
      currentSituation: sections.current_situation || '',
      images,
    };
  } catch (error) {
    console.error(`Error loading animal ${slug}:`, error);
    return null;
  }
}

// Load all animals
export function loadAnimals(): Animal[] {
  try {
    const manifestPath = path.join(contentDirectory, 'animals', 'manifest.json');
    const manifestContents = fs.readFileSync(manifestPath, 'utf8');
    const manifest: Manifest = JSON.parse(manifestContents);

    const animals = (manifest.animals || [])
      .map((slug) => loadAnimal(slug))
      .filter((animal): animal is Animal => animal !== null);

    return animals;
  } catch (error) {
    console.error('Error loading animals:', error);
    return [];
  }
}

// Load a single gratitude entry
function loadGratitudeEntry(slug: string): GratitudeEntry | null {
  const basePath = path.join(contentDirectory, 'gratitude', slug);
  const filePath = path.join(basePath, 'entry.md');

  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const images = getImages(basePath, 'gratitude', slug);

    return {
      slug,
      name: data.name || slug,
      date: data.date || '',
      type: data.type || 'donation',
      description: content.trim(),
      image: images.length > 0 ? images[0] : null,
    };
  } catch (error) {
    console.error(`Error loading gratitude entry ${slug}:`, error);
    return null;
  }
}

// Load all gratitude entries
export function loadGratitude(): GratitudeEntry[] {
  try {
    const manifestPath = path.join(contentDirectory, 'gratitude', 'manifest.json');
    const manifestContents = fs.readFileSync(manifestPath, 'utf8');
    const manifest: Manifest = JSON.parse(manifestContents);

    const entries = (manifest.entries || [])
      .map((slug) => loadGratitudeEntry(slug))
      .filter((entry): entry is GratitudeEntry => entry !== null);

    return entries;
  } catch (error) {
    console.error('Error loading gratitude:', error);
    return [];
  }
}

// Load a single outreach
function loadOutreach(slug: string): Outreach | null {
  const basePath = path.join(contentDirectory, 'outreaches', slug);
  const filePath = path.join(basePath, 'outreach.md');

  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const images = getImages(basePath, 'outreaches', slug);

    return {
      slug,
      title: data.title || slug,
      icon: data.icon || 'heart',
      statNumber: data.stat_number || '',
      statLabel: data.stat_label || '',
      description: content.trim(),
      images,
    };
  } catch (error) {
    console.error(`Error loading outreach ${slug}:`, error);
    return null;
  }
}

// Load all outreaches
export function loadOutreaches(): Outreach[] {
  try {
    const manifestPath = path.join(contentDirectory, 'outreaches', 'manifest.json');
    const manifestContents = fs.readFileSync(manifestPath, 'utf8');
    const manifest: Manifest = JSON.parse(manifestContents);

    const outreaches = (manifest.outreaches || [])
      .map((slug) => loadOutreach(slug))
      .filter((outreach): outreach is Outreach => outreach !== null);

    return outreaches;
  } catch (error) {
    console.error('Error loading outreaches:', error);
    return [];
  }
}

// Helper function to format dates
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZA', options);
}

// Helper function to calculate months since a date
export function getMonthsSince(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}
