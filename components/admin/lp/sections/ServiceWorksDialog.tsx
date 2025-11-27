'use client';

import { savePortfolioItemsForServiceAction } from '@/app/actions/landing';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { generateRandomId } from '@/lib/utils';
import type { PortfolioItem } from '@/types/landing';
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type ServiceWorksDialogProps = {
  open: boolean;
  serviceId: string | null;
  serviceTitle: string;
  serviceSlug?: string;
  items: PortfolioItem[];
  onItemsSaved: (params: { serviceId: string | null; items: PortfolioItem[] }) => void;
  onClose: () => void;
};

type ItemFormState = {
  mode: 'create' | 'edit';
  value: PortfolioItem;
};

const ensureServiceKey = (value: string | null | undefined) => value ?? null;

export function ServiceWorksDialog({
  open,
  serviceId,
  serviceTitle,
  serviceSlug,
  items,
  onItemsSaved,
  onClose,
}: ServiceWorksDialogProps): JSX.Element {
  const normalizedServiceId = ensureServiceKey(serviceId);
  const [localItems, setLocalItems] = useState<PortfolioItem[]>(items);
  const [formState, setFormState] = useState<ItemFormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalItems(items);
      setFormState(null);
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
        id: generateRandomId(),
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        serviceId: normalizedServiceId,
      },
    });
  };

  const beginEdit = (item: PortfolioItem) => {
    setFormState({
      mode: 'edit',
      value: {
        ...item,
        linkUrl: item.linkUrl ?? '',
      },
    });
  };

  const handleFormChange = (field: keyof PortfolioItem, value: string) => {
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

    const trimmedTitle = formState.value.title.trim();
    const trimmedImage = formState.value.imageUrl.trim();

    if (!trimmedTitle) {
      toast.error('Title は必須です。');
      return;
    }
    if (!trimmedImage) {
      toast.error('Image URL は必須です。');
      return;
    }

    const normalizedItem: PortfolioItem = {
      ...formState.value,
      title: trimmedTitle,
      description: formState.value.description?.trim() ?? '',
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
      const payload = localItems.map((item) => ({
        ...item,
        title: item.title.trim(),
        description: item.description?.trim() ?? '',
        imageUrl: item.imageUrl.trim(),
        linkUrl: item.linkUrl?.trim() || undefined,
        serviceId: normalizedServiceId,
      }));

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

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{serviceTitle}</DialogTitle>
          <DialogDescription>
            保存してもこのサービス（または未紐付け）の Works
            のみが更新され、他のサービスには影響しません。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">現在のカード数</p>
              <p className="text-2xl font-semibold text-text-headings">{localItems.length} 件</p>
            </div>
            <Button onClick={beginCreate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              新規カード
            </Button>
          </div>

          {localItems.length === 0 ? (
            <p className="rounded-md border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
              {emptyStateDescription}
            </p>
          ) : (
            <Table className="text-text-body">
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-text-headings">{item.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.description ? item.description.slice(0, 48) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{index + 1}</TableCell>
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
          )}

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-text-headings">カード詳細を編集</p>
                <p className="text-sm text-muted-foreground">
                  編集したいカードを選択するか、「新規カード」ボタンを押してください。
                </p>
              </div>
            </div>

            {formState ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="works-title">Title *</Label>
                  <Input
                    id="works-title"
                    value={formState.value.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Project Alpha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="works-image">Image URL *</Label>
                  <Input
                    id="works-image"
                    value={formState.value.imageUrl}
                    onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="works-description">Description</Label>
                  <Textarea
                    id="works-description"
                    rows={3}
                    value={formState.value.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="プロジェクトの説明..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="works-link">Link URL (任意)</Label>
                  <Input
                    id="works-link"
                    value={formState.value.linkUrl ?? ''}
                    onChange={(e) => handleFormChange('linkUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                {formState.value.imageUrl && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">プレビュー</p>
                    <div className="relative mt-2 h-40 w-full overflow-hidden rounded border border-border">
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
              <p className="mt-4 text-sm text-muted-foreground">
                編集対象のカードが選択されていません。上の一覧からカードを選ぶか、「新規カード」を追加してください。
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
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
