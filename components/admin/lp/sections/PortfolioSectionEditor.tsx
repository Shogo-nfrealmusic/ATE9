'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { PortfolioContent, ServiceItem } from '@/types/landing';
import type { JSX } from 'react';
import { adminCardPaddingClass, adminCardSurfaceClass } from '../adminStyles';
import type { ManageWorksTarget } from '../types';

type PortfolioSectionEditorProps = {
  portfolio: PortfolioContent;
  services: ServiceItem[];
  onChange: (portfolio: PortfolioContent) => void;
  onSave: () => void;
  isSaving: boolean;
  onManageWorks: (target: ManageWorksTarget) => void;
};

const normalizeServiceKey = (value: string | null | undefined) => value ?? null;

export function PortfolioSectionEditor({
  portfolio,
  services,
  onChange,
  onSave,
  isSaving,
  onManageWorks,
}: PortfolioSectionEditorProps): JSX.Element {
  const totalItems = portfolio.items.length;
  const getWorksCount = (serviceId: string | null) =>
    portfolio.items.filter(
      (item) => normalizeServiceKey(item.serviceId) === normalizeServiceKey(serviceId),
    ).length;

  const headingJa = portfolio.heading.ja ?? '';
  const headingEn = portfolio.heading.en ?? '';
  const subheadingJa = portfolio.subheading.ja ?? '';
  const subheadingEn = portfolio.subheading.en ?? '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-headings">Portfolio セクション</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          見出し編集と、サービスごとの Works 管理に進むためのハブです。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>セクション見出し</CardTitle>
          <CardDescription>
            LP 「Portfolio」セクションの見出しとサブコピーを編集します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="ja" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ja">日本語</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>

            <TabsContent value="ja" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-heading_ja" className="text-text-headings">
                    Heading <span className="text-text-body/70">(日本語) *</span>
                  </Label>
                  <Input
                    id="portfolio-heading_ja"
                    value={headingJa}
                    onChange={(e) =>
                      onChange({
                        ...portfolio,
                        heading: {
                          ...portfolio.heading,
                          ja: e.target.value,
                        },
                      })
                    }
                    placeholder="Our Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-subheading_ja" className="text-text-headings">
                    Subheading <span className="text-text-body/70">(日本語) *</span>
                  </Label>
                  <Input
                    id="portfolio-subheading_ja"
                    value={subheadingJa}
                    onChange={(e) =>
                      onChange({
                        ...portfolio,
                        subheading: {
                          ...portfolio.subheading,
                          ja: e.target.value,
                        },
                      })
                    }
                    placeholder="実績一覧"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-heading_en" className="text-text-headings">
                    Heading <span className="text-text-body/70">(English)</span>
                  </Label>
                  <Input
                    id="portfolio-heading_en"
                    value={headingEn}
                    onChange={(e) =>
                      onChange({
                        ...portfolio,
                        heading: {
                          ...portfolio.heading,
                          en: e.target.value,
                        },
                      })
                    }
                    placeholder="Our Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-subheading_en" className="text-text-headings">
                    Subheading <span className="text-text-body/70">(English)</span>
                  </Label>
                  <Input
                    id="portfolio-subheading_en"
                    value={subheadingEn}
                    onChange={(e) =>
                      onChange({
                        ...portfolio,
                        subheading: {
                          ...portfolio.subheading,
                          en: e.target.value,
                        },
                      })
                    }
                    placeholder="A curated selection of our past work"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>サービス別 Works 管理</CardTitle>
          <CardDescription>
            各サービスの Works は個別に保存され、他サービスの紐づけや sort_order には影響しません。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn(adminCardSurfaceClass, adminCardPaddingClass)}>
            <p className="text-sm text-neutral-600">
              現在 {totalItems} 件のポートフォリオカードがあります。カードの並び順は
              <span className="font-semibold text-neutral-900">
                {' '}
                「サービス × sort_order」
              </span>{' '}
              単位で再計算されます。
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className={cn(
                  adminCardSurfaceClass,
                  adminCardPaddingClass,
                  'flex items-center justify-between gap-4',
                )}
              >
                <div>
                  <p className="text-lg font-semibold text-neutral-900">
                    {service.title.ja || '-'}
                  </p>
                  <p className="text-sm text-neutral-500">
                    紐づく Works: {getWorksCount(service.id)} 件
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    onManageWorks({
                      serviceId: service.id,
                      serviceTitle: `${service.title.ja || ''} Works`,
                      serviceSlug: service.slug || undefined,
                    })
                  }
                >
                  Works を管理
                </Button>
              </div>
            ))}
            <div
              className={cn(
                adminCardSurfaceClass,
                adminCardPaddingClass,
                'flex items-center justify-between gap-4 border-dashed border-neutral-300',
              )}
            >
              <div>
                <p className="text-lg font-semibold text-neutral-900">未紐付け Works</p>
                <p className="text-sm text-neutral-500">現在 {getWorksCount(null)} 件</p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  onManageWorks({
                    serviceId: null,
                    serviceTitle: '未紐付け Works',
                  })
                }
              >
                Works を管理
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? '保存中...' : '見出しを保存'}
        </Button>
      </div>
    </div>
  );
}
