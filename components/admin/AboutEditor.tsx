"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AboutContent } from "@/types/landing";

type AboutEditorProps = {
  about: AboutContent;
  onChange: (about: AboutContent) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function AboutEditor({
  about,
  onChange,
  onSave,
  isSaving,
}: AboutEditorProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <p className="text-sm text-text-body dark:text-gray-400">
          Aboutセクションの見出しと説明文を編集します。
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-headings dark:text-white">
            Heading
          </label>
          <Input
            value={about.heading}
            onChange={(event) =>
              onChange({ ...about, heading: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-headings dark:text-white">
            Description
          </label>
          <Textarea
            value={about.description}
            onChange={(event) =>
              onChange({ ...about, description: event.target.value })
            }
            rows={5}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save About"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

