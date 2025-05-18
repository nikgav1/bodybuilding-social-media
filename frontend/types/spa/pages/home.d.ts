import { ProtectedPage } from '../components/protected-page';
export declare class PhotoUploadForm extends ProtectedPage {
    private selectedFile;
    private previewUrl;
    private uploading;
    private description;
    private uploadSuccess;
    private errorMessage;
    handleFileChange(e: Event): void;
    handleDescriptionChange(e: Event): void;
    handleSubmit(e: Event): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
