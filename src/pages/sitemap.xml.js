import { listAllBlogMeta } from "@/lib/blogRepo";

/**
 * Generates the XML sitemap. Read straight from the repository rather than
 * calling the app's own API over HTTP.
 */

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, lastmod, priority) {
  return `
   <url>
     <loc>${escapeXml(loc)}</loc>${
       lastmod
         ? `
     <lastmod>${lastmod}</lastmod>`
         : ""
     }
     <priority>${priority}</priority>
   </url>`;
}

function generateSiteMap(blogs, baseUrl) {
  const staticPages = [
    urlEntry(`${baseUrl}/`, new Date().toISOString().slice(0, 10), "1.0"),
    urlEntry(`${baseUrl}/about`, new Date().toISOString().slice(0, 10), "0.8"),
  ];

  const postPages = blogs.map((blog) => {
    const date = blog.updated_at || blog.date;
    const lastmod = date && !Number.isNaN(new Date(date).getTime())
      ? new Date(date).toISOString()
      : null;
    return urlEntry(`${baseUrl}/a/${blog.blogid}`, lastmod, "0.7");
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...postPages].join("")}
</urlset>
`;
}

export async function getServerSideProps({ req, res }) {
  res.setHeader("Content-Type", "application/xml; charset=UTF-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");

  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["host"];
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE?.replace(/\/$/, "") || `${protocol}://${host}`;

    const blogs = await listAllBlogMeta();

    res.write(generateSiteMap(blogs, baseUrl));
    res.end();
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}

// This page renders nothing; it only writes XML to the response.
export default function Sitemap() {
  return null;
}
