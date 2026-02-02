'use client';

import { useState, useRef, useEffect } from 'react';

interface EnquiryFormProps {
  animalName: string;
}

export default function EnquiryForm({ animalName }: EnquiryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setStatus('idle');
      setError('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone && !email) {
      setError('Please provide either a phone number or email address.');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalName,
          phone,
          email,
          message,
        }),
      });

      if (response.ok) {
        setStatus('sent');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button className="btn btn-primary enquiry-btn" onClick={handleOpen}>
        Enquire about {animalName}
      </button>
    );
  }

  if (status === 'sent') {
    return (
      <div ref={formRef} className={`enquiry-form-container ${isClosing ? 'closing' : ''}`}>
        <div className="enquiry-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>Thank you, we will get back to you shortly!</p>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className={`enquiry-form-container ${isClosing ? 'closing' : ''}`}>
      <form className="enquiry-form" onSubmit={handleSubmit}>
        <h3>Enquire about {animalName}</h3>
        <p className="enquiry-form-note">Please provide a phone number or email so we can get back to you.</p>

        {error && <div className="enquiry-error">{error}</div>}

        <div className="enquiry-form-row">
          <div className="enquiry-form-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
            />
          </div>
          <div className="enquiry-form-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
            />
          </div>
        </div>

        <div className="enquiry-form-field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="Tell us about yourself and why you're interested..."
            rows={5}
            required
          />
          <span className="char-count">{message.length}/500</span>
        </div>

        <div className="enquiry-form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
