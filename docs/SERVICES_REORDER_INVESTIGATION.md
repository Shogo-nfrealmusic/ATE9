# Services 並び替え時の Portfolio 紐づけ問題 調査レポート

## 調査日時

2025年1月

## 問題の概要

「services の順番を並び替えて保存したときに、既存の lp_portfolio_items.service_id の紐づけが壊れる」問題

---

## Step 1: 対象画面と処理の特定

### 対象コンポーネント

- **ファイルパス**: `components/admin/lp/sections/ServicesSectionEditor.tsx`
- **並び替え関数**: `handleReorder` (161-171行目)
  ```tsx
  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...services.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) {
      return;
    }
    const temp = newItems[targetIndex];
    newItems[targetIndex] = newItems[index];
    newItems[index] = temp;
    onChange({ ...services, items: newItems });
  };
  ```

### 保存処理の流れ

1. **フロントエンド**: `ServicesSectionEditor` → `onSave` プロップ → `AdminShell.handleSave('services')`
2. **Server Action**: `app/actions/landing.ts` → `saveLandingContentAction`
3. **サービス層**: `services/cms/landing.ts` → `saveLandingContent` → `saveServicesToDb`
4. **データベース**: `supabase.rpc('upsert_lp_services', ...)`

### リクエストボディの構造

`saveServicesToDb` 関数（455-471行目）で以下の形式で RPC を呼び出しています：

```typescript
await supabase.rpc('upsert_lp_services', {
  p_services: {
    id: ROW_ID, // 'default'
    intro: services.intro,
    items: services.items, // ServiceItem[] の配列（id, slug, title, description, backgroundColor, gallery を含む）
  },
});
```

**重要な点**:

- `services.items` には **既存の `id` が含まれている**
- 並び替え後も **同じ `id` の配列** が送信されている（順序だけが変わっている）

---

## Step 2: 並び替え保存ロジックの精査

### 問題の核心: `upsert_lp_services` RPC 関数

**現状**: `supabase/sql/` ディレクトリに `upsert_lp_services.sql` ファイルが存在しない

**推測される問題**:
`upsert_lp_portfolio_for_service.sql` のコメント（2-4行目）によると：

```sql
-- 旧 upsert_lp_portfolio では portfolio_id 単位で全件 delete → insert していた。
-- この関数は (portfolio_id, service_id) の組に限定して削除・挿入することで、
-- 他サービスの lp_portfolio_items を巻き込まないようにしている。
```

同様の実装が `upsert_lp_services` にもある可能性が高い：

- **`lp_service_items` を全削除 → 新しい ID で再作成** している可能性
- または **`services_id` で全削除 → 再作成** している可能性

### 確認が必要な点

**TODO: ユーザー質問**

1. **`upsert_lp_services` 関数の実装を確認してください**
   - Supabase の SQL Editor またはマイグレーションファイルで確認
   - この関数が `lp_service_items` をどのように更新しているか

2. **並び替え保存後の DB 状態を確認してください**
   - `lp_portfolio_items.service_id` は null になっていますか？
   - それとも参照先の `lp_service_items` レコードが削除されていますか？
   - または `lp_service_items.id` が別の値に変わっていますか？

3. **`lp_service_items.id` の扱いについて**
   - 一度作成した `lp_service_items.id` は変更しない想定で合っていますか？

---

## Step 3: コード上の問題箇所の特定

### 問題になりそうなコードブロック

#### 1. `saveServicesToDb` 関数（services/cms/landing.ts:455-471）

```typescript
async function saveServicesToDb(
  supabase: SupabaseClient,
  services: ServicesContent,
): Promise<void> {
  const { error } = await supabase.rpc('upsert_lp_services', {
    p_services: {
      id: ROW_ID,
      intro: services.intro,
      items: services.items, // ← ここに id が含まれているが、RPC 側でどう扱われるか不明
    },
  });
  // ...
}
```

**問題点**:

- `services.items` には既存の `id` が含まれているが、RPC 関数内でこの `id` を尊重しているか不明
- RPC 関数が全削除→再作成している場合、**新しい ID が生成される**可能性がある
- その結果、`lp_portfolio_items.service_id` が参照している `lp_service_items.id` が存在しなくなる

#### 2. `normalizePortfolioForServices` 関数（services/cms/landing.ts:589-602）

```typescript
function normalizePortfolioForServices(
  portfolio: PortfolioContent,
  services: ServiceItem[],
): PortfolioContent {
  const validServiceIds = new Set(services.map((service) => service.id));

  return {
    ...portfolio,
    items: portfolio.items.map((item) => ({
      ...item,
      serviceId: item.serviceId && validServiceIds.has(item.serviceId) ? item.serviceId : null,
      // ↑ 参照先の service_id が存在しない場合、null にしている
    })),
  };
}
```

