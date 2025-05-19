import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  usersLiked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  url: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
