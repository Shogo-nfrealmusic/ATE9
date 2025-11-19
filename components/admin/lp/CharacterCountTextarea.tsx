'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { JSX, ReactNode } from 'react';

type CharacterCountTextareaProps = {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

/**
 * ラベル付き Textarea + 文字数カウンター
 *
 * Hero / About / Mission など LP セクション編集フォームで繰り返し登場する
 * パターンを共通化し、JSX の重複と記述ミスを防ぐ。
 * UI の見た目と挙動は既存実装と同一になるように構造とクラス名を揃えている。
 */
export function CharacterCountTextarea({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
}: CharacterCountTextareaProps): JSX.Element {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-text-headings">
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
      <p className="text-xs text-text-body/70">{value.length} 文字</p>
    </div>
  );
}
