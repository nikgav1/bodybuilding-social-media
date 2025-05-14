import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('profile-page')
export class ProfilePage extends LitElement {
  render() {
    return html`<h1>Profile Page</h1>`;
  }
}