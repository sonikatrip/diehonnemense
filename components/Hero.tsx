import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-background"></div>
      <div className="hero-content">
        <Image src="/images/logo/square-logo.png" alt="Diehonnemense Logo" className="hero-logo" width={150} height={150} priority />
        <h1 className="hero-title">Diehonnemense</h1>
        <p className="hero-tagline">Giving hope to animals in need</p>
        <p className="hero-subtitle">Rescuing, rehabilitating, and rehoming animals in the Western Cape, South Africa</p>
        <div className="hero-cta">
          <a href="#animals" className="btn btn-primary">Adopt a Rescue</a>
          <a href="#donations" className="btn btn-secondary">Donate</a>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}
