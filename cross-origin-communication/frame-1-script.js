let eventBusPort2;  // TODO: move to property of eventBus

function EventBus() {
  this.events = {}; // {name: Arrays.<function>}
}

const eventBus = new EventBus(); // must be a singleton

let areEventsDelegatedToParentWindow = true;  // must be set via webpack
console.log('Launched with areEventsDelegatedToParentWindow = ' + areEventsDelegatedToParentWindow.toString().toUpperCase());

if (areEventsDelegatedToParentWindow) {
  window.addEventListener('message', initializeEventBus);
  window.parent.postMessage('READY', '*');
} else {
  initializeEventBus(null, document);
}

/**
 * Creates a message channel with parent window when the first parameter is a non-null object (i.e. is called as a 'message' listener)
 * or calls events on event emitter object otherwise (i.e. is called with two params).
 * If the first param is null, then all events will be subscribed to event emitter passed as the second param.
 * If the first argument is not null, the second argument is ignored.
 * @param {Event|null} initEvent - link to an event instance.
 * @param {Object} [eventEmitter] - link to an event emitter.
 */
function initializeEventBus(initEvent, eventEmitter) {
  if (initEvent) {
    if (initEvent.data !== 'PORT') // check the origin
      return;
    window.removeEventListener('message', initializeEventBus);
    eventBusPort2 = initEvent.ports[0];

    eventBusPort2.onmessage = event => eventBus.dispatch(event.data);
  }

  EventBus.prototype.addEventListener = function(name, cb) {
    if (this.events[name]) {
      this.events[name].push(cb);
      if (!initEvent)
        eventEmitter.addEventListener(name, cb);
    } else {
      this.events[name] = [cb];
      if (initEvent) {
        eventBusPort2.postMessage(`addEventListener:${name}`);
      } else {
        eventEmitter.addEventListener(name, cb);
      }

    }
  };

  EventBus.prototype.removeEventListener = function(name, cb) {
    if (!this.events[name])
      throw Error(`There is no "${name}" event listener`);

    const removeEvent = name => {
      const { [name]: _, ...res } = this.events;
      return res;
    };

    const callbacks = this.events[name];
    if (cb) {
      const inx = callbacks.indexOf(cb);
      if (inx < 0)
        throw Error(`There is no passed callback in "${name}" event listener`);
      if (inx === 0 && callbacks.length === 1) {
        removeEvent(name);
        if (initEvent) {
          eventBusPort2.postMessage(`removeEventListener:${name}`); // no listeners anymore
        } else {
          eventEmitter.removeEventListener(name, cb);
        }
      } else {
        callbacks.splice(inx, 1);
        if (!initEvent)
          eventEmitter.removeEventListener(name, cb);
      }
    } else {
      removeEvent(name);
      if (initEvent) {
        eventBusPort2.postMessage(`removeEventListener:${name}`); // no listeners anymore
      } else {
        eventEmitter.removeEventListener(name, cb);
      }
    }
  };

  EventBus.prototype.dispatch = function(name) {
    if (!this.events[name])
      throw Error(`Dispatched "${name}" events is not found`);
    this.events[name].forEach(cb => cb());
  };

  // Tests
  const click1 = function(e) { console.log('frame:click from parent #1'); };
  const click2 = function(e) { console.log('frame:click from parent #2'); };
  const click3 = function(e) { console.log('frame:click from parent #3'); };
  const dblclick = function(e) { console.log('frame:dblclick from parent'); };
  const contextmenu = function(e) { console.log('frame:contextmenu from parent'); };
  eventBus.addEventListener('click', click1);
  eventBus.addEventListener('click', click2);
  eventBus.addEventListener('click', click3);
  eventBus.addEventListener('dblclick', dblclick);
  eventBus.addEventListener('contextmenu', contextmenu);

  setTimeout(() => {
    eventBus.removeEventListener('click', click1);
    eventBus.removeEventListener('click', click2);
    eventBus.removeEventListener('click', click3);
    eventBus.removeEventListener('dblclick', dblclick);
    eventBus.removeEventListener('contextmenu', contextmenu);
  }, 5000);
}

/*
window.addEventListener('message', function portPostMessageListener(event) {
  if (event.data !== 'PORT') // check the origin
    return;
  window.removeEventListener('message', portPostMessageListener);
  eventBusPort2 = event.ports[0];

  eventBusPort2.onmessage = function(event) {
    eventBus.dispatch(event.data); // fires local eventBus Event
  };

  EventBus.prototype.addEventListener = function(name, cb) {
    if (this.events[name]) {
      this.events[name].push(cb);
    } else {
      this.events[name] = [cb];
      eventBusPort2.postMessage(`addEventListener:${name}`); // the first time only
    }
  };

  EventBus.prototype.removeEventListener = function(name, cb) {
    if (!this.events[name])
      throw Error(`There is no "${name}" event listener`);

    const removeEvent = name => {
      const { [name]: _, ...res } = this.events;
      return res;
    };

    const callbacks = this.events[name];
    if (cb) {
      const inx = callbacks.indexOf(cb);
      if (inx < 0)
        throw Error(`There is no passed callback in "${name}" event listener`);
      if (inx === 0 && callbacks.length === 1) {
        removeEvent(name);
        eventBusPort2.postMessage(`removeEventListener:${name}`); // no listeners anymore
      } else {
        callbacks.splice(inx, 1);
      }
    } else {
      removeEvent(name);
      eventBusPort2.postMessage(`removeEventListener:${name}`); // no listeners anymore
    }
  };

  EventBus.prototype.dispatch = function(name) {
    if (!this.events[name])
      throw Error(`Dispatched "${name}" events is not found`);
    this.events[name].forEach(cb => cb());
  };

  // Tests
  const click1 = function(e) { console.log('frame:click from parent #1'); };
  const click2 = function(e) { console.log('frame:click from parent #2'); };
  const click3 = function(e) { console.log('frame:click from parent #3'); };
  const dblclick = function(e) { console.log('frame:dblclick from parent'); };
  const contextmenu = function(e) { console.log('frame:contextmenu from parent'); };
  eventBus.addEventListener('click', click1);
  eventBus.addEventListener('click', click2);
  eventBus.addEventListener('click', click3);
  eventBus.addEventListener('dblclick', dblclick);
  eventBus.addEventListener('contextmenu', contextmenu);

  setTimeout(() => {
    eventBus.removeEventListener('click', click1);
    eventBus.removeEventListener('click', click2);
    eventBus.removeEventListener('click', click3);
    eventBus.removeEventListener('dblclick', dblclick);
    eventBus.removeEventListener('contextmenu', contextmenu);
  }, 5000);
});

window.parent.postMessage('READY', '*'); // 'I am ready'
*/