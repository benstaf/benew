import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: number;
  content: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
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
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {isLoading && (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-lg font-semibold mb-2">Post not found</p>
            <p className="text-muted-foreground text-sm mb-6">This article may have been moved or removed.</p>
            <Link href="/blog" className="text-sm text-primary hover:underline">
              Back to all posts
            </Link>
          </div>
        )}

        {post && (
          <article>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} min read
              </span>
              <span>By {post.author}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-b border-border pb-10">
              {post.description}
            </p>

            <div
              className="prose prose-neutral max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-strong:font-semibold prose-strong:text-foreground
                prose-li:text-muted-foreground prose-p:text-muted-foreground
                prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        )}
      </main>

      <footer className="border-t border-border py-10 mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← All posts
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ycbench.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
