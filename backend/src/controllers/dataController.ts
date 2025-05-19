import express from 'express';
import Post from '../models/Post';
import User from '../models/User';

export const uploadPhoto = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!req.user || typeof req.user === 'string') {
      res.status(401).json({ message: 'User not authenticated properly' });
      return;
    }

    const newPost = new Post({
      description: req.body.description,
      url: req.file.path,
    });

    const savedPost = await newPost.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { posts: savedPost._id },
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUserPosts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    if (!req.user || typeof req.user === 'string') {
      res.status(401).json({ message: 'User not authenticated properly' });
      return;
    }

    const user = await User.findById(req.user.id).populate('posts');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      posts: user.posts,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      message: 'Error fetching user posts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFeedPosts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // If page=1, use random posts, otherwise get next batch
    let posts;
    if (page === 1) {
      // Random posts for first page
      posts = await Post.aggregate([{ $sample: { size: limit } }]);
    } else {
      // Next batch of posts, exclude already shown posts
      const excludeIds = req.query.exclude
        ? (req.query.exclude as string).split(',')
        : [];

      posts = await Post.find(
        excludeIds.length > 0 ? { _id: { $nin: excludeIds } } : {}
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    res.status(500).json({
      message: 'Error fetching feed posts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const likePost = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { postId } = req.body;

  if (!postId) {
    res.status(400).json({ message: 'Post ID is required' });
    return;
  }

  if (!req.user || typeof req.user === 'string') {
    res.status(401).json({ message: 'User not authenticated properly' });
    return;
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const userId = req.user.id;

    // Initialize usersLiked array if it doesn't exist
    if (!post.usersLiked) {
      post.usersLiked = [];
    }

    // Check if user already liked the post
    const userIndex = post.usersLiked.findIndex(
      id => id.toString() === userId.toString()
    );

    let liked = false;

    if (userIndex > -1) {
      // Already liked - remove like
      post.usersLiked.splice(userIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Not liked yet - add like
      post.usersLiked.push(userId);
      post.likes += 1;
      liked = true;
    }

    await post.save();

    res.status(200).json({
      message: 'Post like toggled successfully',
      likes: post.likes,
      liked: liked,
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      message: 'Error liking post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
