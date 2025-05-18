import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ProtectedPage } from '../components/protected-page';
import axios from 'axios';
import { getToken } from '../../shared/scripts/auth';

@customElement('profile-page')
export class ProfilePage extends ProtectedPage {
  @state()
  private posts: any[] = [];

  @state()
  private loadingPosts = false;

  // This will be called after successful authentication
  protected override onAuthSuccess() {
    this.loadUserPosts();
  }

  async loadUserPosts() {
    try {
      this.loadingPosts = true;
      const token = getToken();

      // Fetch user's posts from the backend
      const response = await axios.get(`/api/get-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.posts = response.data.posts || [];
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      this.loadingPosts = false;
    }
  }

  // Override the base class method
  protected override renderContent() {
    return html`
      <div class="profile-container">
        <h1>Profile Page</h1>
        <p>Name: ${this.userData?.name || 'No name'}</p>
        <p>Email: ${this.userData?.email || 'No email'}</p>

        <h2>Your Posts</h2>
        ${this.renderPosts()}
      </div>
    `;
  }

  private renderPosts() {
    if (this.loadingPosts) {
      return html`<p>Loading posts...</p>`;
    }

    if (!this.posts.length) {
      return html`<p>You haven't posted anything yet.</p>`;
    }

    return html`
      <div class="posts-grid">
        ${this.posts.map(
          post => html`
            <div class="post-card">
              <img src="${post.url}" alt="${post.description}" />
              <p>${post.description}</p>
            </div>
          `
        )}
      </div>
    `;
  }

  // You can also override the loading render method if you want
  protected override renderLoading() {
    return html`<div class="loading-spinner">Loading your profile...</div>`;
  }

  static styles = css`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .post-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }

    .post-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .post-card p {
      padding: 10px;
      margin: 0;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-weight: bold;
    }
  `;
}
