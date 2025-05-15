import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { initRouter } from '../router/router';

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = css`
    :host {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  `;

  firstUpdated() {
    const outlet = this.renderRoot.querySelector(
      '#outlet'
    ) as HTMLElement | null;
    if (outlet) initRouter(outlet);
  }

  render() {
    return html`
      <nav>
        <a href="/spa/">Home</a>
        <a href="/spa/profile/">Profile</a>
      </nav>
      <main id="outlet"></main>
    `;
  }
}
