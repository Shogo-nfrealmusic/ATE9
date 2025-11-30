'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { generateRandomId } from '@/lib/utils';
import type { BrandPhilosophyContent } from '@/types/landing';
import { Plus, Trash2 } from 'lucide-react';
import type { JSX } from 'react';
import { CharacterCountTextarea } from '../CharacterCountTextarea';

type BrandPhilosophySectionEditorProps = {
  brandPhilosophy: BrandPhilosophyContent;
  onChange: (brandPhilosophy: BrandPhilosophyContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

const variantOptions: {
  value: NonNullable<BrandPhilosophyContent['closingDescriptionParts'][number]['variant']>;
  label: string;
}[] = [
  { value: 'default', label: 'デフォルト' },
  { value: 'primary', label: '強調（白）' },
  { value: 'accent', label: 'アクセント（赤）' },
];

const locales: { value: 'ja' | 'en'; label: string }[] = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

const emptyLocalizedText = (): { ja: string; en: string } => ({ ja: '', en: '' });

type SimpleLocalizedField =
  | 'heading'
  | 'subheading'
  | 'introHeading'
  | 'structureLabel'
  | 'structureDescription'
  | 'closingTitle'
  | 'summaryLabel'
  | 'summaryDescription'
  | 'summarySupportingText'
  | 'summaryItemsLabel'
  | 'coreValuesLabel';

export function BrandPhilosophySectionEditor({
  brandPhilosophy,
  onChange,
  onSave,
  isSaving,
}: BrandPhilosophySectionEditorProps): JSX.Element {
  const updateSimpleLocalizedField = (
    field: SimpleLocalizedField,
    locale: 'ja' | 'en',
    value: string,
  ) => {
    onChange({
      ...brandPhilosophy,
      [field]: {
        ...(brandPhilosophy[field] as { ja: string; en: string }),
        [locale]: value,
      },
    });
  };

  const handleIntroParagraphChange = (index: number, locale: 'ja' | 'en', value: string) => {
    const nextParagraphs = [...brandPhilosophy.introParagraphs];
    const target = nextParagraphs[index] ?? emptyLocalizedText();
    nextParagraphs[index] = {
      ...target,
      [locale]: value,
    };
    onChange({ ...brandPhilosophy, introParagraphs: nextParagraphs });
  };

  const handleAddIntroParagraph = () => {
    onChange({
      ...brandPhilosophy,
      introParagraphs: [...brandPhilosophy.introParagraphs, emptyLocalizedText()],
    });
  };

  const handleRemoveIntroParagraph = (index: number) => {
    onChange({
      ...brandPhilosophy,
      introParagraphs: brandPhilosophy.introParagraphs.filter((_, i) => i !== index),
    });
  };

  const handleStructureItemLabelChange = (id: string, value: string) => {
    onChange({
      ...brandPhilosophy,
      structureItems: brandPhilosophy.structureItems.map((item) =>
        item.id === id ? { ...item, label: value } : item,
      ),
    });
  };

  const handleStructureItemLocalizedChange = (
    id: string,
    field: 'title' | 'description' | 'subDescription',
    locale: 'ja' | 'en',
    value: string,
  ) => {
    onChange({
      ...brandPhilosophy,
      structureItems: brandPhilosophy.structureItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: {
                ...(item[field] ?? emptyLocalizedText()),
                [locale]: value,
              },
            }
          : item,
      ),
    });
  };

  const handleAddStructureItem = () => {
    onChange({
      ...brandPhilosophy,
      structureItems: [
        ...brandPhilosophy.structureItems,
        {
          id: generateRandomId(),
          label: '',
          title: emptyLocalizedText(),
          description: emptyLocalizedText(),
          subDescription: emptyLocalizedText(),
        },
      ],
    });
  };

  const handleRemoveStructureItem = (id: string) => {
    onChange({
      ...brandPhilosophy,
      structureItems: brandPhilosophy.structureItems.filter((item) => item.id !== id),
    });
  };
  const handleClosingPartTextChange = (id: string, locale: 'ja' | 'en', value: string) => {
    onChange({
      ...brandPhilosophy,
      closingDescriptionParts: brandPhilosophy.closingDescriptionParts.map((part) =>
        part.id === id
          ? {
              ...part,
              text: {
                ...part.text,
                [locale]: value,
              },
            }
          : part,
      ),
    });
  };

  const handleClosingPartVariantChange = (
    id: string,
    value: BrandPhilosophyContent['closingDescriptionParts'][number]['variant'],
  ) => {
    onChange({
      ...brandPhilosophy,
      closingDescriptionParts: brandPhilosophy.closingDescriptionParts.map((part) =>
        part.id === id
          ? {
              ...part,
              variant: value,
            }
          : part,
      ),
    });
  };

  const handleAddClosingPart = () => {
    onChange({
      ...brandPhilosophy,
      closingDescriptionParts: [
        ...brandPhilosophy.closingDescriptionParts,
        { id: generateRandomId(), text: emptyLocalizedText(), variant: 'default' },
      ],
    });
  };

  const handleRemoveClosingPart = (id: string) => {
    onChange({
      ...brandPhilosophy,
      closingDescriptionParts: brandPhilosophy.closingDescriptionParts.filter(
        (part) => part.id !== id,
      ),
    });
  };

  const handleSummaryItemLabelChange = (id: string, value: string) => {
    onChange({
      ...brandPhilosophy,
      summaryItems: brandPhilosophy.summaryItems.map((item) =>
        item.id === id ? { ...item, label: value } : item,
      ),
    });
  };

  const handleSummaryItemLocalizedChange = (
    id: string,
    field: 'title' | 'description',
    locale: 'ja' | 'en',
    value: string,
  ) => {
    onChange({
      ...brandPhilosophy,
      summaryItems: brandPhilosophy.summaryItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: {
                ...item[field],
                [locale]: value,
              },
            }
          : item,
      ),
    });
  };

  const handleAddSummaryItem = () => {
    onChange({
      ...brandPhilosophy,
      summaryItems: [
        ...brandPhilosophy.summaryItems,
        {
          id: generateRandomId(),
          label: '',
          title: emptyLocalizedText(),
          description: emptyLocalizedText(),
        },
      ],
    });
  };

  const handleRemoveSummaryItem = (id: string) => {
    onChange({
      ...brandPhilosophy,
      summaryItems: brandPhilosophy.summaryItems.filter((item) => item.id !== id),
    });
  };

  const handleCoreValueChange = (index: number, locale: 'ja' | 'en', value: string) => {
    const nextValues = [...brandPhilosophy.coreValues];
    const target = nextValues[index] ?? emptyLocalizedText();
    nextValues[index] = {
      ...target,
      [locale]: value,
    };
    onChange({ ...brandPhilosophy, coreValues: nextValues });
  };

  const handleAddCoreValue = () => {
    onChange({
      ...brandPhilosophy,
      coreValues: [...brandPhilosophy.coreValues, emptyLocalizedText()],
    });
  };

  const handleRemoveCoreValue = (index: number) => {
    onChange({
      ...brandPhilosophy,
      coreValues: brandPhilosophy.coreValues.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Brand Philosophy セクション</h2>
        <p className="text-sm text-white/70 mt-1">
          ブランドフィロソフィーのテキストを細かく管理します
        </p>
      </div>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>概要</CardTitle>
          <CardDescription>セクションの見出しや冒頭コピーを編集します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="ja" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              {locales.map((locale) => (
                <TabsTrigger key={`overview-${locale.value}`} value={locale.value}>
                  {locale.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {locales.map((locale) => (
              <TabsContent
                key={`overview-content-${locale.value}`}
                value={locale.value}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`brand-heading-${locale.value}`}>Heading</Label>
                    <Input
                      id={`brand-heading-${locale.value}`}
                      value={brandPhilosophy.heading[locale.value] ?? ''}
                      onChange={(e) =>
                        updateSimpleLocalizedField('heading', locale.value, e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`brand-subheading-${locale.value}`}>Subheading</Label>
                    <Input
                      id={`brand-subheading-${locale.value}`}
                      value={brandPhilosophy.subheading[locale.value] ?? ''}
                      onChange={(e) =>
                        updateSimpleLocalizedField('subheading', locale.value, e.target.value)
                      }
                    />
                  </div>
                </div>
                <CharacterCountTextarea
                  id={`brand-intro-heading-${locale.value}`}
                  label="Intro Heading"
                  value={brandPhilosophy.introHeading[locale.value] ?? ''}
                  onChange={(value) =>
                    updateSimpleLocalizedField('introHeading', locale.value, value)
                  }
                  rows={3}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* イントロ段落 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>イントロダクション</CardTitle>
            <CardDescription>導入文を段落ごとに編集します</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddIntroParagraph}>
            <Plus className="w-4 h-4 mr-2" />
            段落を追加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {brandPhilosophy.introParagraphs.map((paragraph, index) => (
            <div key={`intro-${index}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Paragraph {index + 1}</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveIntroParagraph(index)}
                  disabled={brandPhilosophy.introParagraphs.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Tabs defaultValue="ja" className="space-y-2">
                <TabsList className="grid w-full grid-cols-2">
                  {locales.map((locale) => (
                    <TabsTrigger key={`intro-${index}-${locale.value}`} value={locale.value}>
                      {locale.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {locales.map((locale) => (
                  <TabsContent key={`intro-${index}-content-${locale.value}`} value={locale.value}>
                    <Textarea
                      value={paragraph[locale.value] ?? ''}
                      rows={3}
                      onChange={(e) =>
                        handleIntroParagraphChange(index, locale.value, e.target.value)
                      }
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Structure */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Structure セクション</CardTitle>
            <CardDescription>ATE の意味づけやタイムラインを編集します</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddStructureItem}>
            <Plus className="w-4 h-4 mr-2" />
            項目を追加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="ja" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              {locales.map((locale) => (
                <TabsTrigger key={`structure-base-${locale.value}`} value={locale.value}>
                  {locale.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {locales.map((locale) => (
              <TabsContent
                key={`structure-base-content-${locale.value}`}
                value={locale.value}
                className="grid gap-4 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <Label htmlFor={`structure-label-${locale.value}`}>ラベル</Label>
                  <Input
                    id={`structure-label-${locale.value}`}
                    value={brandPhilosophy.structureLabel[locale.value] ?? ''}
                    onChange={(e) =>
                      updateSimpleLocalizedField('structureLabel', locale.value, e.target.value)
                    }
                  />
                </div>
                <CharacterCountTextarea
                  id={`structure-description-${locale.value}`}
                  label="説明文"
                  value={brandPhilosophy.structureDescription[locale.value] ?? ''}
                  onChange={(value) =>
                    updateSimpleLocalizedField('structureDescription', locale.value, value)
                  }
                  rows={3}
                />
              </TabsContent>
            ))}
          </Tabs>

          <div className="space-y-4">
            {brandPhilosophy.structureItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Structure Item</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveStructureItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => handleStructureItemLabelChange(item.id, e.target.value)}
                    />
                  </div>
                </div>
                <Tabs defaultValue="ja" className="space-y-2">
                  <TabsList className="grid w-full grid-cols-2">
                    {locales.map((locale) => (
                      <TabsTrigger
                        key={`structure-${item.id}-${locale.value}`}
                        value={locale.value}
                      >
                        {locale.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {locales.map((locale) => (
                    <TabsContent
                      key={`structure-${item.id}-content-${locale.value}`}
                      value={locale.value}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={item.title[locale.value] ?? ''}
                          onChange={(e) =>
                            handleStructureItemLocalizedChange(
                              item.id,
                              'title',
                              locale.value,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sub Description (任意)</Label>
                        <Input
                          value={item.subDescription?.[locale.value] ?? ''}
                          onChange={(e) =>
                            handleStructureItemLocalizedChange(
                              item.id,
                              'subDescription',
                              locale.value,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={item.description[locale.value] ?? ''}
                          onChange={(e) =>
                            handleStructureItemLocalizedChange(
                              item.id,
                              'description',
                              locale.value,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Closing */}
      <Card>
        <CardHeader>
          <CardTitle>結びのコピー</CardTitle>
          <CardDescription>締めのテキストとハイライトを編集します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="ja" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              {locales.map((locale) => (
                <TabsTrigger key={`closing-title-${locale.value}`} value={locale.value}>
                  {locale.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {locales.map((locale) => (
              <TabsContent key={`closing-title-content-${locale.value}`} value={locale.value}>
                <CharacterCountTextarea
                  id={`closing-title-${locale.value}`}
                  label="Closing Title"
                  value={brandPhilosophy.closingTitle[locale.value] ?? ''}
                  onChange={(value) =>
                    updateSimpleLocalizedField('closingTitle', locale.value, value)
                  }
                  rows={2}
                />
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex items-center justify-between">
            <Label>Description Parts</Label>
            <Button size="sm" onClick={handleAddClosingPart}>
              <Plus className="w-4 h-4 mr-2" />
              パーツを追加
            </Button>
          </div>
          <div className="space-y-3">
            {brandPhilosophy.closingDescriptionParts.map((part) => (
              <div key={part.id} className="grid gap-3 md:grid-cols-[1fr_200px_auto] items-start">
                <Tabs defaultValue="ja" className="space-y-2">
                  <TabsList className="grid w-full grid-cols-2">
                    {locales.map((locale) => (
                      <TabsTrigger key={`closing-${part.id}-${locale.value}`} value={locale.value}>
                        {locale.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {locales.map((locale) => (
                    <TabsContent
                      key={`closing-${part.id}-content-${locale.value}`}
                      value={locale.value}
                    >
                      <Textarea
                        rows={2}
                        value={part.text[locale.value] ?? ''}
                        onChange={(e) =>
                          handleClosingPartTextChange(part.id, locale.value, e.target.value)
                        }
                      />
                    </TabsContent>
                  ))}
                </Tabs>
                <Select
                  value={part.variant ?? 'default'}
                  onValueChange={(value) =>
                    handleClosingPartVariantChange(
                      part.id,
                      value as (typeof variantOptions)[number]['value'],
                    )
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variantOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveClosingPart(part.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Philosophy Summary</CardTitle>
            <CardDescription>右カラムのサマリーを編集します</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddSummaryItem}>
            <Plus className="w-4 h-4 mr-2" />
            項目を追加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="ja" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              {locales.map((locale) => (
                <TabsTrigger key={`summary-base-${locale.value}`} value={locale.value}>
                  {locale.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {locales.map((locale) => (
              <TabsContent
                key={`summary-base-content-${locale.value}`}
                value={locale.value}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`summary-label-${locale.value}`}>Summary Label</Label>
                    <Input
                      id={`summary-label-${locale.value}`}
                      value={brandPhilosophy.summaryLabel[locale.value] ?? ''}
                      onChange={(e) =>
                        updateSimpleLocalizedField('summaryLabel', locale.value, e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`summary-items-label-${locale.value}`}>Items Label</Label>
                    <Input
                      id={`summary-items-label-${locale.value}`}
                      value={brandPhilosophy.summaryItemsLabel[locale.value] ?? ''}
                      onChange={(e) =>
                        updateSimpleLocalizedField(
                          'summaryItemsLabel',
                          locale.value,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <CharacterCountTextarea
                  id={`summary-description-${locale.value}`}
                  label="Summary Description"
                  value={brandPhilosophy.summaryDescription[locale.value] ?? ''}
                  onChange={(value) =>
                    updateSimpleLocalizedField('summaryDescription', locale.value, value)
                  }
                  rows={2}
                />
                <CharacterCountTextarea
                  id={`summary-supporting-${locale.value}`}
                  label="Summary Supporting Text"
                  value={brandPhilosophy.summarySupportingText[locale.value] ?? ''}
                  onChange={(value) =>
                    updateSimpleLocalizedField('summarySupportingText', locale.value, value)
                  }
                  rows={2}
                />
              </TabsContent>
            ))}
          </Tabs>

          <div className="space-y-4">
            {brandPhilosophy.summaryItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Summary Item</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveSummaryItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => handleSummaryItemLabelChange(item.id, e.target.value)}
                    />
                  </div>
                </div>
                <Tabs defaultValue="ja" className="space-y-2">
                  <TabsList className="grid w-full grid-cols-2">
                    {locales.map((locale) => (
                      <TabsTrigger
                        key={`summary-item-${item.id}-${locale.value}`}
                        value={locale.value}
                      >
                        {locale.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {locales.map((locale) => (
                    <TabsContent
                      key={`summary-item-${item.id}-content-${locale.value}`}
                      value={locale.value}
                      className="space-y-2"
                    >
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={item.title[locale.value] ?? ''}
                          onChange={(e) =>
                            handleSummaryItemLocalizedChange(
                              item.id,
                              'title',
                              locale.value,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={item.description[locale.value] ?? ''}
                          onChange={(e) =>
                            handleSummaryItemLocalizedChange(
                              item.id,
                              'description',
                              locale.value,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>タグ表示される価値観を編集します</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddCoreValue}>
            <Plus className="w-4 h-4 mr-2" />
            値を追加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="ja" className="space-y-2">
            <TabsList className="grid w-full grid-cols-2">
              {locales.map((locale) => (
                <TabsTrigger key={`core-label-${locale.value}`} value={locale.value}>
                  {locale.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {locales.map((locale) => (
              <TabsContent key={`core-label-content-${locale.value}`} value={locale.value}>
                <Label htmlFor={`core-values-label-${locale.value}`}>セクションラベル</Label>
                <Input
                  id={`core-values-label-${locale.value}`}
                  value={brandPhilosophy.coreValuesLabel[locale.value] ?? ''}
                  onChange={(e) =>
                    updateSimpleLocalizedField('coreValuesLabel', locale.value, e.target.value)
                  }
                />
              </TabsContent>
            ))}
          </Tabs>
          <div className="space-y-3">
            {brandPhilosophy.coreValues.map((value, index) => (
              <div
                key={`core-value-${index}`}
                className="rounded-lg border border-white/10 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-white/80">Value {index + 1}</Label>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCoreValue(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Tabs defaultValue="ja" className="space-y-2">
                  <TabsList className="grid w-full grid-cols-2">
                    {locales.map((locale) => (
                      <TabsTrigger key={`core-value-${index}-${locale.value}`} value={locale.value}>
                        {locale.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {locales.map((locale) => (
                    <TabsContent
                      key={`core-value-${index}-content-${locale.value}`}
                      value={locale.value}
                    >
                      <Input
                        value={value[locale.value] ?? ''}
                        onChange={(e) => handleCoreValueChange(index, locale.value, e.target.value)}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>
    </div>
  );
}
