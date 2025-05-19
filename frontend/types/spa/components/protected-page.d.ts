import { LitElement } from 'lit';
import { UserData } from '../../shared/types/user';
export declare abstract class ProtectedPage extends LitElement {
    protected isAuthenticated: boolean;
    protected loading: boolean;
    protected userData: UserData | null;
    connectedCallback(): Promise<void>;
    checkAuth(): Promise<void>;
    protected onAuthSuccess(): void;
    protected renderContent(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    protected renderLoading(): import("lit-html").TemplateResult<1>;
    protected renderUnauthenticated(): import("lit-html").TemplateResult<1>;
}
