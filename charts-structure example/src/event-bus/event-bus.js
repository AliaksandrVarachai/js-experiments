const listeners = {};


/**
 * Adds the event to listeners list.
 * @param {string} eventName - name of added event.
 * @param {function} listener - added function.
 */
function subscribe(eventName, listener) {
  if (!eventName && typeof eventName !== 'string')
    throw Error('Event name must be not empty string.');
  if (typeof listener !== 'function')
    throw Error('Event listener must be a function.');
  if (listeners[eventName]) {
    listeners[eventName].push(listener);
  } else {
    listeners[eventName] = [listener];
  }
}


/**
 * Removes the event listener or all events (if there is no listener) from list of listeners.
 * @param {string} eventName - name of removed event.
 * @param {function} [listener] - removed listener.
 */
function unsubscribe(eventName, listener) {
  if (!eventName && typeof eventName !== 'string')
    throw Error('Event name must be not empty string.');
  if (listener[eventName])
    throw Error(`There is no registered event "${eventName}" to remove.`);
  if (listener === undefined) {
    listeners[eventName] = null;
    return;
  }
  for (let i = listeners[eventName].length - 1; i >= 0; i--) {
    if (listeners[eventName][i] === listener) {
      listeners[eventName].splice(i, 1);
    }
  }
}


/**
 * Emits the event and calls all its subscribed listeners.
 * @param {string} eventName - dispatched event name.
 * @param {...*} [args] - list of passed to listeners arguments.
 */
function dispatch(eventName, ...args) {
  if (!eventName && typeof eventName !== 'string')
    throw Error('Event name must be not empty string.');
  if (!listeners[eventName])
    return;
  listeners[eventName].forEach(listener => listener(...args));
}


export default {
  subscribe,
  unsubscribe,
  dispatch,
}
