export function promisify(func, that = window || global) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      func.call(that, ...args, function(result) {
        resolve(result);
      });
    });
  }
}
