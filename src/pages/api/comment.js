import Comment from "@/backend_utils/models/comment.model";
import dbConnect from "@/backend_utils/db/mongoose"; // Adjusted path to your dbConnect file

export default async function handler(req, res) {
  // Ensure database connection is established
  await dbConnect();

  // Handle GET requests
  if (req.method === "GET") {
    const { bloguuid } = req.query;

    try {
      let query = {};
      if (bloguuid && bloguuid !== "0") {
        query.blog = bloguuid;
      }

      // Fetch comments and sort by date (descending) directly in the query
      let comments = await Comment.find(query).sort({ date: -1 });

      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching comments" });
    }
  }
  // Handle POST requests
  else if (req.method === "POST") {
    const { user, text, blog, uuid, blogname, parentid } = req.body;

    try {
      // Create new comment
      const newComment = new Comment({
        uuid,
        user,
        text,
        blog,
        blogname,
      });

      const savedComment = await newComment.save();

      // If it's a reply, update the parent comment
      if (parentid) {
        const parentComment = await Comment.findOne({ uuid: parentid });
        if (!parentComment) {
          console.warn(`Parent comment ${parentid} not found`);
        } else {
          parentComment.pointer.push(uuid);
          await parentComment.save();
        }
      }

      res.status(201).json(savedComment);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Error creating comment" });
    }
  }
  // Handle other methods
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}