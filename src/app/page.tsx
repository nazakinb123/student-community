import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "树洞",
    description: "匿名发帖，自由倾诉。支持 #话题 聚合、点赞、嵌套评论，内容经 AI 自动审核。",
    href: "/treehole",
    color: "from-[#57068c] to-[#7c3aed]",
    available: true,
  },
  {
    title: "博客",
    description: "分享你的知识与见解。支持富文本、标签分类、连载系列和评论互动。",
    href: "/blog",
    color: "from-[#7c3aed] to-[#a78bfa]",
    available: true,
  },
  {
    title: "课评",
    description: "真实的课程评价，帮助同学们做出更好的选课决策。",
    href: "/courses",
    color: "from-[#a78bfa] to-[#ddd3f1]",
    available: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-5 tracking-tight">
          <span className="bg-gradient-to-r from-[#57068c] to-[#7c3aed] bg-clip-text text-transparent">
            NYU树洞
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          匿名树洞 &middot; 博客 &middot; 课评<br />
          <span className="text-sm">NYU 学生专属社区平台</span>
        </p>
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#57068c] to-[#7c3aed] hover:opacity-90 transition-opacity border-0"
            nativeButton={false}
            render={<Link href="/treehole" />}
          >
            进入树洞
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#ddd3f1] hover:bg-secondary"
            nativeButton={false}
            render={<Link href="/blog" />}
          >
            浏览博客
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border-[#ddd3f1]">
                  <CardContent className="pt-6">
                    <div
                      className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${feature.color} mb-5`}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      {!feature.available && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
      <footer className="border-t border-[#ddd3f1] py-8 px-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>NYU树洞 · 学生社区平台</p>
        </div>
      </footer>
    </div>
  );
}
