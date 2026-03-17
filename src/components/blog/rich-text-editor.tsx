"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`px-2 py-1 rounded ${!isPreview ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          编辑
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`px-2 py-1 rounded ${isPreview ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          预览
        </button>
      </div>

      {isPreview ? (
        <div
          className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入文章内容，支持 HTML 格式..."
          className="min-h-[300px] font-mono text-sm"
        />
      )}
    </div>
  );
}
