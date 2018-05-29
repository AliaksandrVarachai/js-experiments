const form = document.querySelector('#form');

document.getElementById('start').onclick = function(e) {
  const creds = new PasswordCredential(form);

  navigator.credentials.store(creds)
    .then(function(creds) {
      console.log('creds=', creds)
    });
};


