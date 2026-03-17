"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from "@/components/shared/like-button";
import { ReportButton } from "@/components/shared/report-button";
import { CommentSection } from "@/components/treehole/comment-section";
import Link from "next/link";

interface PostDetail {
  id: string;
  content: string;
  isAnonymous: boolean;
  author: { id: string; displayName: string } | null;
  hashtags: { hashtag: { id: string; name: string } }[];
  comments: {
    id: string;
    content: string;
    isAnonymous: boolean;
    author: { id: string; displayName: string } | null;
    parentId: string | null;
    createdAt: string;
  }[];
  _count: { comments: number; likes: number };
  createdAt: string;
}

export default function TreeholePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/treehole/${id}`);
      if (!res.ok) {
        router.push("/treehole");
        return;
      }
      const data = await res.json();
      setPost(data);
    } catch {
      router.push("/treehole");
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl py-6 px-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-3 p-6 border rounded-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        &larr; 返回
      </Button>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {post.author ? post.author.displayName.charAt(0) : "匿"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {post.author ? post.author.displayName : "匿名用户"}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>

          <p className="text-base whitespace-pre-wrap break-words mb-4">
            {post.content}
          </p>

          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.hashtags.map(({ hashtag }) => (
                <Link
                  key={hashtag.id}
                  href={`/treehole?hashtag=${encodeURIComponent(hashtag.name)}`}
                >
                  <Badge variant="secondary">#{hashtag.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 -ml-2">
            <LikeButton postId={post.id} initialCount={post._count.likes} />
            <ReportButton contentType="post" contentId={post.id} />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <CommentSection
        postId={post.id}
        comments={post.comments}
        onCommentAdded={fetchPost}
      />
    </div>
  );
}
