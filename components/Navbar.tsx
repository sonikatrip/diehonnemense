'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.querySelector(target);
    if (element) {
      const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#hero" className="nav-logo" onClick={(e) => handleNavClick(e, '#hero')}>
          <Image src="/images/logo/square-logo.png" alt="Diehonnemense Logo" width={40} height={40} />
          <span>Diehonnemense</span>
        </a>
        <button className={`nav-toggle ${menuOpen ? 'active' : ''}`} aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="hamburger"></span>
        </button>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li><a href="#hero" className="nav-link" onClick={(e) => handleNavClick(e, '#hero')}>Home</a></li>
          <li><a href="#animals" className="nav-link" onClick={(e) => handleNavClick(e, '#animals')}>Adopt</a></li>
          <li><a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>Who We Are</a></li>
          <li><a href="#outreaches" className="nav-link" onClick={(e) => handleNavClick(e, '#outreaches')}>Outreaches</a></li>
          <li><a href="#donations" className="nav-link" onClick={(e) => handleNavClick(e, '#donations')}>Donate</a></li>
          <li><a href="#gratitude" className="nav-link" onClick={(e) => handleNavClick(e, '#gratitude')}>Thank You</a></li>
        </ul>
      </div>
    </nav>
  );
}
