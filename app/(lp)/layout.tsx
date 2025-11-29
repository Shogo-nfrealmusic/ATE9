import { ToasterClient } from '@/components/ui/ToasterClient';
import type { Metadata } from 'next';
import type { JSX } from 'react';
import '../globals.css';

export const metadata: Metadata = {
  title: 'ATE9 - Elevating Experiences, One Design at a Time',
  description:
    'ATE9 crafts intuitive and impactful digital solutions that resonate with users and drive business growth.',
};

export default function LPLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <div className="relative w-full overflow-x-hidden bg-background-light font-display text-text-body">
      {children}
      <ToasterClient />
    </div>
  );
}
