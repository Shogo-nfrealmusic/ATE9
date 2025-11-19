import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase クライアント
 *
 * - 本番 / 開発環境では NEXT_PUBLIC_SUPABASE_* を必須とし、
 *   未設定の場合は「疑似クライアント」でエラーを返させる前提で
 *   `services/cms/landing` 側が FALLBACK_CONTENT にフォールバックする。
 * - これにより、CI やローカルで Supabase の環境変数が未設定でも
 *   ビルド自体は通り、LP は常にデフォルトコンテンツで表示される。
 */
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // 環境変数がない場合はダミーのエンドポイントでクライアントを作成する。
  // 実際の API コールは失敗するが、呼び出し側で error を検知して
  // FALLBACK_CONTENT にフォールバックする設計になっている。
  supabase = createClient('https://example.supabase.co', 'public-anon-key');
}

export { supabase };
