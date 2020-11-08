const formNode = document.getElementById('form');
const redirectUrlString = (new URL(document.location)).searchParams.get('redirect');
const redirectUrl = new URL(redirectUrlString);
const redirectHost = redirectUrl.host;

formNode.onsubmit = function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (password !== confirmPassword) {
    console.error('Confirmed password does not match the entered password.');
    return;
  }

  fetch(registerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(json => {
      if (json.error && json.error.message) throw Error(json.error.message);
      const { accessToken, refreshToken } = json;
      if (!accessToken || !refreshToken) throw Error('Response does not contain access/refresh token');
      const params = new URLSearchParams();
      params.set('access_token', accessToken);
      params.set('refresh_token', refreshToken);
      redirectUrl.search = params.toString();
      document.location = redirectUrl.href;
    })
    .catch (error => {
      console.error(error.message);
    });
}

const loginLink = document.getElementById('login-link');
loginLink.onclick = function(event) {
  event.preventDefault();
  location.pathname = '/static/login.html'
}
