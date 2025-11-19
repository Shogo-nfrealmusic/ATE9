"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MissionContent } from "@/types/landing";

type MissionEditorProps = {
  mission: MissionContent;
  onChange: (mission: MissionContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function MissionEditor({
  mission,
  onChange,
  onSave,
  isSaving,
}: MissionEditorProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Mission Section</CardTitle>
        <p className="text-sm text-text-body dark:text-gray-400">
          Missionセクションの見出しと説明文を編集します。
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-headings dark:text-white">
            Heading
          </label>
          <Input
            value={mission.heading}
            onChange={(event) =>
              onChange({ ...mission, heading: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-headings dark:text-white">
            Description
          </label>
          <Textarea
            value={mission.description}
            onChange={(event) =>
              onChange({ ...mission, description: event.target.value })
            }
            rows={5}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Mission"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

