// pages/backend_utils/models/like.model.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const likeSchema = new Schema({
  parent: {
    type: String,
    default: ""
  },
  like: {
    type: [String],
    default: []
  }
}, { versionKey: false });

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

export default Like;