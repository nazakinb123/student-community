"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked?: boolean;
}

export function LikeButton({
  postId,
  initialCount,
  initialLiked = false,
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function handleLike() {
    if (!session) {
      toast.error("请先登录");
      return;
    }

    // Optimistic update
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      const res = await fetch(`/api/treehole/${postId}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        // Revert on error
        setLiked(liked);
        setCount(count);
        toast.error(data.error || "操作失败");
      }
    } catch {
      setLiked(liked);
      setCount(count);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`h-8 px-2 ${liked ? "text-red-500" : "text-muted-foreground"}`}
    >
      <svg
        className="w-4 h-4 mr-1"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count}
    </Button>
  );
}
