// pages/backend_utils/models/comment.model.js
import mongoose from 'mongoose';
import moment from 'moment-timezone';

const { Schema } = mongoose;

const commentSchema = new Schema({
  uuid: {
    type: String,
    default: "",
  },
  user: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    default: ""
  },
  date: {
    type: Date,  
    default: () => moment().tz("Asia/Shanghai").toDate()  // Converted to Date object
  },
  pointer: {
    type: [String],
    default: []
  },
  blog: {
    type: String,
    default: " "
  },
  blogname: {
    type: String,
    default: " "
  },
  like: {
    type: [String],
    default: []
  }
}, { versionKey: false });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;