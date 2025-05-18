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
