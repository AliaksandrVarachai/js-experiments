const eventBusChannel = new MessageChannel();
const eventBusPort1 = eventBusChannel.port1;

const eventNames = {};

eventBusPort1.onmessage = function(event) {
  // console.log('Port1 received: ' + event.data);
  const [eventListenerMethod, eventName] = event.data.split(':');
  if (!eventListenerMethod || !eventName)
    throw Error(`Post message cannot be converted to eventListenerMethod and eventName: "${event.data}"`);
  // eventListenerMethod = 'addEventListener' || 'removeEventListener'
  if (eventListenerMethod === 'addEventListener') {
    // eventBus is singleton, so only every listener will be added only once
    eventNames[eventName] = function(event) {
      eventBusPort1.postMessage(eventName);
    }
  }
  document[eventListenerMethod](eventName, eventNames[eventName]);
  if (eventListenerMethod === 'removeEventListener') {
    // eventBus is singleton, so only every listener will be added only once
    eventNames[eventName] = null;
  }

};

window.addEventListener('message', function readyPostMessageListener(event) {
  if (event.data !== 'READY') // check the origin
    return;
  frames[0].postMessage('PORT', event.origin, [eventBusChannel.port2]);
  window.removeEventListener('message', readyPostMessageListener);
});
