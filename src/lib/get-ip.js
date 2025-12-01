// lib/get-ip.js
export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
  // Handle localhost edge cases
  if (ip === "::1" || ip === "::ffff:127.0.0.1") return "127.0.0.1";
  return ip;
};