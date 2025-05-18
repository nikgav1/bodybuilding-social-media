import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { initRouter } from '../router/router';
import { getToken, removeToken } from '../../shared/scripts/auth';

@customElement('app-root')
export class AppRoot extends LitElement {
  @state()
  private isAuthenticated = false;

  @state()
  private mobileMenuOpen = false;

  connectedCallback() {
    super.connectedCallback();
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = getToken();
    this.isAuthenticated = !!token;
  }

  handleLogout() {
    removeToken();
    this.isAuthenticated = false;
    window.location.href = '/login';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  firstUpdated() {
    const outlet = this.renderRoot.querySelector(
      '#outlet'
    ) as HTMLElement | null;
    if (outlet) initRouter(outlet);

    // Listen for auth changes
    window.addEventListener('storage', e => {
      if (e.key === 'token') {
        this.checkAuthStatus();
      }
    });
  }

  render() {
    return html`
      <header class="app-header">
        <div class="logo">
          <a href="/spa/">💪 FitShare</a>
        </div>

        <button class="mobile-menu-button" @click=${this.toggleMobileMenu}>
          <span class="menu-icon"></span>
        </button>

        <nav class="main-nav ${this.mobileMenuOpen ? 'active' : ''}">
          <a href="/spa/" class="nav-link">Home</a>
          <a href="/spa/explore/" class="nav-link">Explore</a>

          ${this.isAuthenticated
            ? html`
                <a href="/spa/profile/" class="nav-link">Profile</a>
                <a href="/spa/workouts/" class="nav-link">Workouts</a>
                <button class="logout-button" @click=${this.handleLogout}>
                  Logout
                </button>
              `
            : html`
                <a href="/login" class="nav-link auth-link">Login</a>
                <a href="/register" class="nav-link auth-link highlight"
                  >Sign Up</a
                >
              `}
        </nav>
      </header>

      <main id="outlet"></main>

      <footer class="app-footer">
        <p>
          &copy; ${new Date().getFullYear()} FitShare - Your Bodybuilding
          Community
        </p>
        <div class="footer-links">
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      --primary-color: #3498db;
      --primary-dark: #2980b9;
      --accent-color: #e67e22;
      --text-color: #333;
      --light-bg: #f5f5f5;
      --header-height: 60px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--header-height);
      padding: 0 20px;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      text-decoration: none;
    }

    .main-nav {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-link {
      color: var(--text-color);
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-link:hover {
      background-color: var(--light-bg);
    }

    .auth-link.highlight {
      background-color: var(--primary-color);
      color: white;
    }

    .auth-link.highlight:hover {
      background-color: var(--primary-dark);
    }

    .logout-button {
      background: none;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .logout-button:hover {
      background-color: var(--primary-color);
      color: white;
    }

    #outlet {
      min-height: calc(100vh - var(--header-height) - 60px);
      padding: 20px;
    }

    .app-footer {
      background-color: var(--light-bg);
      padding: 20px;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
    }

    .footer-links {
      margin-top: 10px;
    }

    .footer-links a {
      color: #666;
      margin: 0 10px;
      text-decoration: none;
    }

    .footer-links a:hover {
      text-decoration: underline;
    }

    .mobile-menu-button {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px;
    }

    .menu-icon {
      display: block;
      width: 25px;
      height: 3px;
      background-color: var(--primary-color);
      position: relative;
      transition: background-color 0.3s;
    }

    .menu-icon::before,
    .menu-icon::after {
      content: '';
      position: absolute;
      width: 25px;
      height: 3px;
      background-color: var(--primary-color);
      transition: transform 0.3s;
    }

    .menu-icon::before {
      top: -8px;
    }

    .menu-icon::after {
      top: 8px;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .mobile-menu-button {
        display: block;
      }

      .main-nav {
        position: absolute;
        top: var(--header-height);
        left: 0;
        right: 0;
        flex-direction: column;
        background-color: white;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
        display: none;
      }

      .main-nav.active {
        display: flex;
      }

      .nav-link {
        width: 100%;
        padding: 12px;
        text-align: center;
      }
    }
  `;
}
