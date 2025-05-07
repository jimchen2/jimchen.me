import dbConnect from "@/lib/db/dbConnect";

export async function getServerSideProps(context) {
  const { blogid } = context.params;

  try {
    // Connect to the database
    const pool = await dbConnect();

    // Query the database for the blog entry by blogid
    const query = `
      SELECT language, type, title
      FROM blogs
      WHERE blogid = $1
    `;
    const result = await pool.query(query, [blogid]);

    // If no blog is found, return a 404
    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    // Extract the blog details
    const { language, type, title } = result.rows[0];

    // Construct the canonical URL
    const canonicalUrl = `/${encodeURIComponent(language)}/${encodeURIComponent(type)}/${encodeURIComponent(title)}`;

    // Return a redirect to the canonical URL
    return {
      redirect: {
        destination: canonicalUrl,
        permanent: true, // Set to true for SEO-friendly 301 redirect
      },
    };
  } catch (error) {
    console.error("Error fetching blog for redirect:", error);
    return {
      notFound: true, // Or redirect to an error page if preferred
    };
  }
}

// No need for a component since this page only redirects
export default function ShortUrlRedirect() {
  return null; // This will never render since we redirect server-side
}