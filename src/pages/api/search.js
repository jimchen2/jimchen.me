// pages/api/search.js
import dbConnect from "../../lib/db/dbConnect";


function getRelevantSnippet(body, searchTerm, isTitleMatch) {
  if (isTitleMatch) {
    return body.substring(0, 150);
  } else {
    const index = body.toLowerCase().indexOf(searchTerm.toLowerCase());
    const start = Math.max(index - 75, 0);
    const end = Math.min(start + 150, body.length);
    return body.substring(start, end);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "A search query is required." });
    }

    try {
      const pool = await dbConnect();
      
      // Use ILIKE for case-insensitive search in PostgreSQL
      const searchQuery = `
        SELECT id, blogid, title, date, type, body, language, word_count 
        FROM blogs 
        WHERE title ILIKE $1 OR body ILIKE $1
        ORDER BY date DESC
      `;
      
      const { rows } = await pool.query(searchQuery, [`%${query}%`]);
      
      const matches = rows.map(blog => {
        const isTitleMatch = blog.title.toLowerCase().includes(query.toLowerCase());
        const isBodyMatch = blog.body.toLowerCase().includes(query.toLowerCase());
        const snippet = getRelevantSnippet(blog.body, query, isTitleMatch);

        // Format the date
        const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        return {
          ...blog,
          body: snippet,
          date: formattedDate,
          isTitleMatch,
          isBodyMatch,
          randomTieBreaker: Math.random(),
        };
      }).sort((a, b) => {
        // Generate random tiebreaker for results with same date
        return b.randomTieBreaker - a.randomTieBreaker;
      });

      res.json(matches);
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({
        message: "Error searching for blog entries",
        error: err.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
