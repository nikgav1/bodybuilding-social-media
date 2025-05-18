import axios, { AxiosResponse } from 'axios';
import { getToken } from './auth';
import { UserData } from '../types/user';

interface TokenValidationResponse {
  decoded: UserData;
}

export async function validateToken(): Promise<AxiosResponse<TokenValidationResponse> | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await axios.post<TokenValidationResponse>(
      '/api/validate-token',
      { token }
    );
    return response;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}
