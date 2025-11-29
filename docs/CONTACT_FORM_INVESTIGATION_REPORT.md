# Contact Form 実装前調査レポート

## 調査日時

2025年1月

## 調査対象

ATE9 コードベースにおける Contact Form 実装のための事前調査

---

## 1. Directory Findings

### 既存のコンポーネント構造

```
components/
├── lp/
│   ├── contact/
│   │   └── ContactFormClient.tsx  ← 既存のフォームコンポーネント（未完成）
│   ├── SectionContactForm.tsx      ← セクションラッパー（既存）
│   ├── SectionAbout.tsx
│   ├── SectionServices.tsx
│   ├── SectionHero.tsx
│   └── SectionBrandPhilosophy.tsx
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── label.tsx
    ├── textarea.tsx
    └── sonner.tsx (toast通知用)
```

### ページ構造

- **メインページ**: `app/(lp)/page.tsx`
  - 既に `SectionContactForm` が組み込まれている
  - ページ内スクロール形式（`#contact` アンカー）
  - 他のセクション（Hero, About, BrandPhilosophy, Services）と統一された構成

- **Contact 専用ページ**: `app/(lp)/contact/page.tsx` は **存在しない**
  - 現状はページ内セクションとして実装されている

---

## 2. Existing UI Patterns

### セクションレイアウトパターン

すべてのセクションコンポーネントで共通のパターンが確認されました：

```tsx
<section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="section-id">
  <div className="mx-auto max-w-6xl">
    {' '}
    {/* または max-w-4xl */}
    {/* コンテンツ */}
  </div>
</section>
```

**共通パターン:**

- `px-4 sm:px-6 lg:px-10`: レスポンシブな横パディング
- `py-16 sm:py-20 lg:py-24`: レスポンシブな縦パディング
- `mx-auto max-w-6xl` または `max-w-4xl`: 中央揃え + 最大幅制限
- `id` 属性: アンカーリンク用

### タイトル/見出しパターン

```tsx
<h2 className="text-3xl font-bold leading-tight tracking-tighter text-white md:text-4xl">
  Get in Touch
</h2>
<p className="max-w-2xl text-sm text-white/70 md:text-base">
  説明文
</p>
```

**共通スタイル:**

- 見出し: `text-3xl md:text-4xl`, `font-bold`, `text-white`
- 説明文: `text-sm md:text-base`, `text-white/70`, `max-w-2xl`

### フォームフィールドパターン

既存の `ContactFormClient.tsx` で使用されているパターン：

```tsx
<label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60">
  Label
</label>
<Input
  className={getFieldClassName(errors.field)}
  // ...
/>
```

**スタイル関数:**

```tsx
const getFieldClassName = (hasError: boolean): string =>
  [
    'bg-transparent text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
    hasError
      ? 'border-ate9-red/80 shadow-[0_0_0_1px_rgba(242,66,109,0.45)]'
      : 'border-ate9-gray/60 focus-visible:border-ate9-red',
  ].join(' ');
```

---

## 3. Styling Guidelines

### カラーパレット

**ATE9 カスタムカラー** (`config/theme.ts`, `app/globals.css`):

```css
--color-ate9-bg: #000000; /* 背景: 黒 */
--color-ate9-red-dark: #8e1616; /* 深い赤 */
--color-ate9-red: #ff0303; /* 鮮烈な赤（アクセント） */
--color-ate9-gray: #3c3d37; /* ダークグレー */
--color-ate9-white: #ffffff; /* 白 */
```

**Tailwind クラス:**

- `bg-ate9-bg`: 背景色
- `bg-ate9-red`: アクセントカラー（ボタン、フォーカス）
- `bg-ate9-red-dark`: ホバー時のボタン色
- `border-ate9-gray/60`: ボーダー色
- `text-white`, `text-white/70`, `text-white/60`: テキスト階調

### 背景色の階調

