import { ContactFormClient, type ContactFormCopy } from '@/components/lp/contact/ContactFormClient';
import type { JSX } from 'react';

type Lang = 'ja' | 'en';

type SectionContactFormProps = {
  locale: Lang;
};

const CONTACT_COPY: Record<Lang, { heading: string; message: string; form: ContactFormCopy }> = {
  ja: {
    heading: 'お問い合わせ',
    message: 'プロジェクトのご相談は、こちらから。内容を確認のうえ、すぐにご連絡いたします。',
    form: {
      labelName: '名前',
      labelEmail: 'メールアドレス',
      labelMessage: 'メッセージ',
      placeholderName: 'お名前',
      placeholderEmail: 'your.email@example.com',
      placeholderMessage: 'プロジェクトの内容やご相談事項をご記入ください…',
      submit: 'メッセージを送信',
    },
  },
  en: {
    heading: 'Get in Touch',
    message: "Tell us about your project — we'll review it and get back to you shortly.",
    form: {
      labelName: 'Name',
      labelEmail: 'Email',
      labelMessage: 'Message',
      placeholderName: 'Your name',
      placeholderEmail: 'your.email@example.com',
      placeholderMessage: 'Tell us about your project…',
      submit: 'Send Message',
    },
  },
};

export function SectionContactForm({ locale }: SectionContactFormProps): JSX.Element {
  const copy = CONTACT_COPY[locale];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-10" id="contact">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter text-white md:text-4xl">
            {copy.heading}
          </h2>
          <p className="max-w-2xl text-sm text-white/70 md:text-base">{copy.message}</p>
        </div>

        <ContactFormClient copy={copy.form} />
      </div>
    </section>
  );
}
