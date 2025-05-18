import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getToken } from '../../shared/scripts/auth';
import { ProtectedPage } from '../components/protected-page';
import axios from 'axios';

@customElement('photo-upload-form')
export class PhotoUploadForm extends ProtectedPage {
  @state()
  private selectedFile: File | null = null;

  @state()
  private previewUrl: string | null = null;

  @state()
  private uploading = false;

  @state()
  private description = '';

  @state()
  private uploadSuccess = false;

  @state()
  private errorMessage = '';

  handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  handleDescriptionChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.description = input.value;
  }

  async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a photo first';
      return;
    }

    try {
      this.uploading = true;
      this.errorMessage = '';

      // Create form data
      const formData = new FormData();
      formData.append('photo', this.selectedFile);
      formData.append('description', this.description);

      // Get auth token
      const token = getToken();

      // Send request to backend using axios
      const response = await axios.post('/api/upload-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Axios sets this automatically for FormData
        },
      });

      // Show success message
      this.uploadSuccess = true;

      // Reset form
      this.selectedFile = null;
      this.description = '';

      // Clean up object URL
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }

      // Emit custom event to notify parent components
      this.dispatchEvent(
        new CustomEvent('upload-complete', {
          detail: response.data,
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.errorMessage = error.response.data.message || 'Upload failed';
      } else {
        this.errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
      }
    } finally {
      this.uploading = false;
    }
  }

  render() {
    return html`
      <div class="upload-container">
        <h2>Share Your Workout Photo</h2>

        ${this.uploadSuccess
          ? html`
              <div class="success-message">
                Your photo was uploaded successfully!
                <button @click=${() => (this.uploadSuccess = false)}>
                  Upload Another
                </button>
              </div>
            `
          : html`
              <form @submit=${this.handleSubmit}>
                <div class="form-group">
                  <label for="photo">Select Photo:</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    @change=${this.handleFileChange}
                    ?disabled=${this.uploading}
                  />
                </div>

                ${this.previewUrl
                  ? html`
                      <div class="preview">
                        <img src=${this.previewUrl} alt="Preview" />
                      </div>
                    `
                  : ''}

                <div class="form-group">
                  <label for="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    .value=${this.description}
                    @input=${this.handleDescriptionChange}
                    ?disabled=${this.uploading}
                    placeholder="Share details about your workout..."
                    rows="3"
                  ></textarea>
                </div>

                ${this.errorMessage
                  ? html`
                      <div class="error-message">${this.errorMessage}</div>
                    `
                  : ''}

                <button
                  type="submit"
                  ?disabled=${this.uploading || !this.selectedFile}
                >
                  ${this.uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </form>
            `}
      </div>
    `;
  }

  // Add some basic styles
  static styles = css`
    .upload-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .preview img {
      max-width: 100%;
      max-height: 300px;
      margin: 10px 0;
      border-radius: 4px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 10px 15px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: #cccccc;
    }

    .error-message {
      color: #e74c3c;
      margin: 10px 0;
    }

    .success-message {
      color: #2ecc71;
      padding: 10px;
      background-color: #f8fff8;
      border-radius: 4px;
      text-align: center;
    }
  `;
}
