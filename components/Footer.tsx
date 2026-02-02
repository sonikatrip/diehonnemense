'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:diehonnemense@gmail.com?subject=Subscriber : ${encodeURIComponent(email)}`;
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/images/logo/square-logo.png" alt="Diehonnemense Logo" className="footer-logo" width={60} height={60} />
            <p>Giving hope to animals in need since 2018. Based in the Western Cape, South Africa.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#animals">Adopt</a></li>
              <li><a href="#about">Who We Are</a></li>
              <li><a href="#donations">Donate</a></li>
              <li><a href="#gratitude">Thank You</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>Western Cape, South Africa</li>
              <li>Email: diehonnemense@gmail.com</li>
            </ul>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get updates on our rescues and how you can help.</p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input type="email" placeholder="Your email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Diehonnemense. All rights reserved.</p>
          <p>Made with love for animals in need.</p>
        </div>
      </div>
    </footer>
  );
}
