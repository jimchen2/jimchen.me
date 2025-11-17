/**
 * Generates dynamic XML sitemap for the blog
 * Access at: https://yourdomain.com/sitemap.xml
 */

function generateSiteMap(blogs, types, baseUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

     ${blogs
       .map((blog) => {
         const lastmod = blog.date;
         return `
     <url>
       <loc>${baseUrl}/blog/${blog.blogid}</loc>
       <lastmod>${new Date(lastmod).toISOString()}</lastmod>
     </url>`;
       })
       .join("")}

   </urlset>
 `;
}

export async function getServerSideProps({ req, res }) {
  // Set proper headers for XML
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");

  try {
    // Determine base URL
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["host"];
    const baseUrl = `${protocol}://${host}`;

    // Fetch sitemap data from our API
    const response = await fetch(`${baseUrl}/api/sitemap-data`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch sitemap data");
    }

    const { blogs, types } = await response.json();

    // Generate the XML sitemap
    const sitemap = generateSiteMap(blogs, types, baseUrl);

    // Send the XML
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    res.end();

    return {
      props: {},
    };
  }
}

// This page doesn't render anything - it only generates XML
export default function Sitemap() {
  return null;
}