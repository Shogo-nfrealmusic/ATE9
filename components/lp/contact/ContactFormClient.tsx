'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JSX } from 'react';
import { useState } from 'react';

export function ContactFormClient(): JSX.Element {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      message: !formData.message.trim(),
    };

    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      return;
    }

    // TODO: Integrate with backend endpoint or server action.
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const getFieldClassName = (hasError: boolean): string =>
    [
      'bg-transparent text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
      hasError
        ? 'border-ate9-red/80 shadow-[0_0_0_1px_rgba(242,66,109,0.45)]'
        : 'border-ate9-gray/60 focus-visible:border-ate9-red',
    ].join(' ');

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60"
          >
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            className={getFieldClassName(errors.name)}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className={getFieldClassName(errors.email)}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className={getFieldClassName(errors.message)}
        />
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          type="submit"
          className="w-full bg-ate9-red text-white hover:bg-ate9-red-dark sm:w-auto"
        >
          <span className="truncate">Send Message</span>
        </Button>
      </div>
    </form>
  );
}