- **メイン背景**: `bg-ate9-bg` (#000000)
- **カード/セクション**: `bg-ate9-gray` (#3c3d37) - Services セクションのカードで使用
- **テキスト階調**:
  - `text-white`: メインテキスト
  - `text-white/80`: セカンダリテキスト
  - `text-white/70`: 説明文
  - `text-white/60`: ラベル、補助テキスト
  - `text-white/40`: プレースホルダー

### コンポーネントスタイル

**暗色背景前提:**

- すべてのセクションが `bg-ate9-bg` または暗色背景
- フォーム入力は `bg-transparent` で透明背景
- ボーダーは `border-ate9-gray/60` で控えめに

**ボタンスタイル:**

```tsx
<Button size="lg" className="w-full bg-ate9-red text-white hover:bg-ate9-red-dark sm:w-auto">
  Send Message
</Button>
```

---

## 4. API 呼び出し方針の確認

### 既存のフォーム実装

`ContactFormClient.tsx` は現在:

- `useState` でフォーム状態管理
- 基本的なバリデーション（空チェックのみ）
- **TODO コメント**: `// TODO: Integrate with backend endpoint or server action.`

### フォームライブラリの有無

**package.json より:**

- ✅ `react-hook-form`: `^7.66.0` - **インストール済み**
- ✅ `zod`: `^4.1.12` - **インストール済み**
- ✅ `@hookform/resolvers`: `^5.2.2` - **インストール済み**

**しかし、既存の `ContactFormClient.tsx` では使用されていない**

### 既存の API 呼び出しパターン

- **Admin 画面**: `toast` を使用した成功/エラー通知
- **Server Actions**: `app/actions/landing.ts` で Supabase との通信
- **Client Component**: `fetch` を直接使用するパターンは見当たらない

**推奨方針:**

- Formspree は外部 API のため、Client Component での `fetch` 呼び出しが適切
- 既存の `useState` ベースの実装を拡張するか、`react-hook-form` + `zod` に移行するか検討が必要

---

## 5. 実装に必要なファイルの確認

### 既存ファイル

✅ **既に存在:**

- `components/lp/contact/ContactFormClient.tsx` - フォーム本体（未完成）
- `components/lp/SectionContactForm.tsx` - セクションラッパー
- `components/ui/input.tsx`, `button.tsx`, `label.tsx`, `textarea.tsx` - UI コンポーネント

### 追加が必要な可能性

- ❌ `components/ui/FormInput.tsx` のような専用パーツは不要（既存の Input/Textarea で十分）
- ❌ `components/lp/Container.tsx` や `SectionWrapper.tsx` は不要（各セクションが直接スタイルを持っている）
- ✅ **Toast 通知**: `sonner` は既にインストール済み、`ToasterClient` も存在

### ページ構造

- ❌ `app/(lp)/contact/page.tsx` は不要（既にページ内セクションとして実装済み）

---

## 6. Recommended File Structure

### 推奨ファイル構成

```
components/lp/contact/
├── ContactFormClient.tsx          ← 既存（修正が必要）
└── (必要に応じて) useContactForm.ts  ← カスタムフック（オプション）

components/lp/
└── SectionContactForm.tsx         ← 既存（変更不要の可能性）

app/(lp)/
└── page.tsx                        ← 既存（変更不要）
```

### 実装方針

#### オプション 1: 既存実装を拡張（シンプル）

**変更ファイル:**

- `components/lp/contact/ContactFormClient.tsx` のみ

**メリット:**

- 既存のスタイルと構造を維持
- 最小限の変更

**デメリット:**

- バリデーションが簡易的
- エラーハンドリングが手動

#### オプション 2: react-hook-form + zod に移行（推奨）

**変更ファイル:**

- `components/lp/contact/ContactFormClient.tsx`

**メリット:**

- 型安全なバリデーション
- 既存のライブラリを活用
- 保守性が高い

**デメリット:**

- 既存コードからの移行が必要

---

## 7. Implementation Notes

### Formspree エンドポイント統合

**エンドポイント:** `https://formspree.io/f/xrbwdzwz`

**実装例（fetch ベース）:**

```tsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // バリデーション
  // ...

  try {
    const response = await fetch('https://formspree.io/f/xrbwdzwz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    });

    if (!response.ok) {
      throw new Error('送信に失敗しました');
    }

    // 成功処理
    toast.success('メッセージを送信しました');
    // フォームリセット
  } catch (error) {
    toast.error('送信に失敗しました');
  }
};
```

### エラー/成功状態の表示

**既存パターン:**

- `sonner` の `toast` を使用（Admin 画面で実績あり）
- `ToasterClient` をレイアウトに追加する必要がある可能性

**確認事項:**

- `app/(lp)/layout.tsx` または `app/layout.tsx` に `ToasterClient` が含まれているか確認が必要

### ローディング状態

既存の Button コンポーネントに `disabled` プロパティがあるため、送信中は無効化可能：

```tsx
<Button disabled={isSubmitting} className="...">
  {isSubmitting ? '送信中...' : 'Send Message'}
</Button>
```

---

## 8. Potential Pitfalls

### 注意点 1: Toast 通知のセットアップ

**問題:**

- `ToasterClient` が LP レイアウトに含まれていない可能性

**確認が必要:**

- `app/(lp)/layout.tsx` に `<ToasterClient />` が含まれているか
- 含まれていない場合は追加が必要

### 注意点 2: カラー定義の不一致

**問題:**

- `ContactFormClient.tsx` のエラー表示で `rgba(242,66,109,0.45)` が使用されているが、これは `ate9-red` (#ff0303) と異なる

**対応:**

- `border-ate9-red/80` や `shadow-[0_0_0_1px_rgba(255,3,3,0.45)]` に統一すべき

### 注意点 3: バリデーションの強化

**現状:**

- 空チェックのみ
- メールアドレスの形式チェックがない

**推奨:**

- `zod` を使用した型安全なバリデーションスキーマの導入

### 注意点 4: CORS / セキュリティ

**Formspree:**

- 通常は CORS 対応済み
- ただし、本番環境での動作確認が必要

### 注意点 5: レスポンシブデザイン

**現状:**

- `grid grid-cols-1 md:grid-cols-2` で Name/Email が2列
- モバイルでは1列に自動調整

**確認:**

- 既存の実装で問題ないが、テスト推奨

---

## 9. 推奨実装手順

### ステップ 1: Toast 通知の確認・追加

- `app/(lp)/layout.tsx` に `ToasterClient` が含まれているか確認
- 含まれていない場合は追加

### ステップ 2: バリデーションスキーマの作成（zod）

```tsx
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  message: z.string().min(1, 'メッセージは必須です'),
});
```

### ステップ 3: Formspree 統合

- `handleSubmit` に fetch 呼び出しを追加
- エラーハンドリングと成功時の処理を実装

### ステップ 4: ローディング状態の追加

- `isSubmitting` ステートを追加
- ボタンの無効化とローディング表示

### ステップ 5: エラー表示の改善

- フィールドごとのエラーメッセージ表示（オプション）
- 既存の `errors` ステートを活用

---

## 10. まとめ

### 既存実装の状況

✅ **良い点:**

- フォームコンポーネントの基本構造は完成している
- UI コンポーネント（Input, Button, Textarea）は揃っている
- セクションラッパーも既に存在
- スタイリングは既存パターンに準拠

⚠️ **改善が必要:**

- Formspree エンドポイントへの送信処理が未実装
- バリデーションが簡易的（空チェックのみ）
- エラー/成功通知のセットアップ確認が必要
- カラー定義の不一致（エラー表示）

### 推奨アプローチ

1. **最小限の変更**: 既存の `ContactFormClient.tsx` に Formspree 統合を追加
2. **バリデーション強化**: `zod` スキーマの導入（オプション）
3. **通知システム**: `sonner` の `toast` を使用
4. **ローディング状態**: 送信中の UX 改善

### 実装優先度

**高:**

- Formspree エンドポイントへの送信処理
- 成功/エラー通知（toast）

**中:**

- バリデーション強化（zod）
- ローディング状態の追加

**低:**

- エラー表示の視覚的改善
- カスタムフックへの分離

---

**調査完了日:** 2025年1月
**調査者:** AI Assistant
