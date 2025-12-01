'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AboutContent } from '@/types/landing';
import type { JSX } from 'react';
import { CharacterCountTextarea } from '../CharacterCountTextarea';

type AboutSectionEditorProps = {
  about: AboutContent;
  onChange: (about: AboutContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

const locales: { value: 'ja' | 'en'; label: string }[] = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

export function AboutSectionEditor({
  about,
  onChange,
  onSave,
  isSaving,
}: AboutSectionEditorProps): JSX.Element {
  const updateField = (field: keyof AboutContent, locale: 'ja' | 'en', value: string) => {
    onChange({
      ...about,
      [field]: {
        ...about[field],
        [locale]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">About セクション</h2>
        <p className="text-sm text-white/70 mt-1">About セクションの見出しと説明文を編集します</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>編集</CardTitle>
            <CardDescription>LP の About セクションに表示される内容を編集します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="ja" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                {locales.map((locale) => (
                  <TabsTrigger key={locale.value} value={locale.value}>
                    {locale.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {locales.map((locale) => (
                <TabsContent key={locale.value} value={locale.value} className="space-y-4">
                  <CharacterCountTextarea
                    id={`about-heading-${locale.value}`}
                    label={
                      <>
                        Heading{' '}
                        <span className="text-text-body/70">
                          {locale.value === 'ja' ? '（見出し - 日本語）' : '(Heading - English)'}
                        </span>
                      </>
                    }
                    value={about.heading[locale.value] ?? ''}
                    onChange={(value) => updateField('heading', locale.value, value)}
                    rows={2}
                    placeholder={
                      locale.value === 'ja'
                        ? 'ATE9 は会社ではない。挑戦者の"家"だ。'
                        : "ATE9 isn't just a company—it's a home for challengers."
                    }
                  />

                  <CharacterCountTextarea
                    id={`about-description-${locale.value}`}
                    label={
                      <>
                        Description{' '}
                        <span className="text-text-body/70">
                          {locale.value === 'ja'
                            ? '（説明文 - 日本語）'
                            : '(Description - English)'}
                        </span>
                      </>
                    }
                    value={about.description[locale.value] ?? ''}
                    onChange={(value) => updateField('description', locale.value, value)}
                    rows={6}
                    placeholder={
                      locale.value === 'ja' ? 'ATE9は挑戦者の家だ...' : 'ATE9 is not a company...'
                    }
                  />
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-end pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>プレビュー</CardTitle>
            <CardDescription>言語ごとの表示イメージ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {locales.map((locale) => (
              <div
                key={`preview-${locale.value}`}
                className="bg-black text-white p-6 rounded-lg space-y-3"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{locale.label}</p>
                <h2 className="text-xl font-bold">
                  {about.heading[locale.value] || (locale.value === 'ja' ? '見出し' : 'Heading')}
                </h2>
                <div className="w-16 h-0.5 bg-red-600"></div>
                <p className="text-white/80 leading-relaxed text-sm whitespace-pre-line">
                  {about.description[locale.value] ||
                    (locale.value === 'ja' ? '説明文' : 'Description')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
