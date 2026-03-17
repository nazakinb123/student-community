"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  slug: string;
  title: string;
  excerpt?: string | null;
  author: { id: string; displayName: string; avatarUrl?: string | null };
  tags: { tag: { name: string } }[];
  series?: { title: string } | null;
  createdAt: string;
}

export default function BlogPageWrapper() {
  return (
    <Suspense>
      <BlogPage />
    </Suspense>
  );
}

function BlogPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get("tag");
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.set("search", search);
    if (tagFilter) params.set("tag", tagFilter);

    const res = await fetch(`/api/blog?${params}`);
    const data = await res.json();
    setArticles(data.articles || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page, search, tagFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="container mx-auto max-w-5xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">博客</h1>
          <p className="text-sm text-muted-foreground">
            阅读和分享有价值的文章
          </p>
        </div>
        {session && (
          <Button nativeButton={false} render={<Link href="/blog/new" />}>
            写文章
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="搜索文章标题..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        {tagFilter && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{tagFilter}</Badge>
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                清除
              </Button>
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">暂无文章</p>
          {session && (
            <p className="text-sm mt-1">
              <Link href="/blog/new" className="text-primary hover:underline">
                发布第一篇文章
              </Link>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                上一页
              </Button>
              <span className="flex items-center text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
