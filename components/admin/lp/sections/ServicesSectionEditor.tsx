'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { ate9Colors } from '@/config/theme';
import { generateRandomId } from '@/lib/utils';
import type { PortfolioItem, ServiceItem, ServicesContent } from '@/types/landing';
import { ArrowDown, ArrowUp, Edit, Plus, Trash2, X } from 'lucide-react';
import type { JSX } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ManageWorksTarget } from '../types';

type ServicesSectionEditorProps = {
  services: ServicesContent;
  portfolioItems: PortfolioItem[];
  onChange: (services: ServicesContent) => void;
  onSave: () => void;
  isSaving: boolean;
  onManageWorks: (target: ManageWorksTarget) => void;
};

const colorOptions = [
  { value: ate9Colors.bg, label: 'ATE9 Background (#000000)' },
  { value: ate9Colors.redDark, label: 'ATE9 Deep Red (#8e1616)' },
  { value: ate9Colors.redBright, label: 'ATE9 Bright Red (#ff0303)' },
  { value: ate9Colors.gray, label: 'ATE9 Gray (#3c3d37)' },
  { value: ate9Colors.white, label: 'ATE9 White (#ffffff)' },
];

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function ServicesSectionEditor({
  services,
  portfolioItems,
  onChange,
  onSave,
  isSaving,
  onManageWorks,
}: ServicesSectionEditorProps): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<ServiceItem>({
    id: '',
    slug: '',
    title: '',
    description: '',
    backgroundColor: ate9Colors.redBright,
    gallery: [],
  });

  const handleOpenDialog = (item?: ServiceItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item, slug: item.slug ?? '' });
    } else {
      setEditingItem(null);
      setFormData({
        id: generateRandomId(),
        slug: '',
        title: '',
        description: '',
        backgroundColor: ate9Colors.redBright,
        gallery: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    const slug = formData.slug.trim();
    if (!slug || !slugRegex.test(slug)) {
      toast.error('Slug は英小文字とハイフンのみで入力してください。');
      return;
    }
    if (!formData.title?.trim()) {
      toast.error('Title は必須です。');
      return;
    }
    if (!formData.description?.trim()) {
      toast.error('Description は必須です。');
      return;
    }

    const normalizedItem: ServiceItem = {
      ...formData,
      slug,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (editingItem) {
      // 編集
      const updatedItems = services.items.map((item) =>
        item.id === editingItem.id ? normalizedItem : item,
      );
      onChange({ ...services, items: updatedItems });
    } else {
      // 新規追加
      onChange({ ...services, items: [...services.items, normalizedItem] });
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('このサービスを削除しますか？')) {
      onChange({
        ...services,
        items: services.items.filter((item) => item.id !== id),
      });
    }
  };

  const handleAddGalleryUrl = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ''] });
  };

  const handleUpdateGalleryUrl = (index: number, value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleRemoveGalleryUrl = (index: number) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...services.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) {
      return;
    }
    const temp = newItems[targetIndex];
    newItems[targetIndex] = newItems[index];
    newItems[index] = temp;
    onChange({ ...services, items: newItems });
  };

  const getWorksCount = (serviceId: string | null) =>
    portfolioItems.filter((item) => (item.serviceId ?? null) === (serviceId ?? null)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-headings">Services セクション</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          サービス紹介のテキストとカード一覧を編集します
        </p>
      </div>

      {/* イントロ編集 */}
      <Card>
        <CardHeader>
          <CardTitle>イントロテキスト</CardTitle>
          <CardDescription>Services セクションの上部に表示される説明文を編集します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intro" className="text-text-headings">
              Intro Text
            </Label>
            <Textarea
              id="intro"
              value={services.intro}
              onChange={(e) => onChange({ ...services, intro: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{services.intro.length} 文字</p>
          </div>
        </CardContent>
      </Card>

      {/* サービス一覧テーブル */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>サービス一覧</CardTitle>
            <CardDescription>サービスカードの一覧を管理します</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </CardHeader>
        <CardContent>
          {services.items.length === 0 ? (
            <p className="text-sm text-text-body text-center py-8">
              サービスが登録されていません。「Add Service」ボタンで追加してください。
            </p>
          ) : (
            <Table className="text-text-body">
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Background Color</TableHead>
                  <TableHead>Gallery</TableHead>
                  <TableHead>Works</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs text-text-body">
                      {item.slug || '-'}
                    </TableCell>
                    <TableCell className="font-medium text-text-headings">
                      {item.title || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-ate9-gray/40"
                          style={{ backgroundColor: item.backgroundColor }}
                        />
                        <span className="text-xs text-text-headings">{item.backgroundColor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-body">{item.gallery.length} 枚</TableCell>
                    <TableCell className="text-text-body">
                      <div className="flex items-center justify-between gap-2">
                        <span>{getWorksCount(item.id)} 件</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onManageWorks({
                              serviceId: item.id,
                              serviceTitle: `${item.title} Works`,
                              serviceSlug: item.slug || undefined,
                            })
                          }
                        >
                          Works管理
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-body">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 text-text-body">
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
                          disabled={index === services.items.length - 1}
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-text-body">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>未紐付けの Works</CardTitle>
            <CardDescription>
              どのサービスにも属していないポートフォリオカードを管理します。
            </CardDescription>
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
            Works管理
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-body">
            現在 {getWorksCount(null)} 件のカードが未紐付けです。
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      {/* 編集モーダル */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'サービスを編集' : '新しいサービスを追加'}</DialogTitle>
            <DialogDescription>サービスカードの情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-text-headings">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Creative Direction"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-text-headings">
                Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  const normalized = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/--+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
                  setFormData({ ...formData, slug: normalized });
                }}
                placeholder="creative-production"
              />
              <p
                className={`text-xs ${
                  formData.slug && !slugRegex.test(formData.slug)
                    ? 'text-ate9-red-light'
                    : 'text-text-body/70'
                }`}
              >
                英小文字とハイフンのみ。例: creative-production
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-text-headings">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="サービスの説明..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor" className="text-text-headings">
                Background Color *
              </Label>
              <Select
                value={formData.backgroundColor}
                onValueChange={(value) => setFormData({ ...formData, backgroundColor: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Gallery Images (URLs)</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddGalleryUrl}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
              <div className="space-y-2">
                {formData.gallery.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => handleUpdateGalleryUrl(index, e.target.value)}
                      placeholder="https://..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGalleryUrl(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {formData.gallery.length === 0 && (
                  <p className="text-xs text-text-body/70">
                    画像URLがありません。Add URL ボタンで追加してください。
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              キャンセル
            </Button>
            <Button onClick={handleSaveItem}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
