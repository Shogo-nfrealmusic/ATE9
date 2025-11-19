"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent, PortfolioItem } from "@/types/landing";
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type PortfolioSectionEditorProps = {
  portfolio: PortfolioContent;
  onChange: (portfolio: PortfolioContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function PortfolioSectionEditor({
  portfolio,
  onChange,
  onSave,
  isSaving,
}: PortfolioSectionEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<PortfolioItem>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
  });

  const handleOpenDialog = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: generateId(),
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      // 編集
      const updatedItems = portfolio.items.map((item) =>
        item.id === editingItem.id ? formData : item
      );
      onChange({ ...portfolio, items: updatedItems });
    } else {
      // 新規追加
      onChange({ ...portfolio, items: [...portfolio.items, formData] });
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("このポートフォリオを削除しますか？")) {
      onChange({
        ...portfolio,
        items: portfolio.items.filter((item) => item.id !== id),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Portfolio セクション</h2>
        <p className="text-sm text-gray-500 mt-1">
          実績セクションの案件一覧を編集します
        </p>
      </div>

      {/* セクション見出し編集 */}
      <Card>
        <CardHeader>
          <CardTitle>セクション見出し</CardTitle>
          <CardDescription>
            Portfolio セクションの見出しとサブコピーを編集します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={portfolio.heading}
                onChange={(e) =>
                  onChange({ ...portfolio, heading: e.target.value })
                }
                placeholder="Portfolio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <Input
                id="subheading"
                value={portfolio.subheading}
                onChange={(e) =>
                  onChange({ ...portfolio, subheading: e.target.value })
                }
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
            <CardDescription>
              ポートフォリオカードの一覧を管理します
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio
          </Button>
        </CardHeader>
        <CardContent>
          {portfolio.items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              ポートフォリオが登録されていません。「Add Portfolio」ボタンで追加してください。
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
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
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.title || "-"}
                    </TableCell>
                    <TableCell>
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
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
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
          {isSaving ? "保存中..." : "すべて保存"}
        </Button>
      </div>

      {/* 編集モーダル */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "ポートフォリオを編集" : "新しいポートフォリオを追加"}
            </DialogTitle>
            <DialogDescription>
              ポートフォリオカードの情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project Alpha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="プロジェクトの説明..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
              {formData.imageUrl && (
                <div className="mt-2 w-32 h-32 relative rounded overflow-hidden border">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL (任意)</Label>
              <Input
                id="linkUrl"
                value={formData.linkUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkUrl: e.target.value || undefined })
                }
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

