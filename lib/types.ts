export interface Animal {
  slug: string;
  name: string;
  breed: string;
  rescueDate: string;
  rescuedFrom: string;
  status: 'available' | 'adopted' | 'foster';
  sensitive: boolean;
  urgent: boolean;
  urgentNeed: string;
  urgentReason: string;
  story: string;
  currentSituation: string;
  images: string[];
}

export interface GratitudeEntry {
  slug: string;
  name: string;
  date: string;
  type: string;
  description: string;
  image: string | null;
}

export interface Outreach {
  slug: string;
  title: string;
  icon: string;
  statNumber: string;
  statLabel: string;
  description: string;
  images: string[];
}

export interface Manifest {
  animals?: string[];
  entries?: string[];
  outreaches?: string[];
}
