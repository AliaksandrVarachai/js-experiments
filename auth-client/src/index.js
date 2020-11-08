const dataUrlString = 'http://localhost:3001/api/data';
const loginUrlString = 'http://localhost:3001/static/login.html';
const appNode = document.getElementById('app');

const hashParams = new URLSearchParams(location.hash.substring(1));

let accessToken = hashParams.get('access_token')
if (accessToken) {
  localStorage.setItem('accessToken', accessToken);
  hashParams.delete('access_token');
} else {
  accessToken = localStorage.getItem('accessToken');
}

let refreshToken = hashParams.get('refresh_token');
if (refreshToken) {
  localStorage.setItem('refreshToken', refreshToken);
  hashParams.delete('refresh_token');
} else {
  refreshToken = localStorage.getItem('refreshToken');
}

location.hash = hashParams.toString();

if (accessToken && refreshToken) {
  fetch(dataUrlString, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    })
  })
    .then(response => response.json())
    .then(json => {
      const { data } = json;
      appNode.innerText = JSON.stringify(data);
    })
    .catch(error => {
      appNode.innerText = error.message;
    });
} else {
  const params = new URLSearchParams([['redirect', location.href]]);
  const apiUrlWithRedirect = new URL(loginUrlString);
  apiUrlWithRedirect.search = params.toString();
  location.href = apiUrlWithRedirect;
}
