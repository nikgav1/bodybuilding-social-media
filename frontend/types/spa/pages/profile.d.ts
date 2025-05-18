import { ProtectedPage } from '../components/protected-page';
export declare class ProfilePage extends ProtectedPage {
    private posts;
    private loadingPosts;
    protected onAuthSuccess(): void;
    loadUserPosts(): Promise<void>;
    protected renderContent(): import("lit-html").TemplateResult<1>;
    private renderPosts;
    protected renderLoading(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
