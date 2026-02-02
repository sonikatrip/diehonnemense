import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diehonnemense | Giving Hope to Animals in Need',
  description: 'Diehonnemense - Animal welfare organization in the Western Cape, South Africa. Rescuing and caring for animals in need.',
  icons: {
    icon: '/images/logo/square-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="watermark" aria-hidden="true"></div>
        {children}
      </body>
    </html>
  );
}
