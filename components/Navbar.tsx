'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    setMenuOpen(false);

    // If on home page, do smooth scroll
    if (isHomePage) {
      e.preventDefault();
      const element = document.querySelector(target);
      if (element) {
        const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
      }
    }
    // If not on home page, let the link navigate to /#section
  };

  const getHref = (target: string) => {
    return isHomePage ? target : `/${target}`;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <Image src="/images/logo/square-logo.png" alt="Diehonnemense Logo" width={80} height={80} />
          <div className="nav-logo-text">
            <span className="nav-logo-title">Diehonnemense</span>
            <span className="nav-logo-desc">Giving hope to animals in need</span>
          </div>
        </Link>
        <button className={`nav-toggle ${menuOpen ? 'active' : ''}`} aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="hamburger"></span>
        </button>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li><Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><a href={getHref('#animals')} className="nav-link nav-btn nav-btn-adopt" onClick={(e) => handleNavClick(e, '#animals')}>Adopt</a></li>
          <li><a href={getHref('#donations')} className="nav-link nav-btn nav-btn-donate" onClick={(e) => handleNavClick(e, '#donations')}>Donate</a></li>
          <li><a href={getHref('#about')} className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>Who We Are</a></li>
          <li><a href={getHref('#gratitude')} className="nav-link" onClick={(e) => handleNavClick(e, '#gratitude')}>Thank You</a></li>
        </ul>
      </div>
    </nav>
  );
}
