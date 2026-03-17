"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/blog/rich-text-editor";
import { toast } from "sonner";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("标题和内容不能为空");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          isDraft,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "发布失败");
      } else {
        toast.success(isDraft ? "草稿已保存" : "文章已发布");
        router.push(`/blog/${data.article.slug}`);
      }
    } catch {
      toast.error("发布失败");
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto max-w-3xl py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>写文章</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="文章标题"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label>内容</Label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">标签（逗号分隔）</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="前端, React, 教程"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="draft"
                  checked={isDraft}
                  onCheckedChange={setIsDraft}
                />
                <Label htmlFor="draft" className="text-sm text-muted-foreground">
                  保存为草稿
                </Label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "保存中..."
                    : isDraft
                    ? "保存草稿"
                    : "发布文章"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
