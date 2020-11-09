import { pageLoginPathname, apiRegisterUrl } from './config.js';

const formNode = document.getElementById('form');
const errorSectionNode = document.getElementById('error-section');

formNode.onsubmit = async function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (password !== confirmPassword) {
    errorSectionNode.innerText = 'Confirmed password does not match the entered password';
    return;
  }

  try {
    const response = await fetch(apiRegisterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      alert('Registration is successful!\n\nYou will be redirected to login.');
      location.pathname = pageLoginPathname;
      return;
    }
    const { error: { message }} = await response.json();
    errorSectionNode.innerText = message;
  } catch (error) {
    errorSectionNode.innerText = error.message;
  }
}

const loginLink = document.getElementById('login-link');
loginLink.onclick = function(event) {
  event.preventDefault();
  location.pathname = pageLoginPathname;
}
