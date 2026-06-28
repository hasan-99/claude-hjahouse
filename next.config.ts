import type { NextConfig } from "next";

// When GITHUB_PAGES=true (CI), build a fully static export served under
// /claude-hjahouse on hasan-99.github.io. Local `npm run dev` is unaffected.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "claude-hjahouse";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export",
        basePath: `/${repo}`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
