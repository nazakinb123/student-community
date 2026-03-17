import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "树洞",
    description: "畅所欲言，支持匿名。用 #话题 聚合讨论，点赞评论自由互动。",
    href: "/treehole",
    color: "from-blue-500 to-cyan-500",
    available: true,
  },
  {
    title: "博客",
    description: "分享你的知识和见解。支持富文本编辑、标签分类和连载系列。",
    href: "/blog",
    color: "from-purple-500 to-pink-500",
    available: true,
  },
  {
    title: "课评",
    description: "真实的课程评价平台，帮助同学们做出更好的选课决策。",
    href: "/courses",
    color: "from-green-500 to-emerald-500",
    available: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            学生社群
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          树洞 &middot; 课评 &middot; 博客 — 属于学生的社群平台
        </p>
        <div className="flex justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/treehole" />}>
            进入树洞
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/blog" />}>
            浏览博客
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardContent className="pt-6">
                    <div
                      className={`h-2 w-12 rounded-full bg-gradient-to-r ${feature.color} mb-4`}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      {!feature.available && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>学生社群平台</p>
        </div>
      </footer>
    </div>
  );
}
