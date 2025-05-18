import express from 'express';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const token: string = req.headers['authorization']?.split(' ')[1] || '';
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
  }
  const secret: string = process.env.JWT_SECRET || 'your_jwt_secret';
  // Verify the token
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        secret,
        (
          err: jwt.VerifyErrors | null,
          decoded: string | jwt.JwtPayload | undefined
        ) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });
    req.user = decoded as string | jwt.JwtPayload | undefined;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}
