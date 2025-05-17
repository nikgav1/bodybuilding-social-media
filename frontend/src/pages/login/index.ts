import { signIn, setToken } from '../../shared/scripts/auth';
const form = document.getElementById('login-form') as HTMLFormElement;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement)
    .value;

  const token = await signIn(email, password);
  if (token && token.data && token.data.token) {
    setToken(token.data.token);
    window.location.href = '/';
  } else {
    console.error('Login failed');
  }
});
