const messageToSendNode = document.getElementById('message-to-send');
const receivedMessageNode = document.getElementById('received-message');
const sendNode = document.getElementById('send');

let parentPort;

sendNode.onclick = function(event) {
  console.log('Container says: ' + messageToSendNode.value);
  //window.parent.postMessage(messageToSendNode.value, '*');
  parentPort.postMessage(messageToSendNode.value);
};

// fires just first time (when port is transferred to the current window)
window.onmessage = function(event) {
  parentPort = event.ports[0];
  parentPort.onmessage = function(event) {
    receivedMessageNode.innerText = event.data;
  };
};

// Message for all other contexts "I am loaded"
// when window.onmessage listener is ready to accept a ChannelPort object
setTimeout(function() {
  window.parent.postMessage('READY', '*');
}, 3000);
