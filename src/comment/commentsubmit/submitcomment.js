import axios from "axios";

async function SubmitComment({ parentid, username, message, blogid, blogname }) {
  const name = username || "anonymous";
  const uuid = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

  try {
    const commentResponse = await axios.post("/api/comment", {
      user: name,
      text: message,
      blog: blogid,
      uuid: uuid,
      blogname: blogname,
      parentid: parentid !== "-1" ? parentid : null // Include parentid in the initial POST
    });
    
    console.log("Comment created:", commentResponse.data);
    return commentResponse.data;
  } catch (error) {
    console.error("Error submitting comment:", error);
    return null;
  }
}

export default SubmitComment;