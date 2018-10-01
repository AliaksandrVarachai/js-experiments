const eventBusChannel = new MessageChannel();
const eventBusPort1 = eventBusChannel.port1;

/**
 * Contains properties with names of events are to sent via the message channel.
 * @type { {[eventName]: ?function} } - functions sending data via the message channel.
 */
const eventNames = {};

/**
 * Sends via the opened message channel names of events fired on the document.
 * @param {Object} event - a PostMessageEvent.
 * @param {string} event.data - in format `${eventListenerMethod}:${eventName}`, e.g. 'addEventListener:click'.
 */
eventBusPort1.onmessage = function(event) {
  const [eventListenerMethod, eventName] = event.data.split(':');
  if (!eventListenerMethod || !eventName)
    throw Error(`Post message cannot be converted to eventListenerMethod and eventName: "${event.data}"`);
  if (eventListenerMethod === 'addEventListener') {
    // eventBus is singleton, so every eventName will be added only once (it controls when eventName is added/removed)
    eventNames[eventName] = function(event) {
      eventBusPort1.postMessage(eventName);
    }
  }
  document[eventListenerMethod](eventName, eventNames[eventName]);
  if (eventListenerMethod === 'removeEventListener') {
    eventNames[eventName] = null;
  }

};

window.addEventListener('message', function readyPostMessageListener(event) {
  if (event.data !== 'READY') // check the origin
    return;
  frames[0].postMessage('PORT', event.origin, [eventBusChannel.port2]);
  window.removeEventListener('message', readyPostMessageListener);
});
