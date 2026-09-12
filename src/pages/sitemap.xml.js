/**
 * Generates the XML sitemap for the blog.
 * Access at: /sitemap.xml
 */
import { sitemapBlogs } from "@/lib/blogStore";

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function generateSiteMap(blogs, staticUrls, baseUrl) {
  const blogUrls = blogs
    .map((blog) => {
      const lastmod = blog.date ? new Date(blog.date).toISOString() : null;
      return `
   <url>
     <loc>${escapeXml(`${baseUrl}/a/${blog.blogid}`)}</loc>${
       lastmod ? `\n     <lastmod>${lastmod}</lastmod>` : ""
     }
   </url>`;
    })
    .join("");

  const statics = staticUrls
    .map(
      (url) => `
   <url>
     <loc>${escapeXml(`${baseUrl}${url}`)}</loc>
     <changefreq>weekly</changefreq>
   </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${statics}${blogUrls}
</urlset>
`;
}

export async function getServerSideProps({ req, res }) {
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );

  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["host"];
    const baseUrl = `${protocol}://${host}`;

    const blogs = await sitemapBlogs();
    const sitemap = generateSiteMap(blogs, ["/", "/about"], baseUrl);

    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.write(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`
    );
    res.end();
  }

  return { props: {} };
}

// This page doesn't render anything - it only generates XML
export default function Sitemap() {
  return null;
}
