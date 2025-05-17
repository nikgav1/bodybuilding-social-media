import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { validateToken } from '../../shared/scripts/jwt';

@customElement('profile-page')
export class ProfilePage extends LitElement {
  @state()
  private isAuthenticated = false;

  @state()
  private loading = true;

  @state()
  private userData: any = null;

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
      this.userData = res.data.decoded || {};
      this.loading = false;
    } catch (error) {
      console.error('Authentication failed:', error);
      // Invalid token, redirect to login
      window.location.href = '/login';
    }
  }

  render() {
    if (this.loading) {
      return html`<p>Loading...</p>`;
    }

    if (!this.isAuthenticated) {
      return html`<p>Please log in</p>`;
    }

    return html`
      <h1>Profile Page</h1>
      <p>Email: ${this.userData?.email || 'No email'}</p>
      <p>User ID: ${this.userData?.id || 'No ID'}</p>
    `;
  }
}
