# ハンバーガーメニュー修復レポート

## 🔍 1. 調査フェーズ - 原因の特定

### 発見された問題点

#### 問題 1: z-index の不足

- **場所**: `components/lp/site-header/SiteHeaderMobileMenu.tsx:52-57`
- **問題**: メニューが `absolute` で配置されているが、`z-index` が設定されていない
- **影響**: 他の要素（特に `main` コンテンツ）の後ろに隠れる可能性がある
- **SiteHeader は `z-50` だが、メニュー自体には z-index がない**

#### 問題 2: overflow による隠蔽

- **場所**: `app/(lp)/layout.tsx:18` で `overflow-x-hidden` が設定されている
- **問題**: メニューが `absolute` で `top-full` に配置されているが、親要素の overflow 設定によって隠れる可能性がある
- **影響**: メニューが表示されない、または一部が切れる

#### 問題 3: メニュー外クリックで閉じる機能がない

- **場所**: `components/lp/site-header/SiteHeaderMobileMenu.tsx`
- **問題**: メニュー外をクリックしても閉じない
- **影響**: UX の悪化、メニューが開きっぱなしになる

#### 問題 4: body の overflow 制御がない

- **場所**: `components/lp/site-header/SiteHeaderMobileMenu.tsx`
- **問題**: メニューが開いたときに body のスクロールを防ぐ機能がない
- **影響**: メニューが開いているときに背景がスクロールしてしまう

#### 問題 5: ポジショニングの問題

- **場所**: `components/lp/site-header/SiteHeaderMobileMenu.tsx:52`
- **問題**: `absolute` で `top-full` に配置されているが、親要素の制約を受ける
- **影響**: メニューが正しく表示されない可能性がある

### 状態管理の確認

- ✅ `useState` は正常に動作している（18行目）
- ✅ `onClick` ハンドラーは正常に動作している（24行目）
- ❌ メニュー外クリックの処理がない
- ❌ body の overflow 制御がない

### アニメーションの確認

- ✅ ハンバーガーアイコンのアニメーションは正常（31-48行目）
- ✅ メニューの開閉アニメーションは正常（52-57行目）
- ❌ ただし、メニューが表示されない場合はアニメーションも見えない

---

## 🔧 2. 修復フェーズ

### 修正内容

1. **z-index の追加**:
   - ボタンに `z-[60]` を設定
   - メニュー本体に `z-[60]` を設定
   - オーバーレイに `z-[55]` を設定（メニューの下、ヘッダーの上）

2. **メニュー外クリックで閉じる機能**:
   - `useEffect` + `mousedown` イベントリスナーを追加
   - メニュー外またはボタン外をクリックしたときに閉じる

3. **body の overflow 制御**:
   - メニュー開閉時に `document.body.style.overflow` を制御
   - メニューが開いている間は背景のスクロールを無効化

4. **ポジショニングの改善**:
   - `absolute` から `fixed` に変更
   - `top-[73px]` でヘッダーの下に配置（ヘッダーの高さを考慮）

5. **ESC キーで閉じる機能**:
   - `keydown` イベントリスナーを追加
   - ESC キーでメニューを閉じる

6. **オーバーレイの追加**:
   - メニュー外の暗い背景を追加
   - クリックでメニューを閉じる

7. **アクセシビリティの改善**:
   - フォーカス時のリング表示を追加
   - キーボード操作に対応

### 変更 diff

```diff
'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { JSX } from 'react';
-import { useState } from 'react';
+import { useEffect, useRef, useState } from 'react';

export type SiteHeaderNavItem = {
  label: string;
  href: string;
};

type SiteHeaderMobileMenuProps = {
  navItems: SiteHeaderNavItem[];
};

export function SiteHeaderMobileMenu({ navItems }: SiteHeaderMobileMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
+  const menuRef = useRef<HTMLDivElement>(null);
+  const buttonRef = useRef<HTMLButtonElement>(null);
+
+  // メニュー外クリックで閉じる + body の overflow 制御
+  useEffect(() => {
+    if (isOpen) {
+      // body のスクロールを無効化
+      document.body.style.overflow = 'hidden';
+
+      // メニュー外クリックで閉じる
+      const handleClickOutside = (event: MouseEvent) => {
+        const target = event.target as Node;
+        if (
+          menuRef.current &&
+          buttonRef.current &&
+          !menuRef.current.contains(target) &&
+          !buttonRef.current.contains(target)
+        ) {
+          setIsOpen(false);
+        }
+      };
+
+      // ESC キーで閉じる
+      const handleEscape = (event: KeyboardEvent) => {
+        if (event.key === 'Escape') {
+          setIsOpen(false);
+        }
+      };
+
+      document.addEventListener('mousedown', handleClickOutside);
+      document.addEventListener('keydown', handleEscape);
+
+      return () => {
+        document.body.style.overflow = '';
+        document.removeEventListener('mousedown', handleClickOutside);
+        document.removeEventListener('keydown', handleEscape);
+      };
+    } else {
+      document.body.style.overflow = '';
+    }
+  }, [isOpen]);
+
+  const handleToggle = () => {
+    setIsOpen((prev) => !prev);
+  };
+
+  const handleClose = () => {
+    setIsOpen(false);
+  };

  return (
    <div className="relative md:hidden">
      <button
+        ref={buttonRef}
        type="button"
-        onClick={() => setIsOpen((prev) => !prev)}
+        onClick={handleToggle}
-        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition focus:outline-none"
+        className="relative z-[60] inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
        aria-expanded={isOpen}
      >
        {/* ... ハンバーガーアイコン ... */}
      </button>

+      {/* オーバーレイ（メニュー外の暗い背景） */}
+      {isOpen && (
+        <div
+          className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
+          onClick={handleClose}
+          aria-hidden="true"
+        />
+      )}
+
      {/* メニュー本体 */}
      <div
+        ref={menuRef}
        className={cn(
-          'absolute left-0 right-0 top-full origin-top bg-black/85 px-6 py-6 text-white backdrop-blur-lg transition-all duration-200',
+          'fixed left-0 right-0 top-[73px] z-[60] origin-top bg-black/85 px-6 py-6 text-white backdrop-blur-lg transition-all duration-200 md:hidden',
          isOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
-              onClick={() => setIsOpen(false)}
+              onClick={handleClose}
+              className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
-            onClick={() => setIsOpen(false)}
+            onClick={handleClose}
+            className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
```

