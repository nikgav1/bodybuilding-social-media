import { ProtectedPage } from '../components/protected-page';
export declare class FeedPage extends ProtectedPage {
    private posts;
    private loadingPosts;
    private currentPage;
    private hasMorePosts;
    private isLoadingMore;
    private scrollObserver?;
    private scrollTarget?;
    protected onAuthSuccess(): void;
    loadFeedPosts(page?: number): Promise<void>;
    loadMorePosts(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    setupInfiniteScroll(): void;
    protected renderContent(): import("lit-html").TemplateResult<1>;
    handleLike(postId: string): Promise<void>;
    private renderPosts;
    static styles: import("lit").CSSResult;
}
