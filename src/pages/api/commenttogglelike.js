import Comment from '../../backend_utils/models/comment.model';
import dbConnect from '../../backend_utils/db/mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PATCH') {
    const { commentuuid } = req.query;
    const { userIP, isLiked } = req.body;

    if (userIP === "unknown" || userIP === "127.0.0.1") {
      return res.status(400).json({ message: "Cannot like comment from this IP" });
    }

    try {
      let query = {};
      if (commentuuid) {
        query.uuid = commentuuid;
      } else {
        return res.status(400).json({ message: "Invalid query parameters" });
      }

      const foundComment = await Comment.findOne(query);

      if (!foundComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (isLiked) {
        if (!foundComment.like.includes(userIP)) {
          foundComment.like.push(userIP);
        }
      } else {
        foundComment.like = foundComment.like.filter((ip) => ip !== userIP);
      }

      const updatedComment = await foundComment.save();
      res.json(updatedComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating comment", error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}