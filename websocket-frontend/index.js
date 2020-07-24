;(function() {
  const content = document.getElementById('content');
  const input = document.getElementById('input');
  const status = document.getElementById('status');
  let myName = false;

  if (!WebSocket) {
    content.innerHtml = 'Sorry, but your browser <b>does not support WebSocket</b>';
    status.style.visibility = 'hidden';
    input.style.visibility = 'hidden';
    return;
  }

  const connection = new WebSocket('ws://127.0.0.1:1337');

  connection.onopen = function() {
    input.removeAttribute('disabled');
    status.innerText = 'Choose name:';
  };

  connection.onerror = function(err) {
    content.innerHtml = '<p>Sorry, but there is a problem with yout connection or the server is down</p>';
  };

  connection.onmessage = function(message) {
    let json;
    try {
      json = JSON.parse(message.data);
    } catch(e) {
      console.log(`This does not look like a valid JSON: ${message.data}`);
      return;
    }
    if (json.type === 'greeting') {
      status.innerText = json.data;
      input.removeAttribute('disabled');
      input.focus();
    } else if (json.type === 'history') {
      json.data.forEach(datum => {
        addMessage(datum.author, datum.text, new Date(datum.time));
      });
    } else if (json.type === 'message') {
      input.removeAttribute('disabled');
      const datum = json.data;
      addMessage(datum.author, datum.text, new Date(datum.time));
      input.focus();
    } else {
      console.log('Unrecognized json format:', json);
    }
  };

  input.onkeydown = function(e) {
    if (e.key === 'Enter') {
      const msg = this.value;
      if (!msg) return;
      connection.send(msg);
      this.value = '';
      input.setAttribute('disabled', '');

    }
  };


  function addMessage(author, message, dt) {
    content.insertAdjacentHTML('beforeend', `
      <p>
        <div>
          <b>${author}</b> ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}
        </div>
        ${message}
      </p>
    `);
  }
})();
