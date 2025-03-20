export const getServerSideProps = async ({ res }) => {
  try {
    // Fetch the sitemap data from your API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_SITE 
    const response = await fetch(`${apiUrl}/api/sitemap`)
    const sitemapData = await response.json()

    // Generate the XML content
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    // Set the appropriate headers
    res.setHeader('Content-Type', 'text/xml')
    res.write(xml)
    res.end()

    return {
      props: {},
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.statusCode = 500
    res.write('Error generating sitemap')
    res.end()

    return {
      props: {},
    }
  }
}

const Sitemap = () => null
export default Sitemap
