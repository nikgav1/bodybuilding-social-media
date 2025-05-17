import { LitElement } from 'lit';
export declare class ProfilePage extends LitElement {
    private isAuthenticated;
    private loading;
    private userData;
    connectedCallback(): Promise<void>;
    checkAuth(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
