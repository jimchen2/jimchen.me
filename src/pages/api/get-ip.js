export default function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
  console.log(ip);
  res.status(200).json({ ip });
}
