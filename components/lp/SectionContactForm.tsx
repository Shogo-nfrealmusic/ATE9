import { ContactFormClient } from '@/components/lp/contact/ContactFormClient';
import type { JSX } from 'react';

export function SectionContactForm(): JSX.Element {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10" id="contact">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter text-white md:text-4xl">
            Get in Touch
          </h2>
          <p className="max-w-2xl text-sm text-white/70 md:text-base">
            Have a project in mind? We&apos;d love to hear from you. Send us a message and
            we&apos;ll respond as soon as possible.
          </p>
        </div>

        <ContactFormClient />
      </div>
    </section>
  );
}
