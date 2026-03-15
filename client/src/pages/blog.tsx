import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Clock, Calendar } from "lucide-react";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  const { data: posts, isLoading, error } = useQuery<PostMeta[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="bg-[#FF6600] text-white font-bold text-[24px] rounded flex items-center justify-center w-10 h-10 select-none pb-0.5"
              style={{ fontFamily: '"Arimo", sans-serif', letterSpacing: "-0.05em" }}
            >
              YC
            </div>
            <span className="font-semibold text-lg tracking-tight">Bench</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-sm font-medium text-foreground">Blog</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights on startup velocity, cohort benchmarking, and predictive signals.
          </p>
        </div>

        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border border-border rounded-xl p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-destructive text-sm">Failed to load posts. Please try again.</div>
        )}

        {posts && posts.length === 0 && (
          <p className="text-muted-foreground">No posts yet. Check back soon.</p>
        )}

        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <article className="group bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
