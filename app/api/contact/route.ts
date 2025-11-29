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

    // ① Formspree に送信（ここが「本丸」）
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

    // ② Discord Webhook に送信（あくまでオプション通知）
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('[contact] DISCORD_WEBHOOK_URL is not configured');
      // 通知は失敗だが、問い合わせ自体は成功扱い
      return NextResponse.json(
        {
          ok: true,
          discordNotified: false,
          warning: 'DISCORD_WEBHOOK_URL is not configured',
        },
        { status: 200 },
      );
    }

    const discordPayload = {
      username: 'ATE9 Contact',
      embeds: [
        {
          title: '📩 New Contact Message',
          color: 16711680,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Message', value: message },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      console.error('[contact] Discord webhook request failed', {
        status: discordResponse.status,
        statusText: discordResponse.statusText,
      });

      // Discord だけ失敗 → 200 返すがフラグを落とす
      return NextResponse.json(
        {
          ok: true,
          discordNotified: false,
        },
        { status: 200 },
      );
    }

    // 両方OK
    return NextResponse.json(
      {
        ok: true,
        discordNotified: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[contact] Unexpected error', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
