import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-image-wrapper">
            <Image src="/images/logo/bianka.jpeg" alt="Bianka Lerm - Founder of Diehonnemense" className="about-image" width={400} height={400} />
            <div className="about-image-frame"></div>
          </div>
          <div className="about-text">
            <h2 className="section-title">Who We Are</h2>
            <p className="about-subtitle">Meet Bianka Lerm - The Heart Behind Diehonnemense</p>
            <div className="about-story">
              <p>What started as one rescue has grown into a lifelong mission. Bianka Lerm founded Diehonnemense with a simple belief: every animal deserves compassion, care, and a chance at a better life.</p>
              <p>Operating from the Western Cape, South Africa, Bianka has dedicated herself to rescuing animals from dire situations, nursing them back to health, and finding them loving forever homes. Her home has become a sanctuary where the forgotten find hope.</p>
              <p>With 12 dogs of her own (11 of which are &quot;foster fails&quot; she couldn&apos;t bear to part with), Bianka knows firsthand how these animals can transform your life just as much as you transform theirs.</p>
            </div>
            <blockquote className="about-quote">
              &quot;Every animal that crosses my path deserves a fighting chance. They don&apos;t have a voice, so I&apos;ll be their voice.&quot;
              <cite>- Bianka Lerm</cite>
            </blockquote>
            <div className="about-stats">
              <div className="stat"><span className="stat-number">12</span><span className="stat-label">Personal Dogs</span></div>
              <div className="stat"><span className="stat-number">11</span><span className="stat-label">Foster Fails</span></div>
              <div className="stat"><span className="stat-number">100+</span><span className="stat-label">Animals Rescued</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
