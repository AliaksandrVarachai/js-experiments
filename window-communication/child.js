window.postMessage({type: 'event', payload: 'opened'}, location.origin);

window.onbeforeunload = function() {
  window.postMessage({type: 'event', payload: 'closed'}, location.origin);
};

var btSend = document.getElementById('bt-send');
var inputDataElement = document.getElementById('input-data');
var outputDataElement = document.getElementById('output-data');

window.opener.onmessage = function(eventMsg) {
  var data = eventMsg.data;
  if (!data || !data.type) {
    console.log('Post message is empty or does not have type.');
    return;
  }

  if (data.type === 'info') {
    outputDataElement.innerText = data.payload;
  } else {
    console.log(data);
    console.log(window.opener)
    console.log(`Unknown type "${data.type}"`);
  }
};

btSend.onclick = function(event) {
  window.postMessage({type: 'info', payload: inputDataElement.value}, location.origin);
};
