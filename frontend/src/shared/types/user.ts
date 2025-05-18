export interface UserData {
  id: string;
  email: string;
  name: string;
  iat?: number; // JWT issued at timestamp
  exp?: number; // JWT expiration timestamp
}

export interface Post {
  _id: string;
  description: string;
  url: string;
  likes: number;
  createdAt?: string;
}