**問題点**:

- この関数は `saveLandingContent` 内で呼ばれている（613行目）
- もし `upsert_lp_services` が新しい ID を生成した場合、`validServiceIds` に古い ID が含まれない
- その結果、`portfolio.items` の `serviceId` が **null に変換される**
- しかし、この正規化は **メモリ上のデータのみ** で、DB には直接影響しない

**実際の DB 更新は `saveServicesToDb` の RPC 関数内で行われているため、この正規化は問題の直接原因ではない可能性が低い**

---

## 推測される原因

### シナリオ A: `upsert_lp_services` が全削除→再作成している

**問題の流れ**:

1. 並び替え保存時に `upsert_lp_services` が呼ばれる
2. RPC 関数内で `DELETE FROM lp_service_items WHERE services_id = 'default'` を実行
3. その後、新しい `id` を生成して `INSERT` を実行
4. 結果: **既存の `lp_service_items.id` がすべて削除され、新しい ID が生成される**
5. `lp_portfolio_items.service_id` が参照していた古い ID が存在しなくなる
6. 外部キー制約により、`lp_portfolio_items.service_id` が **NULL になる** または **参照エラーになる**

### シナリオ B: `upsert_lp_services` が ID を無視して再生成している

**問題の流れ**:

1. `services.items` に既存の `id` が含まれていても、RPC 関数がそれを無視
2. 新しい `id` を生成して `INSERT` を実行
3. 結果: シナリオ A と同様に、古い ID が存在しなくなる

### シナリオ C: `sort_order` の更新時に ID も変更している

**問題の流れ**:

1. 並び替え時に `sort_order` だけを更新すべきところ、ID も再生成している
2. 結果: シナリオ A/B と同様

---

## 修正方針（原因が確認できた後に着手）

### 前提条件

- **`lp_service_items.id` は一度作成したら変更しない**
- **並び替えは `sort_order` の更新のみで行う**
- **`lp_portfolio_items.service_id` は変更しない**

### 修正内容

#### 1. `upsert_lp_services` RPC 関数の修正

**現在の実装（推測）**:

```sql
-- 全削除 → 再作成（問題あり）
DELETE FROM lp_service_items WHERE services_id = p_services.id;
INSERT INTO lp_service_items (...) VALUES (...);
```

**修正後の実装（推奨）**:

```sql
-- 既存レコードの sort_order を更新 + 新規レコードを追加 + 不要レコードを削除
-- ID は変更しない

-- 1. 既存レコードの sort_order を更新
UPDATE lp_service_items
SET sort_order = ...
WHERE id = ...;

-- 2. 新規レコードを追加（既に存在する ID はスキップ）
INSERT INTO lp_service_items (...)
SELECT ... FROM jsonb_array_elements(...)
ON CONFLICT (id) DO UPDATE SET sort_order = EXCLUDED.sort_order, ...;

-- 3. 送信されていない既存レコードを削除（オプション）
DELETE FROM lp_service_items
WHERE services_id = p_services.id
  AND id NOT IN (SELECT ... FROM jsonb_array_elements(...));
```

#### 2. コード側の確認

- `services.items` に含まれる `id` が RPC 関数に正しく渡されているか確認
- RPC 関数がこの `id` を尊重して UPDATE を行っているか確認

---

## 確認が必要な情報

### ユーザーへの質問

1. **`upsert_lp_services` 関数の実装**
   - Supabase の SQL Editor で `SELECT prosrc FROM pg_proc WHERE proname = 'upsert_lp_services';` を実行して、関数の実装を確認してください
   - または、マイグレーションファイルや SQL ファイルがあれば共有してください

2. **並び替え保存後の DB 状態**
   - `lp_portfolio_items.service_id` は null になっていますか？
   - それとも参照先の `lp_service_items` レコードが削除されていますか？
   - または `lp_service_items.id` が別の値に変わっていますか？

3. **`lp_service_items.id` の扱い**
   - 一度作成した `lp_service_items.id` は変更しない想定で合っていますか？

4. **並び替え画面のルートパス**
   - 管理画面の並び替えは `/admin/dashboard` の Services タブで行っていますか？

---

## 次のステップ

1. ユーザーから上記の質問への回答を得る
2. `upsert_lp_services` 関数の実装を確認
3. 問題の原因を特定
4. 修正方針を確定
5. `upsert_lp_services` 関数を修正（ID を変更せず、`sort_order` のみ更新する実装に変更）
6. 回帰テストを実施

