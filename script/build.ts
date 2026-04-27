import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import {
  rm,
  readFile,
  mkdir,
  copyFile,
  readdir,
  writeFile,
} from "fs/promises";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("processing blog posts...");
  const srcDir = path.resolve("content/posts");
  const destDir = path.resolve("dist/content/posts");
  const publicDestDir = path.resolve("dist/public/content/posts");

  await mkdir(destDir, { recursive: true });
  await mkdir(publicDestDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) => f.endsWith(".md"));

  const postsMeta: any[] = [];

  for (const file of files) {
    const fullPath = path.join(srcDir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const slug = file.replace(/\.md$/, "");
    const readTime = estimateReadTime(content);

    const post = {
      slug,
      title: data.title,
      description: data.description || "",
      date: data.date,
      author: data.author || "YC Bench Team",
      readTime,
      content,
    };

    postsMeta.push({
      slug,
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
      readTime: post.readTime,
    });

    // keep original markdown copies
    await copyFile(fullPath, path.join(destDir, file));
    await copyFile(fullPath, path.join(publicDestDir, file));

    // generate static JSON per post
    await writeFile(
      path.join(publicDestDir, `${slug}.json`),
      JSON.stringify(post, null, 2)
    );
  }

  // generate posts index
  postsMeta.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  await writeFile(
    path.join(publicDestDir, "index.json"),
    JSON.stringify(postsMeta, null, 2)
  );

  console.log(`generated ${files.length} static post(s)`);
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
