const messageToSendNode = document.getElementById('message-to-send');
const receivedMessageNode = document.getElementById('received-message');
const sendNode = document.getElementById('send');

sendNode.onclick = function(event) {
  console.log('Frame #1 says: ' + messageToSendNode.value);
};


const targetWindow = window.parent;

sendNode.onclick = function(event) {
  console.log('Container says: ' + messageToSendNode.value);
  targetWindow.postMessage(messageToSendNode.value, '*');
};



window.addEventListener('message', receiveMessage, false) ;

function receiveMessage(event) {
  // TODO: always check origin
  receivedMessageNode.innerText = event.data;
}
