export interface UserData {
    id: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
}
export interface Post {
    _id: string;
    description: string;
    likes: number;
    url: string;
    createdAt?: string;
}
export interface getPostsResponse {
    posts: Post[];
}
