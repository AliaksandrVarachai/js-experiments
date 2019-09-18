const defaultOptions = {
  args: [],        // e.g. [url, callback] or [url] for callback and promise versions responsively
  interval: 1000,  // ms, or (attemptCounter) => 100 * attemptCounter
  maxAttempts: 0,  // 0 - infinite
  maxDuration: 0,  // 0 - infinite,
  isPromise: true, // false for callback version
};

function retry(func, customOptions = {}) {
  const options = { ...defaultOptions, ...customOptions };
  let attemptCounter = 0;
  const startTime = Date.now();

  if (options.isPromise) {
    return retriedPromise();
  } else {
    retriedCallback();
  }


  function retriedPromise() {
    console.log(`attempt: ${attemptCounter}`);
    ++attemptCounter;
    return new Promise((resolve, reject) => {
      func(...options.args)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          const rejectTime = Date.now();
          if (isNewAttemptPossible(rejectTime)) {
            setTimeout(() => resolve(retriedPromise()), getWaitingTimeBeforeNewAttempt(rejectTime));
          } else {
            reject(err);
          }
        });
    });
  }


  function retriedCallback() {
    // const callback = options.args[options.args.length - 1];
    // if (!callback || typeof callback !== 'function')
    //   throw Error('Callback is not provided as last element of options.args[] or does not have function type.');
    // const argsWithoutCallback = options.args.filter(arg => arg !== callback);

    function proxyCallback(err, ...dataArgs) {
      ++attemptCounter;
      if (err) {
        const errorTime = Date.now();
        if (isNewAttemptPossible(errorTime)) {
          setTimeout(() => {
            func(...argsWithoutCallback, proxyCallback);
          }, getWaitingTimeBeforeNewAttempt(errorTime));
        } else {
          callback(err);
        }
      } else {
        callback(null, ...dataArgs);
      }
    }

    debugger;
    func(...argsWithoutCallback, proxyCallback);
  }


  function isNewAttemptPossible(errorTime) {
    return (options.maxAttempts <= 0 || options.maxAttempts > attemptCounter) &&
           (options.maxDuration <= 0 || options.maxDuration > errorTime - startTime);
  }


  function getWaitingTimeBeforeNewAttempt(errorTime) {
    const requiredIntervalFromStart = typeof options.interval === 'function'
      ? options.interval(attemptCounter)
      : options.interval * attemptCounter;
    return requiredIntervalFromStart - (errorTime - startTime);
  }
}



// test promise version (default settings)
let counter1 = 0;
function testPromiseVersion() {
  ++counter1;
  return new Promise((resolve, reject) => {
    if (counter1 > 5)
      resolve(42);
    else
      reject(new Error('Promise: Resource is not available yet'));
  });
}

retry(testPromiseVersion)
  .then(data => console.log(`Success! Received data: ${data}`))
  .catch(err => console.log(err.message));


// test callback version

let counter2 = 0;
function testCallbackVersion(callback) {
  ++counter2;
  if (counter2 > 10)
    callback(null, '2^256');
  else
    callback(new Error('Callback: Get off me!'))
}

retry(testCallbackVersion((err, data) => {
  if (err)
    console.log(err.message);
  else
    console.log(data);
}), {
  isPromise: false,
  maxAttempts: 5,
});

