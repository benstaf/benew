import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const POSTS_DIR = path.resolve(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: number;
}

export interface Post extends PostMeta {
  content: string;
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parsePost(filename: string): Post | null {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.title || !data.date) return null;

  const html = sanitizeHtml(marked(content) as string, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1", "h2", "h3", "h4", "h5", "h6", "img", "pre", "code",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
      code: ["class"],
      pre: ["class"],
    },
  });

  return {
    slug,
    title: data.title,
    description: data.description || "",
    date: data.date,
    author: data.author || "YC Bench Team",
    readTime: estimateReadTime(content),
    content: html,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsePost(f))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _content, ...meta }) => meta);
}

export function getPost(slug: string): Post | null {
  const filename = `${slug}.md`;
  const filePath = path.join(POSTS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(filename);
}
