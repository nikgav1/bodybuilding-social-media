import { AxiosResponse } from 'axios';
import { UserData } from '../types/user';
interface TokenValidationResponse {
    decoded: UserData;
}
export declare function validateToken(): Promise<AxiosResponse<TokenValidationResponse> | null>;
export {};
