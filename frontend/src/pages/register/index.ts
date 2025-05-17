import { signUp } from '../../shared/scripts/auth';
import { setToken } from '../../shared/scripts/auth';
const form = document.getElementById('register-form') as HTMLFormElement;

form.addEventListener('submit', async e => {
  e.preventDefault();

  const userName = (document.getElementById('username') as HTMLInputElement)
    .value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement)
    .value;

  const response = await signUp(userName, email, password);

  if (response && response.data && response.data.token) {
    setToken(response.data.token);
    window.location.href = '/spa/';
  } else {
    console.error('Registration failed');
  }
});
