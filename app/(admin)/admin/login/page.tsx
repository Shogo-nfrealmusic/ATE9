'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminLoginPage(): JSX.Element {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  // 既に認証済みの場合は dashboard にリダイレクト
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
        });
        if (response.ok) {
          router.push('/admin/dashboard');
          router.refresh();
        }
      } catch (error) {
        console.error('[AdminLoginPage] auth check failed', error);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '認証に失敗しました');
      }

      toast.success('認証に成功しました');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : '認証に失敗しました');
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ate9-bg px-4">
        <div className="text-center text-white">
          <p className="text-sm text-white/70">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ate9-bg px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-ate9-gray/40 bg-ate9-gray/20 p-8 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ate9-red/20">
            <svg
              className="h-6 w-6 text-ate9-red"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">ATE9 Admin</h1>
          <p className="mt-2 text-sm text-white/70">パスワードを入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="パスワードを入力"
              className="bg-black/40 text-white placeholder:text-white/40 focus-visible:border-ate9-red focus-visible:ring-ate9-red"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full bg-ate9-red text-white hover:bg-ate9-red-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '認証中...' : 'ログイン'}
          </Button>
        </form>
      </div>
    </div>
  );
}
