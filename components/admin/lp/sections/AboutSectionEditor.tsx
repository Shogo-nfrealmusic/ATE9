"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutContent } from "@/types/landing";

type AboutSectionEditorProps = {
  about: AboutContent;
  onChange: (about: AboutContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function AboutSectionEditor({
  about,
  onChange,
  onSave,
  isSaving,
}: AboutSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">About セクション</h2>
        <p className="text-sm text-gray-500 mt-1">
          About セクションの見出しと説明文を編集します
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 編集フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>編集</CardTitle>
            <CardDescription>
              LP の About セクションに表示される内容を編集します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">
                Heading <span className="text-gray-400">(見出し)</span>
              </Label>
              <Textarea
                id="heading"
                value={about.heading}
                onChange={(e) => onChange({ ...about, heading: e.target.value })}
                rows={2}
                placeholder='ATE9 は会社ではない。挑戦者の"家"だ。'
              />
              <p className="text-xs text-gray-500">
                {about.heading.length} 文字
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-gray-400">(説明文)</span>
              </Label>
              <Textarea
                id="description"
                value={about.description}
                onChange={(e) => onChange({ ...about, description: e.target.value })}
                rows={6}
                placeholder="ATE9 is not a company..."
              />
              <p className="text-xs text-gray-500">
                {about.description.length} 文字
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "保存中..." : "保存"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* プレビュー */}
        <Card>
          <CardHeader>
            <CardTitle>プレビュー</CardTitle>
            <CardDescription>
              編集内容のプレビュー（簡易表示）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-white p-8 rounded-lg space-y-4 min-h-[300px]">
              <h2 className="text-2xl font-bold">{about.heading || "見出し"}</h2>
              <div className="w-16 h-0.5 bg-red-600"></div>
              <p className="text-gray-300 leading-relaxed">
                {about.description || "説明文"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

