/**
 * ATE9 LP カラーテーマ設定
 * 
 * 5色のカラーパレットを定義し、Tailwindカスタムカラーとして利用可能にする。
 * Admin画面からカラーテーマを差し替えやすいよう、1箇所にまとめて管理する。
 */

export const ate9Colors = {
  /** 背景: #000000 */
  bg: "#000000",
  /** 深く濃い赤（血・反逆・意志）: #8e1616 */
  redDark: "#8e1616",
  /** 鮮烈な赤（情熱・加速・火）: #ff0303 */
  redBright: "#ff0303",
  /** ダークグレー（階層表現）: #3c3d37 */
  gray: "#3c3d37",
  /** 白（タイポグラフィ・コントラスト）: #ffffff */
  white: "#ffffff",
} as const;

/**
 * Tailwind CSS v4 用のカラー定義
 * globals.css で @layer theme として使用する
 */
export const ate9Theme = {
  colors: {
    "ate9-bg": ate9Colors.bg,
    "ate9-red-dark": ate9Colors.redDark,
    "ate9-red": ate9Colors.redBright,
    "ate9-gray": ate9Colors.gray,
    "ate9-white": ate9Colors.white,
  },
} as const;

