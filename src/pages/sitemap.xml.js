import { listAllPosts, listTypesWithCounts, resolveSiteUrl } from "@/lib/blogData";

/**
 * Dynamic XML sitemap for the blog — available at /sitemap.xml.
 *
 * The data functions are called directly (no HTTP round trip back into the
 * same server), and the URL prefix comes from the request when
 * NEXT_PUBLIC_SITE is not configured.
 */
const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });

function generateSiteMap({ posts, types, baseUrl }) {
  const staticPages = ["", "/about"].map(
    (path) => `
     <url>
       <loc>${escapeXml(`${baseUrl}${path || "/"}`)}</loc>
       <changefreq>${path ? "monthly" : "daily"}</changefreq>
       <priority>${path ? "0.5" : "1.0"}</priority>
     </url>`,
  );

  const tagPages = types.map(
    (type) => `
     <url>
       <loc>${escapeXml(`${baseUrl}/?type=${encodeURIComponent(type)}`)}</loc>
       <changefreq>weekly</changefreq>
       <priority>0.4</priority>
     </url>`,
  );

  const postPages = posts.map((post) => {
    const lastmod = post.date ? new Date(post.date) : null;
    return `
     <url>
       <loc>${escapeXml(`${baseUrl}/a/${post.blogid}`)}</loc>${
         lastmod && !Number.isNaN(lastmod.getTime())
           ? `\n       <lastmod>${lastmod.toISOString()}</lastmod>`
           : ""
       }
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...tagPages, ...postPages].join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ req, res }) {
  try {
    const baseUrl = resolveSiteUrl(req);
    const [posts, types] = await Promise.all([listAllPosts(), listTypesWithCounts()]);

    const sitemap = generateSiteMap({ posts, types: types.map((entry) => entry.type), baseUrl });

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Error generating sitemap");
    return { props: {} };
  }
}

// This page renders nothing — it only writes XML.
export default function Sitemap() {
  return null;
}
