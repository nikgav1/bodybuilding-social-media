import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { validateToken } from '../../shared/scripts/jwt';
import { UserData } from '../../shared/types/user';

export abstract class ProtectedPage extends LitElement {
  @state()
  protected isAuthenticated = false;

  @state()
  protected loading = true;

  @state()
  protected userData: UserData | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.checkAuth();
  }

  async checkAuth() {
    try {
      // Validate token with backend
      const res = await validateToken();
      if (!res) {
        window.location.href = '/login';
        return;
      }

      // If we get here, token is valid
      this.isAuthenticated = true;
      this.userData = (res.data.decoded as UserData) || null;
      this.loading = false;

      // Call optional callback for subclasses to handle after auth
      this.onAuthSuccess();
    } catch (error) {
      console.error('Authentication failed:', error);
      // Invalid token, redirect to login
      window.location.href = '/login';
    }
  }

  // Optional method for subclasses to override
  protected onAuthSuccess(): void {
    // No-op by default
  }

  // This is the template method that subclasses should override
  protected renderContent() {
    return html`<p>Protected content</p>`;
  }

  render() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.isAuthenticated) {
      return this.renderUnauthenticated();
    }

    return this.renderContent();
  }

  protected renderLoading() {
    return html`<p>Loading...</p>`;
  }

  protected renderUnauthenticated() {
    return html`<p>Please log in to access this page</p>`;
  }
}
