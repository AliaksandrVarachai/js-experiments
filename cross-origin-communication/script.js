const messageToSendNode = document.getElementById('message-to-send');
const receivedMessageNode = document.getElementById('received-message');
const sendNode = document.getElementById('send');

sendNode.onclick = function(event) {
  console.log('Container says: ' + messageToSendNode.value);
  window.frames[0].postMessage(messageToSendNode.value, '*');
};

// Listen iframe
window.addEventListener('message', receiveMessage, false) ;

function receiveMessage(event) {
  // TODO: always check origin
  receivedMessageNode.innerText = event.data;
}
