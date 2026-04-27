import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, mkdir, copyFile, readdir } from "fs/promises";
import path from "path";

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

  console.log("copying content/posts to dist...");
  const srcDir = path.resolve("content/posts");

  // Existing destination (for Vercel / backend use)
  const destDir = path.resolve("dist/content/posts");

  // New destination (for Netlify static hosting)
  const publicDestDir = path.resolve("dist/public/content/posts");

  await mkdir(destDir, { recursive: true });
  await mkdir(publicDestDir, { recursive: true });

  const files = await readdir(srcDir);

  const markdownFiles = files.filter((f) => f.endsWith(".md"));

  await Promise.all(
    markdownFiles.flatMap((f) => [
      copyFile(path.join(srcDir, f), path.join(destDir, f)),
      copyFile(path.join(srcDir, f), path.join(publicDestDir, f)),
    ])
  );

  console.log(
    `copied ${markdownFiles.length} post(s) to dist/content/posts and dist/public/content/posts`
  );
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
