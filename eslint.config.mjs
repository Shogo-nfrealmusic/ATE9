import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 使われていない変数は TypeScript 側のルールで厳しめにチェックする
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // ログの出しっぱなしを防ぐ。必要最低限の console は許可。
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],

      // any 多用の抑止（やむを得ない箇所では eslint-disable コメントで明示）
      "@typescript-eslint/no-explicit-any": "warn",

      // 関数の入出力型をできるだけ明示する
      "@typescript-eslint/explicit-module-boundary-types": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".pnp.cjs",
  ]),
]);

export default eslintConfig;
