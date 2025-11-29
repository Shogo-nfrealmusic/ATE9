import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Admin 共通パスワード
 * 3人の Admin ユーザーが共通で使用するパスワード
 * 環境変数 ADMIN_PASSWORD から取得
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET(): Promise<Response> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin-authenticated');
  const isAuthenticated = authCookie?.value === 'true';

  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { password?: string };

    if (!ADMIN_PASSWORD) {
      console.error('[admin/auth] ADMIN_PASSWORD is not configured');
      return NextResponse.json({ error: '認証システムが設定されていません' }, { status: 500 });
    }

    if (!body.password || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 });
    }

    // 認証成功: cookie にセッションを設定（24時間有効）
    const cookieStore = await cookies();
    cookieStore.set('admin-authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24時間
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/auth] error', error);
    return NextResponse.json({ error: '認証処理中にエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(): Promise<Response> {
  const cookieStore = await cookies();
  cookieStore.delete('admin-authenticated');

  return NextResponse.json({ success: true });
}
