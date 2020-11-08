const dataUrlString = 'http://localhost:3001/api/data';
const loginUrlString = 'http://localhost:3001/static/login.html';
const appNode = document.getElementById('app');

const params = new URLSearchParams(location.search);
let accessToken = params.get('access_token') || localStorage.getItem('accessToken');
const refreshToken = params.get('refresh_token') || localStorage.getItem('refreshToken');
params.delete('access_token');
params.delete('refresh_token');
accessToken && localStorage.setItem('accessToken', accessToken);
refreshToken && localStorage.setItem('refreshToken', refreshToken);
// TODO: replace params with hash to avoid page reloading
// location.search = params.toString();

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
