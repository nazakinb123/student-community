"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/treehole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, isAnonymous }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "发布失败");
      } else {
        if (data.flagged) {
          toast.warning("你的帖子已提交审核，审核通过后将会显示");
        } else {
          toast.success("发布成功");
        }
        setContent("");
        setIsAnonymous(false);
        onPostCreated();
      }
    } catch {
      toast.error("发布失败，请稍后重试");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="说点什么吧... 使用 #话题 添加标签"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            rows={3}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous" className="text-sm text-muted-foreground">
                匿名发布
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {content.length}/2000
              </span>
              <Button type="submit" size="sm" disabled={loading || !content.trim()}>
                {loading ? "发布中..." : "发布"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
