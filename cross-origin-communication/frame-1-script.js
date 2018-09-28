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
// setTimeout(function() {
//   window.parent.postMessage('READY', '*');
// }, 3000);


// EventBus listener
let eventBusPort2;

const portPostMessageListener = function(event) {
  if (event.data !== 'PORT') // check the origin
    return;
  window.removeEventListener('message', portPostMessageListener);
  eventBusPort2 = event.ports[0];
  eventBusPort2.onmessage = function(event) {
    // TODO: only eventBus events here or check is needed?
    eventBus.dispatch(event.data); // fires local eventBus Event
    ********
  }
};

window.addEventListener('message', portPostMessageListener);

window.parent.postMessage('READY', '*');


const generateId = (function generateId() {
  let counter = 0;
  return () => counter++;
})();

function EventBus() {
  this.listeners = {};
}

eventBus.prototype.addEventListener = function(name, callback, scope) {
  if (scope) {
    eventBusPort2.postMessage(name, generateId());
    *****
  } else {
    // like without iframes
  }
};


