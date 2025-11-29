import { NextResponse } from 'next/server';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrbwdzwz';

type ContactRequestBody = {
  name: string;
  email: string;
  message: string;
};

const EMAIL_REGEX = /.+@.+\..+/;

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as Partial<ContactRequestBody>;

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    // サーバ側の簡易バリデーション
    if (!name || !email || !EMAIL_REGEX.test(email) || !message) {
      return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
    }

    // Formspree に送信（ここが「本丸」）
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!formspreeResponse.ok) {
      console.error('[contact] Formspree request failed', {
        status: formspreeResponse.status,
        statusText: formspreeResponse.statusText,
      });
      // Formspree 失敗は致命的扱い
      return NextResponse.json({ ok: false, error: 'Formspree request failed' }, { status: 500 });
    }

    // Formspree が成功したら OK を返す
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[contact] Unexpected error', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
