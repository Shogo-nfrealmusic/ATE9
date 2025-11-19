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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ate9Colors } from "@/config/theme";
import type { ServiceItem, ServicesContent } from "@/types/landing";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

type ServicesSectionEditorProps = {
  services: ServicesContent;
  onChange: (services: ServicesContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

const colorOptions = [
  { value: ate9Colors.bg, label: "ATE9 Background (#000000)" },
  { value: ate9Colors.redDark, label: "ATE9 Deep Red (#8e1616)" },
  { value: ate9Colors.redBright, label: "ATE9 Bright Red (#ff0303)" },
  { value: ate9Colors.gray, label: "ATE9 Gray (#3c3d37)" },
  { value: ate9Colors.white, label: "ATE9 White (#ffffff)" },
];

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function ServicesSectionEditor({
  services,
  onChange,
  onSave,
  isSaving,
}: ServicesSectionEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<ServiceItem>({
    id: "",
    title: "",
    description: "",
    backgroundColor: ate9Colors.redBright,
    gallery: [],
  });

  const handleOpenDialog = (item?: ServiceItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: generateId(),
        title: "",
        description: "",
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
    if (editingItem) {
      // 編集
      const updatedItems = services.items.map((item) =>
        item.id === editingItem.id ? formData : item
      );
      onChange({ ...services, items: updatedItems });
    } else {
      // 新規追加
      onChange({ ...services, items: [...services.items, formData] });
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("このサービスを削除しますか？")) {
      onChange({
        ...services,
        items: services.items.filter((item) => item.id !== id),
      });
    }
  };

  const handleAddGalleryUrl = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ""] });
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Services セクション</h2>
        <p className="text-sm text-gray-500 mt-1">
          サービス紹介のテキストとカード一覧を編集します
        </p>
      </div>

      {/* イントロ編集 */}
      <Card>
        <CardHeader>
          <CardTitle>イントロテキスト</CardTitle>
          <CardDescription>
            Services セクションの上部に表示される説明文を編集します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intro">Intro Text</Label>
            <Textarea
              id="intro"
              value={services.intro}
              onChange={(e) => onChange({ ...services, intro: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-gray-500">{services.intro.length} 文字</p>
          </div>
        </CardContent>
      </Card>

      {/* サービス一覧テーブル */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>サービス一覧</CardTitle>
            <CardDescription>
              サービスカードの一覧を管理します
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </CardHeader>
        <CardContent>
          {services.items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              サービスが登録されていません。「Add Service」ボタンで追加してください。
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Background Color</TableHead>
                  <TableHead>Gallery</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: item.backgroundColor }}
                          />
                          <span className="text-xs text-gray-500">
                            {item.backgroundColor}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.gallery.length} 枚</TableCell>
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
              {editingItem ? "サービスを編集" : "新しいサービスを追加"}
            </DialogTitle>
            <DialogDescription>
              サービスカードの情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Creative Direction"
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
                placeholder="サービスの説明..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color *</Label>
              <Select
                value={formData.backgroundColor}
                onValueChange={(value) =>
                  setFormData({ ...formData, backgroundColor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGalleryUrl}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
              <div className="space-y-2">
                {formData.gallery.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) =>
                        handleUpdateGalleryUrl(index, e.target.value)
                      }
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
                  <p className="text-xs text-gray-500">
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

