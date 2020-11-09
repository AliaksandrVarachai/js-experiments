const protocol = 'http';
const host = 'localhost';
const port = 3001;

export const origin = `${protocol}://${host}:${port}`;

export const pageLoginPathname = '/static/login.html';
export const pageRegisterPathname = '/static/register.html';
export const apiLoginPathname = '/api/login';
export const apiRegisterPathname = '/api/register';
export const apiRefreshPathname = '/api/refresh';

export const pageLoginUrl = new URL(pageLoginPathname, origin).href;
export const pageRegisterUrl = new URL(pageRegisterPathname, origin).href;
export const apiLoginUrl = new URL(apiLoginPathname, origin);
export const apiRegisterUrl = new URL(apiRegisterPathname, origin);
export const apiRefreshUrl = new URL(apiRefreshPathname, origin);
