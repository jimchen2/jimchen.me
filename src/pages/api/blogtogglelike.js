import Like from '../../backend_utils/models/like.model';
import dbConnect from '../../backend_utils/db/mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PATCH') {
    const { uuid } = req.query;
    const { userIP, isLiked } = req.body;

    if (!userIP || userIP === "unknown" || userIP === "127.0.0.1") {
      return res.status(400).json({ message: "Invalid IP address" });
    }

    try {
      const foundLike = await Like.findOne({ parent: uuid });

      if (foundLike) {
        const ipIndex = foundLike.like.indexOf(userIP);
        if (isLiked) {
          if (ipIndex !== -1) {
            foundLike.like.splice(ipIndex, 1);
            await foundLike.save();
            res.json({ message: "Like removed" });
          } else {
            res.status(400).json({ message: "Like not found for removal" });
          }
        } else {
          if (ipIndex === -1) {
            foundLike.like.push(userIP);
            await foundLike.save();
            res.json({ message: "Like added" });
          } else {
            res.status(400).json({ message: "Blog already liked" });
          }
        }
      } else {
        if (!isLiked) {
          const newLike = new Like({
            parent: uuid,
            like: [userIP],
          });
          await newLike.save();
          res.json({ message: "Like added to new blog" });
        } else {
          res.status(400).json({ message: "No likes exist for this blog" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error processing request", error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}