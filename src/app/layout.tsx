import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dark Forest Tarot — The Sacred Oracle & Grimoire',
  description:
    'A vintage occult tarot reading sanctuary and 78-card Rider-Waite-Smith grimoire based on the Dark Forest complete guide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Spectral:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="occult-bg-pattern min-h-screen antialiased flex flex-col font-serif selection:bg-occult-gold/30 selection:text-occult-gold-light">
        {children}
      </body>
    </html>
  );
}
