import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Admin 認証状態をチェック
 * @returns 認証済みの場合は true、未認証の場合は false
 */
export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-authenticated');
  return authCookie?.value === 'true';
}

/**
 * Admin 認証が必要なページで使用
 * 未認証の場合は /admin/login にリダイレクト
 */
export async function requireAdminAuth(): Promise<void> {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }
}
