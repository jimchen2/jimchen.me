// pages/backend_utils/models/blog.model.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    uuid: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    date: {
      type: String,  // Note: Consider using Date type instead of String if you're storing dates
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "en",
    },
  },
  { versionKey: false }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;