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
      type: Date,  
      default: Date.now,  
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
    word_count: {
      type: Number,
    },
  },
  { versionKey: false }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;