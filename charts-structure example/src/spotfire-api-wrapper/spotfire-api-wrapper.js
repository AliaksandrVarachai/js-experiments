/**
 * Signals that global Spotfire object is initialized.
 * @type {Promise<null>}
 */
export const isReadyPromise = new Promise((resolve, reject) => {
  window.addEventListener('SpotfireLoaded', () => {
    resolve(null);
  });
});

/**
 * Wrapper for calling of Spotfire.addEventHandler method.
 * @param {string} command - command name passed as the first argument to Spotfire.addEventHandler() method.
 * @param {function} listener - listener.
 * @returns {Promise<any | never>}
 */
export function addEventHandler(command, listener) {
  return isReadyPromise
    .then(_ => Spotfire.addEventHandler(command, listener));
}

/**
 * Wrapper for calling of Spotfire.read method.
 * @param {string} command - command name passed as the first argument to Spotfire.read() method.
 * @param {object} params - passed settings.
 * @returns {Promise<any | never>}
 */
export function read(command, params = {}) {
  return isReadyPromise
    .then(_ => new Promise((resolve, reject) => {
      Spotfire.read(command, params, result => resolve(result))
    }));
}
