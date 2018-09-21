const messageToSendNode = document.getElementById('message-to-send');
const receivedMessageNode = document.getElementById('received-message');
const sendNode = document.getElementById('send');

const channel = new MessageChannel();
let frameIsLoaded = false;

sendNode.onclick = function(event) {
  console.log('Container says: ' + messageToSendNode.value);
  if (!frameIsLoaded) {
    console.log('Wait a bit while frames are loading');
    return;
  }
  channel.port1.postMessage(messageToSendNode.value)
};

// Listen iframe
window.onmessage = function(event) {
  if (event.origin !== 'http://localhost:9080') {
    console.warn(`${event.origin} is not allowed`);
    return;
  }
  frameIsLoaded = true;
  window.frames[0].postMessage(messageToSendNode.value, event.origin, [channel.port2]);
  channel.port1.onmessage = function(event) {
    // It is not necessary to check an event.origin
    receivedMessageNode.innerText = event.data;
  };
};
