# Services 表示順が sort_order に従わない問題 調査レポート

## 調査日時

2025年1月

## 問題の概要

`lp_service_items.sort_order` が正しく更新されているにもかかわらず、管理画面／LP の Services 表示順が変わらない

---

## Step 1: Services 表示に使われているデータ取得ロジックの特定

### LP 表示用の取得関数

**ファイルパス**: `services/cms/landing.ts`
**関数名**: `getServicesFromDb()` (302-332行目)

**Supabase クエリ**:

```typescript
supabase
  .from('lp_service_items')
  .select('id, slug, title, description, background_color, gallery, sort_order')
  .eq('services_id', ROW_ID)
  .order('sort_order', { ascending: true }) // ✅ sort_order で並び替えている
  .returns<ServiceItemRow[]>();
```

**データフロー**:

1. `app/(lp)/page.tsx` → `getLandingContent()` → `getServicesFromDb()`
2. `components/lp/SectionServices.tsx` で `content.services.items` を表示

### Admin 編集画面用の取得関数

**ファイルパス**: `app/(admin)/admin/dashboard/page.tsx`
**関数名**: `getLandingContent()` → `getServicesFromDb()` (同じ関数を使用)

**データフロー**:

1. `app/(admin)/admin/dashboard/page.tsx` → `getLandingContent()` → `getServicesFromDb()`
2. `components/admin/lp/AdminShell.tsx` → `ServicesSectionEditor` に `content.services` を渡す

**重要な点**:

- LP 表示と Admin 編集画面は**同じ `getServicesFromDb()` 関数を使用している**
- 両方とも `.order('sort_order', { ascending: true })` が**既に含まれている** ✅

---

## Step 2: sort_order を使っているかどうかの確認

### ✅ LP 表示用の取得処理

**ファイル**: `services/cms/landing.ts:302-332`

- **並び替え**: `.order('sort_order', { ascending: true })` ✅
- **返却順序**: `sort_order` 昇順で返される

### ✅ Admin 編集画面用の取得処理

**ファイル**: `services/cms/landing.ts:302-332` (同じ関数)

- **並び替え**: `.order('sort_order', { ascending: true })` ✅
- **返却順序**: `sort_order` 昇順で返される

### 結論

**両方の取得処理で `sort_order` による並び替えが実装されている** ✅

---

## Step 3: データ整形中に順番を書き換えていないか確認

### 確認した処理

#### 1. `getServicesFromDb()` の `items.map()` (321-330行目)

```typescript
items: items.map(
  (item): ServiceItem => ({
    id: item.id,
    slug: item.slug ?? item.id,
    title: item.title,
    description: item.description,
    backgroundColor: item.background_color,
    gallery: item.gallery ?? [],
  }),
),
```

**分析**:

- `items.map()` は順序を維持する（配列の順序は変わらない）
- `sort_order` フィールドは `ServiceItem` 型に含まれていないが、これは問題ではない
- **順序を変更する処理は見当たらない** ✅

#### 2. `getLandingContent()` のフォールバック処理 (371-387行目)

```typescript
export async function getLandingContent(): Promise<LandingContent> {
  const [hero, about, services, portfolio, brandPhilosophy] = await Promise.all([
    getHeroFromDb(),
    getAboutFromDb(),
    getServicesFromDb(),
    getPortfolioFromDb(),
    getBrandPhilosophyFromDb(),
  ]);

  return {
    hero: hero ?? FALLBACK_CONTENT.hero,
    about: about ?? FALLBACK_CONTENT.about,
    services: services ?? FALLBACK_CONTENT.services, // ← ここ
    portfolio: portfolio ?? FALLBACK_CONTENT.portfolio,
    brandPhilosophy: brandPhilosophy ?? FALLBACK_CONTENT.brandPhilosophy,
  };
}
```

**分析**:

- `getServicesFromDb()` が `null` を返した場合、`FALLBACK_CONTENT.services` が使われる
- `FALLBACK_CONTENT.services.items` は固定順序（`sort_order` の概念がない）
- しかし、ユーザーは「DB の sort_order が正しく更新されている」と言っているので、`getServicesFromDb()` は正常に動作しているはず

#### 3. `SectionServices` コンポーネント (components/lp/SectionServices.tsx:22)

```typescript
{
  content.items.map((item) => {
    // ...
  });
}
```

**分析**:

- `content.items` をそのまま `map` で表示している
- **順序を変更する処理は見当たらない** ✅

#### 4. `ServicesSectionEditor` コンポーネント (components/admin/lp/sections/ServicesSectionEditor.tsx:239)

```typescript
{services.items.map((item, index) => (
  // ...
))}
```

**分析**:

- `services.items` をそのまま `map` で表示している
- **順序を変更する処理は見当たらない** ✅

### 結論

**データ整形処理で順序を書き換えている箇所は見つからなかった** ✅

---

## Step 4: 実際の挙動の確認ポイント

### 確認すべきポイント

#### 1. `getServicesFromDb()` の返却値をログ出力

**ファイル**: `services/cms/landing.ts:302-332`

