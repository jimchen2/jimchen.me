import axios from "axios";
import { setIpAddress } from "../config/global";

export const PostVisitInfo = async () => {
  try {
    // Get IP info from ipapi.co
    const userResponse = await axios.get("https://ipapi.co/json");
    const userData = userResponse.data;
    setIpAddress(userData.ip);
  } catch (err) {
    console.error("Error posting visit info:", err);
  }
};
