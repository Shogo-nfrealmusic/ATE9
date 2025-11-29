'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JSX } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<FormValues>;

const EMAIL_REGEX = /.+@.+\..+/;

export function ContactFormClient(): JSX.Element {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!values.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!EMAIL_REGEX.test(values.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!values.message.trim()) {
      newErrors.message = 'メッセージは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // クライアントバリデーション
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // 400 / 500 のときはここで例外にしてまとめて catch へ
        throw new Error(`Contact API request failed: ${response.status}`);
      }

      const data: { ok: boolean } = await response.json();

      if (!data.ok) {
        throw new Error('Contact API returned ok=false');
      }

      setValues({ name: '', email: '', message: '' });
      setErrors({});
      setStatus('success');

      // メインのトースト（ユーザー向け）
      toast.success('メッセージを送信しました。ありがとうございます。');

      // 数秒後に idle に戻す
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('送信に失敗しました。しばらく時間をおいて再度お試しください。');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // そのフィールドのエラーだけクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  };

  const getFieldClassName = (hasError: boolean): string =>
    [
      'bg-transparent text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
      hasError
        ? 'border-ate9-red/80 shadow-[0_0_0_1px_rgba(255,3,3,0.45)]'
        : 'border-ate9-gray/60 focus-visible:border-ate9-red',
    ].join(' ');

  const isSubmitting = status === 'submitting';

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
            value={values.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={getFieldClassName(!!errors.name)}
          />
          {errors.name && <p className="mt-1 text-xs text-ate9-red/80">{errors.name}</p>}
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
            value={values.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className={getFieldClassName(!!errors.email)}
          />
          {errors.email && <p className="mt-1 text-xs text-ate9-red/80">{errors.email}</p>}
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
          value={values.message}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={6}
          className={getFieldClassName(!!errors.message)}
        />
        {errors.message && <p className="mt-1 text-xs text-ate9-red/80">{errors.message}</p>}
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full bg-ate9-red text-white hover:bg-ate9-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <span className="truncate">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
        </Button>
      </div>
    </form>
  );
}
