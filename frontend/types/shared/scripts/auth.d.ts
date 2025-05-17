export declare function getToken(): string | null;
export declare function setToken(token: string): void;
export declare function removeToken(): void;
export declare function signIn(email: string, password: string): Promise<false | import("axios").AxiosResponse<any, any>>;
export declare function signUp(userName: string, email: string, password: string): Promise<false | import("axios").AxiosResponse<any, any>>;
