import fs from "node:fs/promises";
import path from "node:path";

// Post-build helper for GitHub Pages:
// - publish redirect page at site root -> /blog/
// - move the real VitePress output under /blog/
//
// Works well for a user/org Pages site where "/" is the domain root.
// If your Pages site is served under a repo subpath (project Pages),
// you probably want base like "/<repo>/blog/" and redirect accordingly.

const distDir = path.resolve("docs/.vitepress/dist");
const blogDir = path.join(distDir, "blog");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(distDir))) {
    throw new Error(`dist directory not found: ${distDir}`);
  }

  await fs.mkdir(blogDir, { recursive: true });

  // Move everything except `blog/` and `.nojekyll` into `blog/`.
  const entries = await fs.readdir(distDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "blog" || entry.name === ".nojekyll") continue;

    const from = path.join(distDir, entry.name);
    const to = path.join(blogDir, entry.name);
    await fs.rename(from, to);
  }

  // Ensure .nojekyll is at the published root (disables Jekyll processing).
  const nojekyll = path.join(distDir, ".nojekyll");
  if (!(await exists(nojekyll))) {
    await fs.writeFile(nojekyll, "");
  }

  // Root redirect: keep query/hash.
  const redirectHtml = `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/blog/">
<title>Redirecting…</title>
<script>
  (function () {
    var target = "/blog/" + (location.search || "") + (location.hash || "");
    location.replace(target);
  })();
</script>
<p>Redirecting to <a href="/blog/">/blog/</a>…</p>
`;

  await fs.writeFile(path.join(distDir, "index.html"), redirectHtml, "utf8");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

