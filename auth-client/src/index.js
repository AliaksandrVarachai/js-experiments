const dataUrlString = 'http://localhost:3001/api/data';
const loginUrlString = 'http://localhost:3001/static/login.html';
const redirectOrigin = 'http://localhost:3001';
const dataNode = document.getElementById('data-section');
const errorNode = document.getElementById('error-section');
const maxRefreshAttemptNumber = 3;

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

const baseHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

(async () => {
  let refreshAttemptNumber = 0; // to avoid infinite loop with wrong access

  while (refreshAttemptNumber < maxRefreshAttemptNumber) {


    const response = await fetch(dataUrlString, {
      method: 'GET',
      headers: {
        ...baseHeaders,
        'X-Access-Token': accessToken
      }
    });

    const json = await response.json();

    if (response.ok) {
      const { data } = json;
      dataNode.innerText = JSON.stringify(data);
      return;
    }

    const { redirectUrl, refreshUrl } = json;

    if (redirectUrl) {
      redirectToLoginPage(redirectUrl);
      return
    }

    if (refreshUrl) {
      const refreshResponse = await fetch(refreshUrl, {
        method: 'GET',
        headers: {
          ...baseHeaders,
          'X-Refresh-Token': refreshToken
        }
      });

      if (!refreshResponse.ok) {
        const { redirectUrl } = await refreshResponse.json();
        if (!redirectUrl) {
          errorNode.innerText = `${Error.message}. Neither refresh nor redirect URL provided by refresh service.`
          return;
        }
        redirectToLoginPage(redirectUrl);
        return
      }

      // New access-token is successfully provided -> next attempt to get data
      const refreshJson = await refreshResponse.json();
      accessToken = refreshJson.accessToken;
      localStorage.setItem('accessToken', accessToken);
      ++refreshAttemptNumber;
    }
  }

  errorNode.innerText = `Max allowed attempts to refresh access token (${maxRefreshAttemptNumber}) is exceeded`;
})();

function redirectToLoginPage(redirectUrl) {
  const url = new URL(redirectUrl)
  const searchParams = new URLSearchParams(url.search);
  searchParams.set('redirect', location.href);
  url.search = searchParams.toString();
  location.href = url.href;
}
