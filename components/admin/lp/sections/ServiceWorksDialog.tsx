'use client';

import {
  linkPortfolioItemToServiceAction,
  savePortfolioItemsForServiceAction,
} from '@/app/actions/landing';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn, generateRandomId } from '@/lib/utils';
import type { PortfolioItem, ServiceItem } from '@/types/landing';
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  adminCardPaddingClass,
  adminCardSurfaceClass,
  adminDialogSurfaceClass,
  adminMutedTextClass,
} from '../adminStyles';

type ServiceWorksDialogProps = {
  open: boolean;
  serviceId: string | null;
  serviceTitle: string;
  serviceSlug?: string;
  items: PortfolioItem[];
  services: ServiceItem[];
  onItemsSaved: (params: { serviceId: string | null; items: PortfolioItem[] }) => void;
  onPortfolioRelinked?: (params: { itemId: string; targetServiceId: string }) => void;
  onClose: () => void;
};

type ItemFormState = {
  mode: 'create' | 'edit';
  value: PortfolioItem;
};

const ensureServiceKey = (value: string | null | undefined) => value ?? null;

const createEmptyPortfolioItem = (serviceId: string | null): PortfolioItem => ({
  id: generateRandomId(),
  title: { ja: '', en: '' },
  description: { ja: '', en: '' },
  imageUrl: '',
  linkUrl: '',
  serviceId,
});

