import { Outreach } from '@/lib/types';

interface OutreachSectionProps {
  outreaches: Outreach[];
}

function getOutreachIcon(iconName: string) {
  const icons: Record<string, JSX.Element> = {
    layers: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  };
  return icons[iconName] || icons.heart;
}

export default function OutreachSection({ outreaches }: OutreachSectionProps) {
  return (
    <section className="outreaches-section" id="outreaches">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Community Outreaches</h2>
          <p className="section-subtitle">Making a difference in communities across the Western Cape</p>
        </div>
        <div className="outreach-grid">
          {outreaches.map(outreach => (
            <div key={outreach.slug} className="outreach-card">
              <div className="outreach-icon">{getOutreachIcon(outreach.icon)}</div>
              <h3>{outreach.title}</h3>
              <p>{outreach.description}</p>
              <span className="outreach-stat">{outreach.statNumber} {outreach.statLabel}</span>
            </div>
          ))}
        </div>
        <div className="outreach-cta">
          <p>Want to get involved in our next outreach?</p>
          <a href="#donations" className="btn btn-primary">Support Our Work</a>
        </div>
      </div>
    </section>
  );
}
