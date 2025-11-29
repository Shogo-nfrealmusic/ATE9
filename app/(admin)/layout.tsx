import type { Metadata } from 'next';
import type { JSX } from 'react';
import '../globals.css';

export const metadata: Metadata = {
  title: 'ATE9 Admin Dashboard',
  description: 'Manage ATE9 projects, users, and analytics through a streamlined admin dashboard.',
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  // ログインページでは認証チェックをスキップ
  // 各ページ（dashboard/page.tsx など）で個別に認証チェックを行う

  return <div className="min-h-screen bg-background-light text-text-body">{children}</div>;
}