export function ServiceWorksDialog({
  open,
  serviceId,
  serviceTitle,
  serviceSlug,
  items,
  services,
  onItemsSaved,
  onPortfolioRelinked,
  onClose,
}: ServiceWorksDialogProps): JSX.Element {
  const normalizedServiceId = ensureServiceKey(serviceId);
  const isUnlinkedView = normalizedServiceId === null;
  const [localItems, setLocalItems] = useState<PortfolioItem[]>(items);
  const [formState, setFormState] = useState<ItemFormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [linkSelections, setLinkSelections] = useState<Record<string, string>>({});
  const [linkingItemId, setLinkingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLocalItems(items);
      setFormState(null);
      setLinkSelections({});
    }
  }, [items, open]);

  const emptyStateDescription = useMemo(() => {
    if (normalizedServiceId) {
      return `${serviceTitle} に紐づく Works はまだありません。`;
    }
    return 'いずれのサービスにも紐づいていない Works はまだありません。';
  }, [normalizedServiceId, serviceTitle]);

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const updated = [...localItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) {
      return;
    }
    const temp = updated[targetIndex];
    updated[targetIndex] = updated[index];
    updated[index] = temp;
    setLocalItems(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('この Works カードを削除しますか？')) {
      return;
    }
    setLocalItems((prev) => prev.filter((item) => item.id !== id));
    if (formState?.value.id === id) {
      setFormState(null);
    }
  };

  const beginCreate = () => {
    setFormState({
      mode: 'create',
      value: {
        ...createEmptyPortfolioItem(normalizedServiceId),
      },
    });
  };

  const beginEdit = (item: PortfolioItem) => {
    setFormState({
      mode: 'edit',
      value: {
        ...item,
        title: {
          ja: item.title.ja ?? '',
          en: item.title.en ?? '',
        },
        description: {
          ja: item.description.ja ?? '',
          en: item.description.en ?? '',
        },
        imageUrl: item.imageUrl ?? '',
        linkUrl: item.linkUrl ?? '',
      },
    });
  };

  const handleLocalizedChange = (
    field: 'title' | 'description',
    locale: 'ja' | 'en',
    value: string,
  ) => {
    if (!formState) {
      return;
    }
    setFormState({
      ...formState,
      value: {
        ...formState.value,
        [field]: {
          ...formState.value[field],
          [locale]: value,
        },
      },
    });
  };

  const handleInputChange = (field: 'imageUrl' | 'linkUrl', value: string) => {
    if (!formState) {
      return;
    }
    setFormState({
      ...formState,
      value: {
        ...formState.value,
        [field]: value,
      },
    });
  };

  const handleFormSubmit = () => {
    if (!formState) {
      toast.error('編集するカードを選択してください。');
      return;
    }

    const trimmedTitleJa = formState.value.title.ja.trim();
    const trimmedImage = formState.value.imageUrl.trim();

    if (!trimmedTitleJa) {
      toast.error('Title (日本語) は必須です。');
      return;
    }
    if (!trimmedImage) {
      toast.error('Image URL は必須です。');
      return;
    }

    const descriptionJa = formState.value.description.ja?.trim() ?? '';

    const normalizedItem: PortfolioItem = {
      ...formState.value,
      title: {
        ja: trimmedTitleJa,
        en: formState.value.title.en?.trim() || trimmedTitleJa,
      },
      description: {
        ja: descriptionJa,
        en: formState.value.description.en?.trim() || descriptionJa,
      },
      imageUrl: trimmedImage,
      linkUrl: formState.value.linkUrl?.toString().trim() || undefined,
      serviceId: normalizedServiceId,
    };

    if (formState.mode === 'edit') {
      setLocalItems((prev) =>
        prev.map((item) => (item.id === normalizedItem.id ? normalizedItem : item)),
      );
    } else {
      setLocalItems((prev) => [...prev, normalizedItem]);
    }
    setFormState(null);
  };

  const handleCancelForm = () => setFormState(null);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = localItems.map((item) => {
        const titleJa = item.title.ja.trim();
        const descriptionJa = item.description.ja?.trim() ?? '';
        const linkUrl = item.linkUrl?.trim();
        return {
          ...item,
          title: {
            ja: titleJa,
            en: item.title.en?.trim() || titleJa,
          },
          description: {
            ja: descriptionJa,
            en: item.description.en?.trim() || descriptionJa,
          },
          imageUrl: item.imageUrl.trim(),
          linkUrl: linkUrl || undefined,
          serviceId: normalizedServiceId,
        };
      });

      const saved = await savePortfolioItemsForServiceAction({
        serviceId: normalizedServiceId,
        serviceSlug: serviceSlug,
        items: payload,
      });

      onItemsSaved({ serviceId: normalizedServiceId, items: saved });
      toast.success(`${serviceTitle} の Works を保存しました`);
      onClose();
    } catch (error) {
      toast.error('保存に失敗しました', {
        description: error instanceof Error ? error.message : '不明なエラーが発生しました',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkSelectionChange = (itemId: string, value: string) => {
    setLinkSelections((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleLinkToService = async (item: PortfolioItem, targetServiceId: string) => {
    const targetService = services.find((service) => service.id === targetServiceId);
    if (!targetService) {
      toast.error('選択したサービスが見つかりません。');
      return;
    }

    setLinkingItemId(item.id);
    try {
      await linkPortfolioItemToServiceAction({
        portfolioItemId: item.id,
        targetServiceId,
        targetServiceSlug: targetService.slug ?? undefined,
      });

      const nextItems = localItems.filter((entry) => entry.id !== item.id);
      setLocalItems(nextItems);
      setLinkSelections((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      onPortfolioRelinked?.({ itemId: item.id, targetServiceId });
      onItemsSaved({
        serviceId: normalizedServiceId,
        items: nextItems,
      });
      toast.success(`${item.title.ja || ''} を ${targetService.title.ja || ''} に紐づけました`);
    } catch (error) {
      toast.error('紐づけに失敗しました', {
        description: error instanceof Error ? error.message : '不明なエラーが発生しました',
      });
    } finally {
      setLinkingItemId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent className={cn(adminDialogSurfaceClass, 'max-h-[95vh] w-full max-w-5xl')}>
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold text-neutral-900">
            {serviceTitle}
          </DialogTitle>
          <DialogDescription className={adminMutedTextClass}>
            保存してもこのサービス（または未紐付け）の Works
            のみが更新され、他のサービスには影響しません。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          <div
            className={cn(
              adminCardSurfaceClass,
              adminCardPaddingClass,
              'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
            )}
          >
            <div>
              <p className="text-sm font-medium text-neutral-500">現在のカード数</p>
              <p className="text-2xl font-semibold text-neutral-900">{localItems.length} 件</p>
            </div>
            <Button onClick={beginCreate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              新規カード
            </Button>
          </div>

          {localItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
              {emptyStateDescription}
            </p>
          ) : isUnlinkedView ? (
            <div className="space-y-4">
              {localItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    adminCardSurfaceClass,
                    adminCardPaddingClass,
                    'flex flex-col gap-4 md:flex-row md:items-start md:justify-between',
                  )}
                >
                  <div className="flex flex-1 items-start gap-4">
                    {item.imageUrl ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.title.ja || 'portfolio item'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-xs font-medium text-neutral-500">
                        No Image
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-neutral-900">
                        {item.title.ja || '-'}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {item.description.ja?.slice(0, 96) || '説明がまだありません。'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Link:{' '}
                        {item.linkUrl ? (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-ate9-red underline-offset-4 hover:underline"
                          >
                            開く
                          </a>
                        ) : (
                          '未設定'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3 md:w-72">
                    {services.length > 0 ? (
                      <Select
                        value={linkSelections[item.id] ?? ''}
                        onValueChange={(value) => handleLinkSelectionChange(item.id, value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="紐づけ先サービスを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.title.ja || '-'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-xs text-neutral-500">紐づけ可能なサービスがありません。</p>
                    )}
                    <Button
                      type="button"
                      variant="default"
                      disabled={
                        !linkSelections[item.id] ||
                        linkingItemId === item.id ||
                        services.length === 0
                      }
                      onClick={() => {
                        const targetService = linkSelections[item.id];
                        if (targetService) {
                          void handleLinkToService(item, targetService);
                        }
                      }}
                    >
                      {linkingItemId === item.id ? '紐づけ中...' : '紐づけ'}
                    </Button>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium text-neutral-500">
                        表示順 #{index + 1}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReorder(index, 'up')}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReorder(index, 'down')}
                          disabled={index === localItems.length - 1}
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => beginEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn(adminCardSurfaceClass, 'overflow-hidden')}>
              <div className={adminCardPaddingClass}>
                <Table className="text-sm text-neutral-700">
                  <TableHeader className="[&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-neutral-500">
                    <TableRow>
                      <TableHead>Thumbnail</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Sort</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&_td]:align-top [&_td]:text-neutral-700">
                    {localItems.map((item, index) => (
                      <TableRow key={item.id} className="bg-white">
                        <TableCell>
                          {item.imageUrl ? (
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                              <Image
                                src={item.imageUrl}
                                alt={item.title.ja || 'portfolio item'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 text-xs font-medium text-neutral-500">
                              No Image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-neutral-900">
                          {item.title.ja || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          {item.description.ja?.slice(0, 48) || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          {item.linkUrl ? (
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-ate9-red underline-offset-4 hover:underline"
                            >
                              Open
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-neutral-500">{index + 1}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleReorder(index, 'up')}
                              disabled={index === 0}
                              aria-label="Move up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleReorder(index, 'down')}
                              disabled={index === localItems.length - 1}
                              aria-label="Move down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => beginEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className={cn(adminCardSurfaceClass, adminCardPaddingClass)}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-neutral-900">カード詳細を編集</p>
                <p className={adminMutedTextClass}>
                  編集したいカードを選択するか、「新規カード」ボタンを押してください。
                </p>
              </div>
            </div>

            {formState ? (
              <div className="mt-4 space-y-4">
                <Tabs defaultValue="ja" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="ja">日本語</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ja" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="works-title_ja" className="text-neutral-800">
                          Title <span className="text-neutral-500">(日本語) *</span>
                        </Label>
                        <Input
                          id="works-title_ja"
                          value={formState.value.title.ja}
                          onChange={(e) => handleLocalizedChange('title', 'ja', e.target.value)}
                          placeholder="プロジェクト名"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="works-image" className="text-neutral-800">
                          Image URL <span className="text-neutral-500">*</span>
                        </Label>
                        <Input
                          id="works-image"
                          value={formState.value.imageUrl}
                          onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="works-description_ja" className="text-neutral-800">
                        Description <span className="text-neutral-500">(日本語)</span>
                      </Label>
                      <Textarea
                        id="works-description_ja"
                        rows={3}
                        value={formState.value.description.ja}
                        onChange={(e) => handleLocalizedChange('description', 'ja', e.target.value)}
                        placeholder="プロジェクトの説明..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="works-title_en" className="text-neutral-800">
                          Title <span className="text-neutral-500">(English)</span>
                        </Label>
                        <Input
                          id="works-title_en"
                          value={formState.value.title.en ?? ''}
                          onChange={(e) => handleLocalizedChange('title', 'en', e.target.value)}
                          placeholder="Project Alpha"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="works-image_en" className="text-neutral-800">
                          Image URL <span className="text-neutral-500">(共通)</span>
                        </Label>
                        <Input
                          id="works-image_en"
                          value={formState.value.imageUrl}
                          disabled
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="works-description_en" className="text-neutral-800">
                        Description <span className="text-neutral-500">(English)</span>
                      </Label>
                      <Textarea
                        id="works-description_en"
                        rows={3}
                        value={formState.value.description.en ?? ''}
                        onChange={(e) => handleLocalizedChange('description', 'en', e.target.value)}
                        placeholder="Project description..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="works-link" className="text-neutral-800">
                    Link URL (任意 - 共通)
                  </Label>
                  <Input
                    id="works-link"
                    value={formState.value.linkUrl ?? ''}
                    onChange={(e) => handleInputChange('linkUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                {formState.value.imageUrl && (
                  <div className="md:col-span-2">
                    <p className={adminMutedTextClass}>プレビュー</p>
                    <div className="relative mt-2 h-40 w-full overflow-hidden rounded-xl border border-neutral-200">
                      <Image
                        src={formState.value.imageUrl}
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelForm}>
                    キャンセル
                  </Button>
                  <Button onClick={handleFormSubmit}>
                    {formState.mode === 'edit' ? '更新' : '追加'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className={cn('mt-4', adminMutedTextClass)}>
                編集対象のカードが選択されていません。上の一覧からカードを選ぶか、「新規カード」を追加してください。
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            閉じる
          </Button>
          <Button onClick={handleSaveAll} disabled={isSaving}>
            {isSaving ? '保存中...' : 'このサービスの Works を保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
