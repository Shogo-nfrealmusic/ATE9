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

export function BrandPhilosophySectionEditor({
  brandPhilosophy,
  onChange,
  onSave,
  isSaving,
}: BrandPhilosophySectionEditorProps): JSX.Element {
  const handleIntroParagraphChange = (index: number, value: string) => {
    const nextParagraphs = [...brandPhilosophy.introParagraphs];
    nextParagraphs[index] = value;
    onChange({ ...brandPhilosophy, introParagraphs: nextParagraphs });
  };

  const handleAddIntroParagraph = () => {
    onChange({
      ...brandPhilosophy,
      introParagraphs: [...brandPhilosophy.introParagraphs, ''],
    });
  };

  const handleRemoveIntroParagraph = (index: number) => {
    onChange({
      ...brandPhilosophy,
      introParagraphs: brandPhilosophy.introParagraphs.filter((_, i) => i !== index),
    });
  };

  const handleStructureItemChange = (
    id: string,
    field: 'label' | 'title' | 'description' | 'subDescription',
    value: string,
  ) => {
    onChange({
      ...brandPhilosophy,
      structureItems: brandPhilosophy.structureItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
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
          title: '',
          description: '',
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

  const handleClosingPartChange = (id: string, field: 'text' | 'variant', value: string) => {
    onChange({
      ...brandPhilosophy,
      closingDescriptionParts: brandPhilosophy.closingDescriptionParts.map((part) =>
        part.id === id
          ? {
              ...part,
              [field]:
                field === 'variant' ? (value as (typeof variantOptions)[number]['value']) : value,
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
        { id: generateRandomId(), text: '', variant: 'default' },
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

  const handleSummaryItemChange = (
    id: string,
    field: 'label' | 'title' | 'description',
    value: string,
  ) => {
    onChange({
      ...brandPhilosophy,
      summaryItems: brandPhilosophy.summaryItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const handleAddSummaryItem = () => {
    onChange({
      ...brandPhilosophy,
      summaryItems: [
        ...brandPhilosophy.summaryItems,
        { id: generateRandomId(), label: '', title: '', description: '' },
      ],
    });
  };

  const handleRemoveSummaryItem = (id: string) => {
    onChange({
      ...brandPhilosophy,
      summaryItems: brandPhilosophy.summaryItems.filter((item) => item.id !== id),
    });
  };

  const handleCoreValueChange = (index: number, value: string) => {
    const nextValues = [...brandPhilosophy.coreValues];
    nextValues[index] = value;
    onChange({ ...brandPhilosophy, coreValues: nextValues });
  };

  const handleAddCoreValue = () => {
    onChange({
      ...brandPhilosophy,
      coreValues: [...brandPhilosophy.coreValues, ''],
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand-heading">Heading</Label>
              <Input
                id="brand-heading"
                value={brandPhilosophy.heading}
                onChange={(e) => onChange({ ...brandPhilosophy, heading: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-subheading">Subheading</Label>
              <Input
                id="brand-subheading"
                value={brandPhilosophy.subheading}
                onChange={(e) => onChange({ ...brandPhilosophy, subheading: e.target.value })}
              />
            </div>
          </div>
          <CharacterCountTextarea
            id="brand-intro-heading"
            label="Intro Heading"
            value={brandPhilosophy.introHeading}
            onChange={(value) => onChange({ ...brandPhilosophy, introHeading: value })}
            rows={3}
          />
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
              <Textarea
                value={paragraph}
                rows={3}
                onChange={(e) => handleIntroParagraphChange(index, e.target.value)}
              />
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="structure-label">ラベル</Label>
              <Input
                id="structure-label"
                value={brandPhilosophy.structureLabel}
                onChange={(e) => onChange({ ...brandPhilosophy, structureLabel: e.target.value })}
              />
            </div>
            <CharacterCountTextarea
              id="structure-description"
              label="説明文"
              value={brandPhilosophy.structureDescription}
              onChange={(value) => onChange({ ...brandPhilosophy, structureDescription: value })}
              rows={3}
            />
          </div>

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
                      onChange={(e) => handleStructureItemChange(item.id, 'label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleStructureItemChange(item.id, 'title', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sub Description (任意)</Label>
                  <Input
                    value={item.subDescription ?? ''}
                    onChange={(e) =>
                      handleStructureItemChange(item.id, 'subDescription', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) =>
                      handleStructureItemChange(item.id, 'description', e.target.value)
                    }
                  />
                </div>
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
          <CharacterCountTextarea
            id="closing-title"
            label="Closing Title"
            value={brandPhilosophy.closingTitle}
            onChange={(value) => onChange({ ...brandPhilosophy, closingTitle: value })}
            rows={2}
          />
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
                <Textarea
                  rows={2}
                  value={part.text}
                  onChange={(e) => handleClosingPartChange(part.id, 'text', e.target.value)}
                />
                <Select
                  value={part.variant ?? 'default'}
                  onValueChange={(value) => handleClosingPartChange(part.id, 'variant', value)}
                >
                  <SelectTrigger>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="summary-label">Summary Label</Label>
              <Input
                id="summary-label"
                value={brandPhilosophy.summaryLabel}
                onChange={(e) => onChange({ ...brandPhilosophy, summaryLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-items-label">Items Label</Label>
              <Input
                id="summary-items-label"
                value={brandPhilosophy.summaryItemsLabel}
                onChange={(e) =>
                  onChange({ ...brandPhilosophy, summaryItemsLabel: e.target.value })
                }
              />
            </div>
          </div>
          <CharacterCountTextarea
            id="summary-description"
            label="Summary Description"
            value={brandPhilosophy.summaryDescription}
            onChange={(value) => onChange({ ...brandPhilosophy, summaryDescription: value })}
            rows={2}
          />
          <CharacterCountTextarea
            id="summary-supporting"
            label="Summary Supporting Text"
            value={brandPhilosophy.summarySupportingText}
            onChange={(value) => onChange({ ...brandPhilosophy, summarySupportingText: value })}
            rows={2}
          />

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
                      onChange={(e) => handleSummaryItemChange(item.id, 'label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleSummaryItemChange(item.id, 'title', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleSummaryItemChange(item.id, 'description', e.target.value)
                    }
                  />
                </div>
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
          <div className="space-y-2">
            <Label htmlFor="core-values-label">セクションラベル</Label>
            <Input
              id="core-values-label"
              value={brandPhilosophy.coreValuesLabel}
              onChange={(e) => onChange({ ...brandPhilosophy, coreValuesLabel: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            {brandPhilosophy.coreValues.map((value, index) => (
              <div key={`core-value-${index}`} className="flex gap-3">
                <Input
                  value={value}
                  onChange={(e) => handleCoreValueChange(index, e.target.value)}
                />
                <Button variant="ghost" size="sm" onClick={() => handleRemoveCoreValue(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
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
