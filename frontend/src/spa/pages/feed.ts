import { html, css } from 'lit';
import { getToken } from '../../shared/scripts/auth';
import { customElement, state } from 'lit/decorators.js';
import { ProtectedPage } from '../components/protected-page';
import { Post } from '../../shared/types/user';
import axios from 'axios';

@customElement('feed-page')
export class FeedPage extends ProtectedPage {
    @state()
    private posts: Post[] = [];
    
    @state()
    private loadingPosts = false;
    
    // This will be called after successful authentication
    protected override onAuthSuccess() {
        this.loadFeedPosts();
    }
    
    async loadFeedPosts() {
        try {
            this.loadingPosts = true;
            const token = getToken();
        
            // Fetch feed posts from the backend
            const response = await axios.get<Post[]>(`/api/feed-posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            this.posts = response.data || [];
        } catch (error) {
            console.error('Failed to load feed posts:', error);
        } finally {
            this.loadingPosts = false;
        }
    }

    protected override renderContent() {
        return html`
            <div class="feed-container">
                <h1>Feed Page</h1>
                ${this.renderPosts()}
            </div>
        `;
    }
    
    private renderPosts() {
        if (this.loadingPosts) {
            return html`<p>Loading posts...</p>`;
        }

        if (!this.posts.length) {
            return html`<p>No posts available</p>`;
        }

        return html`
            <div class="posts-grid">
                ${this.posts.map(post => html`
                    <div class="post-card">
                        <div class="post-image">
                            <img src="${post.url}" alt="Post Image" />
                        </div>
                        <div class="post-content">
                            <p class="post-description">${post.description}</p>
                            <div class="post-actions">
                                <button class="like-button">❤️ ${post.likes}</button>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    static styles = css`
        .feed-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .posts-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        .post-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background: white;
        }
        
        .post-image img {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
        }
        
        .post-content {
            padding: 15px;
        }
        
        .post-description {
            margin: 0 0 15px;
        }
        
        .post-actions {
            display: flex;
            justify-content: space-between;
        }
        
        .like-button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 5px 10px;
            border-radius: 4px;
        }
        
        .like-button:hover {
            background: #f5f5f5;
        }
        
        @media (min-width: 768px) {
            .posts-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
}