'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminLogoutButton(): JSX.Element {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm('ログアウトしますか？')) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('ログアウトに失敗しました');
      }

      toast.success('ログアウトしました');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('ログアウトに失敗しました');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-text-body"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
    </Button>
  );
}
