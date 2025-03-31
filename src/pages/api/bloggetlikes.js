import Like from '../../backend_utils/models/like.model';
import dbConnect from '../../backend_utils/db/mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { bloguuid, isarray } = req.query;

    try {
      const blogLikes = await Like.findOne({ parent: bloguuid });

      if (isarray === "true") {
        const likesArray = blogLikes ? blogLikes.like : [];
        res.json({ likes: likesArray });
      } else {
        const likesCount = blogLikes ? blogLikes.like.length : 0;
        res.json({ count: likesCount });
      }
    } catch (err) {
      console.error(`Error retrieving blog likes for bloguuid: ${bloguuid}`, err);
      res.status(500).json({ message: "Error retrieving blog likes", error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}