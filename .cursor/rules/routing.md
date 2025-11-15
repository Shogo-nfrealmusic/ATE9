# Routing & Pages Rules (ATE9)

## App Router
- Next.js App Router 前提。
- ルート構成のイメージ：
  - `app/(lp)/page.tsx` … ATE9 LP トップ
  - `app/(lp)/about/page.tsx` … 必要なら LP 配下ページ
  - `app/(admin)/dashboard/page.tsx` … Admin トップ
- LP 用と Admin 用の layout は分ける：
  - `app/(lp)/layout.tsx`
  - `app/(admin)/layout.tsx`

## 命名
- セクションコンポーネント名は `SectionHero`, `SectionMission` のように統一。
- ルート直下にロジックを書かず、基本は `components/*` に切り出して組み立てる。
