'use client';

import dynamic from 'next/dynamic';
import type { JSX } from 'react';

const Toaster = dynamic(() => import('@/components/ui/sonner').then((mod) => mod.Toaster), {
  ssr: false,
});

export function ToasterClient(): JSX.Element {
  return <Toaster />;
}
