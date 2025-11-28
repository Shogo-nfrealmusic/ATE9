import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let browserClient: SupabaseClient | null = null;

function createFallbackClient(): SupabaseClient {
  return createClient('https://example.supabase.co', 'public-anon-key');
}

/**
 * Public（ブラウザ / RSC 読み取り）向けクライアント
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    browserClient = createFallbackClient();
  }

  return browserClient;
}

/**
 * Server Action / Admin 保存処理向け service role クライアント
 */
export function createServerSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // build 時や env 未設定時は fallback クライアントを返す
    // ランタイムで実際に使われる際は env が設定されている前提
    return createFallbackClient();
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  });
}
