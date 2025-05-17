import axios from 'axios';

export function getToken() {
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  }
  return null;
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export async function signIn(email: string, password: string) {
  try {
    const res = await axios.post('/api/signin', { email, password });
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function signUp(
  userName: string,
  email: string,
  password: string
) {
  try {
    const res = await axios.post('/api/signup', { userName, email, password });
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
}