---

## 参考: 類似の修正例

`upsert_lp_portfolio_for_service.sql` では、以下のように修正されています：

- 旧実装: `portfolio_id` 単位で全件 delete → insert
- 新実装: `(portfolio_id, service_id)` の組に限定して削除・挿入

同様のアプローチで、`upsert_lp_services` も修正する必要があります。

---

## 修正完了: `upsert_lp_services` 関数の安全版実装

### 作成したファイル

- **ファイルパス**: `supabase/sql/upsert_lp_services.sql`
- **内容**: delete を行わず、`id` ごとに `ON CONFLICT` で upsert する実装

### 修正内容の要点

- **以前の問題**: `DELETE FROM lp_service_items WHERE services_id = ...` を実行していたため、並び替えのたびに全削除→再作成され、`lp_portfolio_items.service_id` の参照が壊れていた
- **修正後**: `ON CONFLICT (id) DO UPDATE` を使用して、既存の `id` を維持しつつ `sort_order` のみを更新

---

## `upsert_lp_services` の修正適用手順

### 1. Supabase SQL Editor での適用

1. Supabase Dashboard の SQL Editor を開く
2. `supabase/sql/upsert_lp_services.sql` の内容をコピーして実行する
3. 確認のため、以下のクエリで関数定義が更新されていることをチェックする：

```sql
SELECT prosrc
FROM pg_proc
WHERE proname = 'upsert_lp_services';
```

### 2. 管理画面での動作確認

1. 管理画面（`/admin/dashboard`）の Services タブを開く
2. サービスを並び替えて「すべて保存」ボタンをクリック
3. 保存が成功することを確認

---

## 挙動確認手順（必須）

### 事前準備

1. **テストデータの作成**
   - `lp_service_items` を 2〜3件作成する（例: "Service A", "Service B", "Service C"）
   - それぞれの `id` をメモしておく（例: `svc-1`, `svc-2`, `svc-3`）

2. **ポートフォリオとの紐づけ**
   - `lp_portfolio_items` を 2〜3件作成する
   - それぞれの `service_id` に上記の `lp_service_items.id` を設定する
   - 例:
     - Portfolio Item 1 → `service_id = 'svc-1'`
     - Portfolio Item 2 → `service_id = 'svc-2'`
     - Portfolio Item 3 → `service_id = 'svc-3'`

### 確認手順

1. **並び替え前の DB 状態を記録**

   ```sql
   -- lp_service_items の id と sort_order を確認
   SELECT id, title, sort_order
   FROM lp_service_items
   WHERE services_id = 'default'
   ORDER BY sort_order;

   -- lp_portfolio_items の service_id を確認
   SELECT id, title, service_id
   FROM lp_portfolio_items
   WHERE portfolio_id = 'default'
   ORDER BY service_id, sort_order;
   ```

2. **管理画面で並び替えを実行**
   - `/admin/dashboard` の Services タブを開く
   - サービスカードの順番を変更（例: "Service A" と "Service C" を入れ替え）
   - 「すべて保存」ボタンをクリック
   - 保存が成功することを確認

3. **並び替え後の DB 状態を確認**

   ```sql
   -- lp_service_items の id が変わっていないことを確認
   SELECT id, title, sort_order
   FROM lp_service_items
   WHERE services_id = 'default'
   ORDER BY sort_order;
   -- ✅ 確認ポイント: id が並び替え前と同じであること
   -- ✅ 確認ポイント: sort_order のみが更新されていること

   -- lp_portfolio_items の service_id が維持されていることを確認
   SELECT id, title, service_id
   FROM lp_portfolio_items
   WHERE portfolio_id = 'default'
   ORDER BY service_id, sort_order;
   -- ✅ 確認ポイント: service_id が NULL になっていないこと
   -- ✅ 確認ポイント: service_id が並び替え前と同じ値であること
   ```

### 期待される結果

- ✅ `lp_service_items.id` が並び替え前と同じであること
- ✅ `lp_service_items.sort_order` のみが更新されていること
- ✅ `lp_portfolio_items.service_id` が NULL になっていないこと
- ✅ `lp_portfolio_items.service_id` が並び替え前と同じ値であること

### 問題が発生した場合

もし上記の確認で問題が見つかった場合：

1. `upsert_lp_services` 関数の実装を再確認
2. エラーログを確認（Supabase Dashboard の Logs タブ）
3. 関数の実行結果を確認（`SELECT prosrc FROM pg_proc WHERE proname = 'upsert_lp_services';`）
