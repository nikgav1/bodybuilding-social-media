import { LitElement } from 'lit';
export declare class AppRoot extends LitElement {
    private isAuthenticated;
    private mobileMenuOpen;
    connectedCallback(): void;
    checkAuthStatus(): void;
    handleLogout(): void;
    toggleMobileMenu(): void;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
