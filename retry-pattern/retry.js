const defaultOptions = {
  interval: 1000,  // ms, or (attemptCounter) => 100 * attemptCounter
  maxAttempts: 0,  // 0 - infinite
  maxDuration: 0,  // 0 - infinite,
  isPromise: true, // false for callback version
};


function retry(func, customOptions = {}) {
  const options = { ...defaultOptions, ...customOptions };
  let attemptCounter = 0;
  const startTime = Date.now();

  function retryPromise(...args) {
    ++attemptCounter;
    return new Promise((resolve, reject) => {
      func(...args)
        .then(response => resolve(response))
        .catch(err => {
          const rejectTime = Date.now();
          if (isNewAttemptPossible(rejectTime)) {
            setTimeout(() => resolve(retryPromise(...args)), getWaitingTimeBeforeNewAttempt(rejectTime));
          } else {
            reject(err);
          }
        });
    });
  }


  function retryCallback(...args) {
    const callback = args[args.length - 1];
    if (!callback || typeof callback !== 'function')
      throw Error('Callback must be provided as the last argument.');
    const argsWithoutCallback = args.slice(0, args.length - 1);

    function proxyCallback(err, ...data) {
      if (err) {
        const rejectTime = Date.now();
        if (isNewAttemptPossible(rejectTime)) {
          setTimeout(() => func(...argsWithoutCallback, proxyCallback), getWaitingTimeBeforeNewAttempt(rejectTime));
        } else {
          callback(err);
        }
      } else {
        callback(null, ...data);
      }
    }

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

  
  return options.isPromise ? retryPromise : retryCallback;
}



// test promise version (default settings)
let counter1 = 0;
function promisifiedFunc() {
  ++counter1;
  return new Promise((resolve, reject) => {
    if (counter1 > 5)
      resolve(42);
    else
      reject(new Error('Promise: Resource is not available yet'));
  });
}

const options1 = {
  maxAttempts: 2
};
const retriedPromise = retry(promisifiedFunc);
retriedPromise(options1)
  .then(data => console.log(`Success! Received data: ${data}`))
  .catch(err => console.log(err.message));


// test callback version

let counter2 = 0;
function callbackifiedFunc(callback) {
  ++counter2;
  if (counter2 > 10)
    callback(null, '2^256');
  else
    callback(new Error('Callback: Get off me!'))
}

const options2 = {
  isPromise: false,
  maxAttempts: 1,
};
const retriedCallback = retry(callbackifiedFunc, options2);
retriedCallback((err, data) => {
  if (err)
    console.log(err.message);
  else
    console.log(data);
});
