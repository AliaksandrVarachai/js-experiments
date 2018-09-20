const messageToSendNode = document.getElementById('message-to-send');
const receivedMessageNode = document.getElementById('received-message');
const sendNode = document.getElementById('send');

const targetWindow = window.frames[0];

sendNode.onclick = function(event) {
  console.log('Container says: ' + messageToSendNode.value);
  targetWindow.postMessage(messageToSendNode.value, '*');
};

// Listen iframe
window.addEventListener('message', receiveMessage, false) ;

function receiveMessage(event) {
  // TODO: always check origin
  receivedMessageNode.innerText = event.data;
}
