'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HeroContent } from '@/types/landing';
import type { JSX } from 'react';
import { CharacterCountTextarea } from '../CharacterCountTextarea';

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
}: HeroSectionEditorProps): JSX.Element {
  const headingJa = hero.heading.ja ?? '';
  const headingEn = hero.heading.en ?? '';
  const subheadingJa = hero.subheading.ja ?? '';
  const subheadingEn = hero.subheading.en ?? '';
  const ctaLabelJa = hero.ctaLabel.ja ?? '';
  const ctaLabelEn = hero.ctaLabel.en ?? '';

  const updateLocalizedField = (
    field: keyof HeroContent,
    locale: 'ja' | 'en',
    value: string,
  ): void => {
    onChange({
      ...hero,
      [field]: {
        ...(hero[field] as { ja: string; en: string }),
        [locale]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Hero セクション</h2>
        <p className="text-sm text-white/70 mt-1">
          Hero セクションの見出し・説明文・CTA を編集します
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 編集フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>編集</CardTitle>
            <CardDescription>LP の Hero セクションに表示される内容を編集します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="ja" className="space-y-4">
              <TabsList>
                <TabsTrigger value="ja">日本語</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="ja" className="space-y-4">
                <CharacterCountTextarea
                  id="heading_ja"
                  label={
                    <>
                      Heading <span className="text-text-body/70">(メイン見出し) *</span>
                    </>
                  }
                  value={headingJa}
                  onChange={(value) => updateLocalizedField('heading', 'ja', value)}
                  rows={3}
                  placeholder="夢なんて願わない。俺たちは、喰らって叶える。"
                />

                <CharacterCountTextarea
                  id="subheading_ja"
                  label={
                    <>
                      Subheading <span className="text-text-body/70">(サブコピー) *</span>
                    </>
                  }
                  value={subheadingJa}
                  onChange={(value) => updateLocalizedField('subheading', 'ja', value)}
                  rows={4}
                  placeholder="We don't wish for dreams..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaLabel_ja" className="text-text-headings">
                      CTA Label <span className="text-text-body/70">(ボタンテキスト) *</span>
                    </Label>
                    <Input
                      id="ctaLabel_ja"
                      value={ctaLabelJa}
                      onChange={(e) => updateLocalizedField('ctaLabel', 'ja', e.target.value)}
                      placeholder="Contact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaLink" className="text-text-headings">
                      CTA Link <span className="text-text-body/70">(リンク先)</span>
                    </Label>
                    <Input
                      id="ctaLink"
                      value={hero.ctaLink}
                      onChange={(e) => onChange({ ...hero, ctaLink: e.target.value })}
                      placeholder="#contact"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <CharacterCountTextarea
                  id="heading_en"
                  label={
                    <>
                      Heading <span className="text-text-body/70">(English)</span>
                    </>
                  }
                  value={headingEn}
                  onChange={(value) => updateLocalizedField('heading', 'en', value)}
                  rows={3}
                  placeholder="We don't wish for dreams. We devour them to achieve them."
                />

                <CharacterCountTextarea
                  id="subheading_en"
                  label={
                    <>
                      Subheading <span className="text-text-body/70">(English)</span>
                    </>
                  }
                  value={subheadingEn}
                  onChange={(value) => updateLocalizedField('subheading', 'en', value)}
                  rows={4}
                  placeholder="We don't wish for dreams. We devour them to achieve them..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaLabel_en" className="text-text-headings">
                      CTA Label <span className="text-text-body/70">(English)</span>
                    </Label>
                    <Input
                      id="ctaLabel_en"
                      value={ctaLabelEn}
                      onChange={(e) => updateLocalizedField('ctaLabel', 'en', e.target.value)}
                      placeholder="Contact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaLink_en" className="text-text-headings">
                      CTA Link <span className="text-text-body/70">(リンク先 - 共通)</span>
                    </Label>
                    <Input id="ctaLink_en" value={hero.ctaLink} disabled placeholder="#contact" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-text-headings">
                Image URL <span className="text-text-body/70">(画像URL - 共通)</span>
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
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* プレビュー */}
        <Card>
          <CardHeader>
            <CardTitle>プレビュー</CardTitle>
            <CardDescription>編集内容のプレビュー（簡易表示）</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-black text-white p-8 rounded-lg space-y-4 min-h-[400px] flex flex-col justify-center">
                <h1 className="text-3xl font-bold">{headingJa || '見出し'}</h1>
                <p className="text-white/80">{subheadingJa || 'サブコピー'}</p>
                {ctaLabelJa && (
                  <div className="pt-4">
                    <button className="bg-red-600 px-4 py-2 rounded text-sm font-bold">
                      {ctaLabelJa}
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-black text-white p-8 rounded-lg space-y-4 min-h-[400px] flex flex-col justify-center">
                <h1 className="text-3xl font-bold">{headingEn || headingJa || 'Heading'}</h1>
                <p className="text-white/80">{subheadingEn || subheadingJa || 'Subheading'}</p>
                {(ctaLabelEn || ctaLabelJa) && (
                  <div className="pt-4">
                    <button className="bg-red-600 px-4 py-2 rounded text-sm font-bold">
                      {ctaLabelEn || ctaLabelJa}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
