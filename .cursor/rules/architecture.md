# Architecture Rules (ATE9)

## 基本思想
- **クリーンアーキテクチャ**を意識し、レイヤーを分離する：
  - Presentation（UI / pages / components）
  - Application（use cases / services）
  - Domain（entities / value objects / domain types）
  - Infrastructure（Supabase や外部 API）

## ディレクトリ指針（例）
- `app/(lp)/...` : ランディングページ。基本的には読み取り専用。
- `app/(admin)/...` : 管理画面。CRUD や内部用 UI。
- `components/ui` : 再利用可能なプレゼンテーションコンポーネント。
- `components/lp` / `components/admin` : セクションごとのコンポーネント。
- `domain/` : ドメインモデル・ドメインサービス・型。
- `services/` or `usecases/` : ユースケースやアプリケーションサービス。
- `lib/` : 汎用的なユーティリティ、Supabase クライアントなど。

## 依存関係ルール
- Presentation → Application → Domain の **一方向依存**を守る。
- Infrastructure（Supabase, API クライアント）は Domain に依存しても良いが、  
  Domain から Infrastructure に依存させない。
- Supabase クエリロジックをコンポーネントに直接書かない。

## コンポーネント設計
- コンポーネントの責務は「UI 描画」に限定し、  
  ビジネスロジックは hooks / services に切り出す。
- LP のセクションコンポーネントは
  - `SectionHero`
  - `SectionMission`
  - `SectionServices`
  - `SectionPortfolio`
  のように分割し、`app/(lp)/page.tsx` から組み立てる。

## テスト
- ドメインロジックやユースケースは可能な範囲でユニットテストを書ける構造にする。
- UI コンポーネントは snapshot / interaction テストを検討する（余裕があれば）。
