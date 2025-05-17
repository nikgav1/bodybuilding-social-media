import axios from 'axios';
import { getToken } from './auth';

export async function validateToken() {
  const token = getToken();
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  try {
    const res = await axios.post(
      '/api/validate-token',
      { token },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return res;
  } catch (error) {
    console.error('Token validation failed:', error);
    window.location.href = '/login';
    return false;
  }
}