---

## 🎨 3. UI 改善（オプション）

### 改善提案

以下の改善は、元の動作を壊さずに追加できるオプション機能です。

#### 1. スクロール方向に応じたヘッダーの透明度変化

```typescript
// SiteHeader.tsx に追加
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// className に追加
className={cn(
  'fixed left-0 right-0 top-0 z-50 flex items-center justify-between whitespace-nowrap px-6 py-4 sm:px-10 transition-colors duration-300',
  scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
)}
```

#### 2. ハンバーガーアイコンのアニメーション強化

- 現在の実装で十分ですが、必要に応じて `framer-motion` を使用してより滑らかなアニメーションを実装可能

#### 3. スマホ表示でのクリック領域拡大

- 現在 `h-9 w-9` ですが、タッチデバイスでは `h-11 w-11` に拡大することを検討

#### 4. メニュー開閉時のトランジション改善

- 現在の `scale-y` アニメーションは良好ですが、必要に応じて `framer-motion` でより滑らかにできる

---

## 🧪 4. Regression チェック

### 確認すべきケース

#### ✅ iPhone Safari / Chrome での開閉

- **確認方法**:
  1. iPhone Safari でページを開く
  2. ハンバーガーメニューをタップ
  3. メニューが正しく開くことを確認
  4. メニュー外をタップして閉じることを確認
  5. ESC キー（キーボード接続時）で閉じることを確認

#### ✅ スクロール中に開閉

- **確認方法**:
  1. ページをスクロール
  2. スクロール中にハンバーガーメニューを開く
  3. メニューが正しく表示されることを確認
  4. 背景のスクロールが無効化されていることを確認

#### ✅ メニュー開いた状態でページ遷移

- **確認方法**:
  1. メニューを開く
  2. メニュー内のリンクをクリック
  3. ページ遷移後、メニューが閉じていることを確認
  4. body の overflow が正常に戻っていることを確認

#### ✅ メニュー外をクリック → 閉じる挙動

- **確認方法**:
  1. メニューを開く
  2. オーバーレイ（暗い背景）をクリック
  3. メニューが閉じることを確認
  4. メニュー外のコンテンツをクリック
  5. メニューが閉じることを確認

#### ✅ クラス競合でメニューが見えなくなる問題が再発しない

- **確認方法**:
  1. 開発者ツールで z-index を確認
  2. メニューが `z-[60]` で表示されていることを確認
  3. オーバーレイが `z-[55]` で表示されていることを確認
  4. ヘッダーが `z-50` で表示されていることを確認
  5. メニューが他の要素の後ろに隠れていないことを確認

#### ✅ キーボード操作

- **確認方法**:
  1. Tab キーでハンバーガーボタンにフォーカス
  2. Enter/Space でメニューを開く
  3. ESC キーでメニューを閉じる
  4. メニュー内のリンクに Tab でフォーカス移動
  5. Enter でリンクをクリック

#### ✅ body の overflow 制御

- **確認方法**:
  1. メニューを開く
  2. 開発者ツールで `document.body.style.overflow` が `'hidden'` になっていることを確認
  3. 背景がスクロールしないことを確認
  4. メニューを閉じる
  5. `document.body.style.overflow` が `''` に戻っていることを確認
  6. 背景がスクロールできることを確認

### 期待される動作

- ✅ メニューが正しく開閉する
- ✅ アニメーションが滑らかに動作する
- ✅ メニュー外クリックで閉じる
- ✅ ESC キーで閉じる
- ✅ メニュー開いている間、背景がスクロールしない
- ✅ メニューが他の要素の後ろに隠れない
- ✅ キーボード操作が正常に動作する
- ✅ アクセシビリティが向上している

---

## 📌 まとめ

### 修正完了

1. **z-index の問題**: 解決 ✅
   - メニューに `z-[60]` を設定
   - オーバーレイに `z-[55]` を設定

2. **overflow の問題**: 解決 ✅
   - `fixed` ポジショニングに変更
   - body の overflow を制御

3. **メニュー外クリック**: 実装 ✅
   - `useEffect` + `mousedown` イベントリスナー
   - オーバーレイクリックでも閉じる

4. **body の overflow 制御**: 実装 ✅
   - メニュー開閉時に `document.body.style.overflow` を制御

5. **ESC キーで閉じる**: 実装 ✅
   - `keydown` イベントリスナーを追加

6. **アクセシビリティ**: 改善 ✅
   - フォーカス時のリング表示
   - キーボード操作に対応

### 次のステップ

1. 上記の Regression チェックを実施
2. 問題がなければ、オプションの UI 改善を検討
3. 必要に応じて、スクロール方向に応じたヘッダーの透明度変化を実装
