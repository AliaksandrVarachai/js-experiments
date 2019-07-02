import { promisify } from "../helpers/promise-converter";

/**
 * Wrapper for calling of Spotfire.addEventHandler method.
 * @type {function} - function that calls Spotfire.addEventHandler with passed params and returns a promise.
 */
export const addEventHandlerAsync = promisify(Spotfire.addEventHandler, Spotfire);

/**
 * Wrapper for calling of Spotfire.addEventHandler method.
 * @type {function} - function that calls Spotfire.read with passed params and returns a promise.
 */
export const readAsync = promisify(Spotfire.read, Spotfire);
