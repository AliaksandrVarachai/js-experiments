const dataUrlString = 'http://localhost:3001/api/data';
const loginUrlString = 'http://localhost:3001/static/login.html';
const redirectOrigin = 'http://localhost:3001';
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

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
if (accessToken) headers['X-Access-Token'] = accessToken;
if (refreshToken) headers['X-Refresh-Token'] = refreshToken;

let isOk = false;
fetch(dataUrlString, {
  method: 'GET',
  headers
})
  .then(response => {
    isOk = response.ok;
    return response.json();
  })
  .then(json => {
    if (isOk) {
      const { data } = json;
      appNode.innerText = JSON.stringify(data);
      return;
    }
    const { message, redirectUrl } = json;
    if (redirectUrl) {
      const url = new URL(redirectUrl)
      const searchParams = new URLSearchParams(url.search);
      searchParams.set('redirect', location.href);
      url.search = searchParams.toString();
      location.href = url.href;
      return;
    }
    appNode.innerText = message;
  })
  .catch(({ message }) => {
    console.error(message);
    appNode.innerText = message;
  });
