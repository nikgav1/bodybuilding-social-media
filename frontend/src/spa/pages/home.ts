import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('home-page')
export class HomePage extends LitElement {
  @state()
  private selectedFile: File | null = null;

  @state()
  private previewUrl: string | null = null;

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create a preview URL for the image
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('photo', this.selectedFile);

      // You would send this to your API
      // const response = await fetch('/api/upload-photo', {
      //   method: 'POST',
      //   body: formData
      // });

      // Reset the form
      this.selectedFile = null;
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  }

  render() {
    return html`
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>

      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="photoInput">Upload Photo:</label>
          <input
            type="file"
            id="photoInput"
            name="photo"
            accept="image/*"
            @change=${this.handleFileChange}
            required
          />
        </div>

        ${this.previewUrl
          ? html`
              <div class="preview">
                <h3>Preview:</h3>
                <img
                  src=${this.previewUrl}
                  alt="Preview"
                  style="max-width: 300px; max-height: 300px;"
                />
              </div>
            `
          : ''}

        <button type="submit">Upload Photo</button>
      </form>
    `;
  }
}
