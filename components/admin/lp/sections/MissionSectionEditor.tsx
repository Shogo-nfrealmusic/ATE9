"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MissionContent } from "@/types/landing";

type MissionSectionEditorProps = {
  mission: MissionContent;
  onChange: (mission: MissionContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function MissionSectionEditor({
  mission,
  onChange,
  onSave,
  isSaving,
}: MissionSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Mission セクション</h2>
        <p className="text-sm text-gray-500 mt-1">
          Mission セクションの見出しと説明文を編集します
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 編集フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>編集</CardTitle>
            <CardDescription>
              LP の Mission セクションに表示される内容を編集します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">
                Heading <span className="text-gray-400">(見出し)</span>
              </Label>
              <Textarea
                id="heading"
                value={mission.heading}
                onChange={(e) => onChange({ ...mission, heading: e.target.value })}
                rows={2}
                placeholder="俺たちは限界を壊すために存在する..."
              />
              <p className="text-xs text-gray-500">
                {mission.heading.length} 文字
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-gray-400">(説明文)</span>
              </Label>
              <Textarea
                id="description"
                value={mission.description}
                onChange={(e) => onChange({ ...mission, description: e.target.value })}
                rows={6}
                placeholder='ATE9 is not a "company," but a "movement"...'
              />
              <p className="text-xs text-gray-500">
                {mission.description.length} 文字
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
            <div className="bg-black text-white p-8 rounded-lg space-y-4 min-h-[300px] text-center flex flex-col justify-center">
              <h2 className="text-2xl font-bold">{mission.heading || "見出し"}</h2>
              <p className="text-gray-300 leading-relaxed">
                {mission.description || "説明文"}
              </p>
              <div className="w-24 h-0.5 bg-red-600 mx-auto mt-4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

