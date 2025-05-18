import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
const JWT_EXPIRES_IN = '2h';

export const signUp = async (req: express.Request, res: express.Response) => {
  const { userName, email, password } = req.body;

  const newUser = new User({
    name: userName,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
  });
  try {
    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, name: savedUser.name },
      process.env.JWT_SECRET || 'your_jwt_secret',
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.json({ token });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'Email already exists' });
    } else {
      // Other errors
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
};

export const signIn = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  // Find the user by email
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'your_jwt_secret',
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  res.json({ token });
};

export const validateToken = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'your_jwt_secret';

  try {
    const decoded = jwt.verify(token, secret);

    res.json({ decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
