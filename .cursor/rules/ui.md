# UI Rules (ATE9)

## UI フレームワーク
- メインは **shadcn/ui** を使用。
- 可能な限り shadcn のコンポーネントをベースに拡張し、  
  一から styled component を増やさない。
- 既存コンポーネントを **props で拡張**し、不要な重複コンポーネントは作らない。

## コンポーネント設計
- `components/ui/` : shadcn ベースの共通 UI コンポーネント（Button, Card, Typography, etc）。
- `components/lp/` : LP 専用セクションコンポーネント。
- `components/admin/` : 管理画面用コンポーネント。
- 色や余白のトークンはできるだけ **共通の theme / config** 経由で扱う。

## LP / Admin の分離
- ルーティングやディレクトリは `app/(lp)/...`, `app/(admin)/...` のように分離するイメージ。
- LP 向けコンポーネントを Admin で直接流用しない（逆も同様）。  
  使い回したいものは `components/ui/` に切り出す。

## デザイン準拠
- `.cursor/ATE9_designdesign/design.html` / `design.png` を常に参照し、
  - フォントサイズ
  - 余白
  - カードのレイアウト
  - カラー
  が大きく逸脱しないように実装する。
- 必要に応じて **Tailwind クラスのユーティリティ化**（e.g. `cn`, `typography`）も検討する。

## アクセシビリティ
- 重要なボタンやリンクには `aria-label` を適切に付与。
- 白背景 × 薄いグレー/ブルー上で、**コントラスト比**が十分になるよう配色を調整する。
