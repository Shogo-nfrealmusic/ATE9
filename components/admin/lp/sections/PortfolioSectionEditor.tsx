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
import { generateRandomId } from '@/lib/utils';
import type { PortfolioContent, PortfolioItem, ServiceItem } from '@/types/landing';
import { Edit, ExternalLink, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';
import { useState } from 'react';

type PortfolioSectionEditorProps = {
  portfolio: PortfolioContent;
  services: ServiceItem[];
  onChange: (portfolio: PortfolioContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function PortfolioSectionEditor({
  portfolio,
  services,
  onChange,
  onSave,
  isSaving,
}: PortfolioSectionEditorProps): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<PortfolioItem>({
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    serviceId: undefined,
  });

  const handleOpenDialog = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: generateRandomId(),
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        serviceId: undefined,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    if (!formData.title?.trim()) {
      alert('Title は必須です。');
      return;
    }
    if (!formData.imageUrl?.trim()) {
      alert('Image URL は必須です。');
      return;
    }

    if (editingItem) {
      // 編集
      const updatedItems = portfolio.items.map((item) =>
        item.id === editingItem.id ? formData : item,
      );
      onChange({ ...portfolio, items: updatedItems });
    } else {
      // 新規追加
      onChange({ ...portfolio, items: [...portfolio.items, formData] });
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('このポートフォリオを削除しますか？')) {
      onChange({
        ...portfolio,
        items: portfolio.items.filter((item) => item.id !== id),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Portfolio セクション</h2>
        <p className="text-sm text-white/70 mt-1">実績セクションの案件一覧を編集します</p>
      </div>

      {/* セクション見出し編集 */}
      <Card>
        <CardHeader>
          <CardTitle>セクション見出し</CardTitle>
          <CardDescription>Portfolio セクションの見出しとサブコピーを編集します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heading" className="text-text-headings">
                Heading
              </Label>
              <Input
                id="heading"
                value={portfolio.heading}
                onChange={(e) => onChange({ ...portfolio, heading: e.target.value })}
                placeholder="Portfolio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subheading" className="text-text-headings">
                Subheading
              </Label>
              <Input
                id="subheading"
                value={portfolio.subheading}
                onChange={(e) => onChange({ ...portfolio, subheading: e.target.value })}
                placeholder="実績一覧"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ポートフォリオ一覧テーブル */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ポートフォリオ一覧</CardTitle>
            <CardDescription>ポートフォリオカードの一覧を管理します</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio
          </Button>
        </CardHeader>
        <CardContent>
          {portfolio.items.length === 0 ? (
            <p className="text-sm text-text-body text-center py-8">
              ポートフォリオが登録されていません。「Add Portfolio」ボタンで追加してください。
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Link URL</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <div className="w-16 h-16 relative rounded overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-text-body/70">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-text-headings">
                      {item.title || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-text-body">
                      {item.serviceId
                        ? (services.find((service) => service.id === item.serviceId)?.title ?? '—')
                        : '未紐付け'}
                    </TableCell>
                    <TableCell className="text-text-body">
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-xs">Open</span>
                        </a>
                      ) : (
                        <span className="text-xs text-text-body">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-text-body">{index + 1}</TableCell>
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

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg">
          {isSaving ? '保存中...' : 'すべて保存'}
        </Button>
      </div>

      {/* 編集モーダル */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'ポートフォリオを編集' : '新しいポートフォリオを追加'}
            </DialogTitle>
            <DialogDescription>ポートフォリオカードの情報を入力してください</DialogDescription>
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
                placeholder="Project Alpha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-text-headings">
                Description (任意)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="プロジェクトの説明..."
              />
              <p className="text-xs text-text-body/70">カード本文に表示されます。未入力でも可。</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceId" className="text-text-headings">
                Related Service
              </Label>
              <Select
                value={formData.serviceId ?? 'unassigned'}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    serviceId: value === 'unassigned' ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="未紐付け" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">未紐付け</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-text-body/70">
                サービス詳細ページの「Works」に表示する場合、紐付けたいサービスを選択してください。
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-text-headings">
                Image URL *
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-text-body/70">カードのサムネイルに使用されます。</p>
              {formData.imageUrl && (
                <div className="mt-2 w-32 h-32 relative rounded overflow-hidden border">
                  <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl" className="text-text-headings">
                Link URL (任意)
              </Label>
              <Input
                id="linkUrl"
                value={formData.linkUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value || undefined })}
                placeholder="https://example.com"
              />
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
