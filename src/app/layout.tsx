import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'EduPortal - Platform Media Pembelajaran & Jejaring Sosial Pendidikan',
  description: 'Portal pembelajaran interaktif berbasis web modern dengan E-Modul, Media Ajar, LKM, Asesmen Kuis CBT, dan Forum Jejaring Sosial.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
