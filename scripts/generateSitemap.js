import fs from "node:fs";
import path from "node:path";

(async () => {
  const prettier = await import("prettier"); // ESM 동적 import
  const SitemapGeneratedDate = new Date().toISOString();
  const DOMAIN = "https://jjinbbang.kr";

  const pages = ["/", "/map", "/heart", "/mypage", "/content"].map((p) => DOMAIN + p);

  const pageSitemap = pages
    .map(
      (page) => `
  <url>
    <loc>${page}</loc>
    <lastmod>${SitemapGeneratedDate}</lastmod>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  ${pageSitemap}
</urlset>`;

  const formatted = await prettier.format(xml, { parser: "html" });

  const outPath = path.resolve(process.cwd(), "public/seo/sitemap.xml");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, formatted, "utf8");

  console.log(`✅ sitemap generated: ${outPath}`);
})().catch((err) => {
  console.error("❌ generateSitemap failed:", err);
  process.exit(1);
});
