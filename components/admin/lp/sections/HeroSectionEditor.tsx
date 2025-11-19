"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HeroContent } from "@/types/landing";

type HeroSectionEditorProps = {
  hero: HeroContent;
  onChange: (hero: HeroContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function HeroSectionEditor({
  hero,
  onChange,
  onSave,
  isSaving,
}: HeroSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Hero セクション</h2>
        <p className="text-sm text-gray-500 mt-1">
          Hero セクションの見出し・説明文・CTA を編集します
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 編集フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>編集</CardTitle>
            <CardDescription>
              LP の Hero セクションに表示される内容を編集します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">
                Heading <span className="text-gray-400">(メイン見出し)</span>
              </Label>
              <Textarea
                id="heading"
                value={hero.heading}
                onChange={(e) => onChange({ ...hero, heading: e.target.value })}
                rows={3}
                placeholder="夢なんて願わない。俺たちは、喰らって叶える。"
              />
              <p className="text-xs text-gray-500">
                {hero.heading.length} 文字
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subheading">
                Subheading <span className="text-gray-400">(サブコピー)</span>
              </Label>
              <Textarea
                id="subheading"
                value={hero.subheading}
                onChange={(e) => onChange({ ...hero, subheading: e.target.value })}
                rows={4}
                placeholder="We don't wish for dreams..."
              />
              <p className="text-xs text-gray-500">
                {hero.subheading.length} 文字
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaLabel">
                  CTA Label <span className="text-gray-400">(ボタンテキスト)</span>
                </Label>
                <Input
                  id="ctaLabel"
                  value={hero.ctaLabel}
                  onChange={(e) => onChange({ ...hero, ctaLabel: e.target.value })}
                  placeholder="Contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">
                  CTA Link <span className="text-gray-400">(リンク先)</span>
                </Label>
                <Input
                  id="ctaLink"
                  value={hero.ctaLink}
                  onChange={(e) => onChange({ ...hero, ctaLink: e.target.value })}
                  placeholder="#contact"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                Image URL <span className="text-gray-400">(画像URL)</span>
              </Label>
              <Input
                id="imageUrl"
                value={hero.imageUrl}
                onChange={(e) => onChange({ ...hero, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "保存中..." : "保存"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* プレビュー */}
        <Card>
          <CardHeader>
            <CardTitle>プレビュー</CardTitle>
            <CardDescription>
              編集内容のプレビュー（簡易表示）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-white p-8 rounded-lg space-y-4 min-h-[400px] flex flex-col justify-center">
              <h1 className="text-3xl font-bold">{hero.heading || "見出し"}</h1>
              <p className="text-gray-300">{hero.subheading || "サブコピー"}</p>
              {hero.ctaLabel && (
                <div className="pt-4">
                  <button className="bg-red-600 px-4 py-2 rounded text-sm font-bold">
                    {hero.ctaLabel}
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