```typescript
async function getServicesFromDb(): Promise<ServicesContent | null> {
  const supabase = createServerSupabaseClient();
  const [{ data: serviceRow, error: servicesError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase.from('lp_services').select('intro').eq('id', ROW_ID).single<ServiceRow>(),
      supabase
        .from('lp_service_items')
        .select('id, slug, title, description, background_color, gallery, sort_order')
        .eq('services_id', ROW_ID)
        .order('sort_order', { ascending: true })
        .returns<ServiceItemRow[]>(),
    ]);

  // TODO: デバッグ用ログ（確認後に削除）
  console.log(
    '[getServicesFromDb] items from DB:',
    items?.map((item) => ({
      id: item.id,
      title: item.title,
      sort_order: item.sort_order,
    })),
  );

  if (servicesError || !serviceRow || itemsError || !items) {
    return null;
  }

  const result = {
    intro: serviceRow.intro,
    items: items.map(
      (item): ServiceItem => ({
        id: item.id,
        slug: item.slug ?? item.id,
        title: item.title,
        description: item.description,
        backgroundColor: item.background_color,
        gallery: item.gallery ?? [],
      }),
    ),
  };

  // TODO: デバッグ用ログ（確認後に削除）
  console.log(
    '[getServicesFromDb] mapped items:',
    result.items.map((item) => ({
      id: item.id,
      title: item.title,
    })),
  );

  return result;
}
```

#### 2. `ServicesSectionEditor` のレンダリング直前でログ出力

**ファイル**: `components/admin/lp/sections/ServicesSectionEditor.tsx:60`

```typescript
export function ServicesSectionEditor({
  services,
  portfolioItems,
  onChange,
  onSave,
  isSaving,
  onManageWorks,
}: ServicesSectionEditorProps): JSX.Element {
  // TODO: デバッグ用ログ（確認後に削除）
  console.log(
    '[ServicesSectionEditor] services.items:',
    services.items.map((item) => ({
      id: item.id,
      title: item.title,
    })),
  );

  // ... 既存のコード
}
```

#### 3. `SectionServices` のレンダリング直前でログ出力

**ファイル**: `components/lp/SectionServices.tsx:9`

```typescript
export function SectionServices({ content }: SectionServicesProps): JSX.Element {
  // TODO: デバッグ用ログ（確認後に削除）
  console.log(
    '[SectionServices] content.items:',
    content.items.map((item) => ({
      id: item.id,
      title: item.title,
    })),
  );

  // ... 既存のコード
}
```

### 確認手順

1. 上記のログを追加
2. 管理画面で services を並び替えて保存
3. ブラウザのコンソールとサーバーログを確認
4. 以下を確認：
   - DB から取得した `items` の `sort_order` が正しいか
   - `items.map()` 後の配列の順序が維持されているか
   - コンポーネントに渡される `services.items` の順序が正しいか

---

## 推測される原因

### 可能性 1: キャッシュの問題

**LP ページ** (`app/(lp)/page.tsx`):

```typescript
export const revalidate = 3600; // 1時間キャッシュ
```

**Admin ページ** (`app/(admin)/admin/dashboard/page.tsx`):

```typescript
export const revalidate = 0;
export const dynamic = 'force-dynamic';
```

**問題点**:

- LP ページは 1 時間キャッシュされるため、並び替え保存後も古い順序が表示される可能性がある
- Admin ページはキャッシュされないので、こちらは問題ないはず

**確認方法**:

- LP ページをリロード（強制リロード: Ctrl+Shift+R / Cmd+Shift+R）
- または、`revalidate = 0` に一時的に変更して確認

### 可能性 2: `getServicesFromDb()` が `null` を返している

**問題点**:

- `getServicesFromDb()` が `null` を返すと、`FALLBACK_CONTENT.services` が使われる
- `FALLBACK_CONTENT.services.items` は固定順序（`sort_order` の概念がない）

**確認方法**:

- `getServicesFromDb()` のログを確認
- エラーが発生していないか確認

### 可能性 3: DB の `sort_order` が実際には更新されていない

**問題点**:

- `upsert_lp_services` 関数が `sort_order` を正しく更新していない可能性

**確認方法**:

- Supabase のコンソールで `lp_service_items` テーブルを確認
- `sort_order` が実際に更新されているか確認

---

## 修正方針（原因が特定できた後に）

### シナリオ A: キャッシュの問題の場合

**修正内容**:

- LP ページの `revalidate` を `0` に変更（開発環境のみ）
- または、並び替え保存後に `revalidatePath('/')` を呼び出す

### シナリオ B: `getServicesFromDb()` が `null` を返している場合

**修正内容**:

- エラーハンドリングを改善
- エラーログを確認して原因を特定

### シナリオ C: DB の `sort_order` が更新されていない場合

**修正内容**:

- `upsert_lp_services` 関数の実装を確認
- `sort_order` が正しく更新されるように修正

---

## TODO: ユーザー確認事項

// TODO: ユーザー確認事項
// - 表示順は常に sort_order 昇順で良いか？
// 例: sort_order が 0,1,2,... のとき、0 が一番上で良いか？
// - LP 表示と Admin 表示で同じ順序（sort_order）を使う前提で良いか？
// - 並び替え保存後、LP ページをリロード（強制リロード）した場合、順序は正しく表示されますか？
// - Admin 画面では順序が正しく表示されますか？

---

## 次のステップ

1. 上記のログを追加して、実際の挙動を確認
2. キャッシュの問題かどうかを確認（LP ページを強制リロード）
3. `getServicesFromDb()` が正常に動作しているか確認
4. DB の `sort_order` が実際に更新されているか確認
5. 原因を特定したら、上記の修正方針に従って修正
