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

  @state()
  private currentPage = 1;

  @state()
  private hasMorePosts = true;

  @state()
  private isLoadingMore = false;

  private scrollObserver?: IntersectionObserver;
  private scrollTarget?: HTMLElement;

  // This will be called after successful authentication
  protected override onAuthSuccess() {
    this.loadFeedPosts();
  }

  async loadFeedPosts(page = 1) {
    try {
      this.loadingPosts = page === 1;
      this.isLoadingMore = page > 1;

      const token = getToken();

      // Get IDs of posts we've already loaded to exclude them
      const excludeIds =
        page > 1 ? this.posts.map(post => post._id).join(',') : '';

      // Fetch feed posts from the backend with pagination and exclusions
      const response = await axios.get<Post[]>(`/api/feed-posts`, {
        params: {
          page,
          limit: 10,
          exclude: excludeIds,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newPosts: Post[] = response.data || [];

      // If first page, replace posts, otherwise append
      if (page === 1) {
        this.posts = newPosts;
      } else {
        this.posts = [...this.posts, ...newPosts];
      }

      // Check if there are more posts to load
      this.hasMorePosts = newPosts.length === 10;
      this.currentPage = page;
    } catch (error) {
      console.error('Failed to load feed posts:', error);
    } finally {
      this.loadingPosts = false;
      this.isLoadingMore = false;
    }
  }

  loadMorePosts() {
    if (!this.isLoadingMore && this.hasMorePosts) {
      this.loadFeedPosts(this.currentPage + 1);
    }
  }

  firstUpdated() {
    // Set up intersection observer for infinite scrolling
    this.setupInfiniteScroll();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up the observer when component is removed
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }

  setupInfiniteScroll() {
    // Create a new IntersectionObserver
    this.scrollObserver = new IntersectionObserver(
      entries => {
        // If the sentinel element is visible
        if (
          entries[0].isIntersecting &&
          this.hasMorePosts &&
          !this.isLoadingMore
        ) {
          this.loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    // We'll observe this element after render
    setTimeout(() => {
      const element = this.renderRoot.querySelector('.scroll-sentinel');
      if (element) {
        this.scrollTarget = element as HTMLElement;
        if (this.scrollObserver) {
          this.scrollObserver.observe(this.scrollTarget);
        }
      }
    }, 100);
  }

  protected override renderContent() {
    return html`
      <div class="feed-container">
        <h1>Feed Page</h1>
        ${this.renderPosts()}

        <!-- Sentinel element for infinite scrolling -->
        <div class="scroll-sentinel"></div>

        ${this.isLoadingMore
          ? html`
          <div class="loading-more"></div>
            <p>Loading more posts...</p>
          </div>
        `
          : ''}
        ${!this.hasMorePosts && this.posts.length > 0
          ? html`
              <div class="end-message">
                <p>No more posts to load</p>
              </div>
            `
          : ''}
      </div>
    `;
  }

  async handleLike(postId: string) {
    try {
      const token = getToken();
      const res = await axios.post(
        `/api/like-post`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.liked === true) {
        this.posts = this.posts.map(post => {
          if (post._id === postId) {
            return { ...post, likes: Math.max(0, post.likes + 1) };
          }
          return post;
        });
      } else {
        this.posts = this.posts.map(post => {
          if (post._id === postId) {
            return { ...post, likes: Math.max(0, post.likes - 1) };
          }
          return post;
        });
      }
      // Update the local state to reflect the like
    } catch (error) {
      console.error('Failed to like post:', error);
    }
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
        ${this.posts.map(
          post => html`
            <div class="post-card">
              <div class="post-image">
                <img src="${post.url}" alt="Post Image" />
              </div>
              <div class="post-content">
                <p class="post-description">${post.description}</p>
                <div class="post-actions">
                  <button
                    @click=${() => this.handleLike(post._id)}
                    class="like-button"
                  >
                    ❤️ ${post.likes}
                  </button>
                </div>
              </div>
            </div>
          `
        )}
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .scroll-sentinel {
      height: 20px;
      margin-top: 20px;
    }

    .loading-more {
      text-align: center;
      padding: 15px;
      font-style: italic;
    }

    .end-message {
      text-align: center;
      padding: 15px;
      font-style: italic;
      color: #888;
    }

    @media (min-width: 768px) {
      .posts-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
}
