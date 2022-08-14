import { Request, Response, NextFunction } from 'express';
import * as path from 'path';

export interface IRequestWithRecipientUrl extends Request {
  recipientUrl: string;
}

// The service names must be set as environment variables
const recipientServiceNames = {
  product: 'PRODUCT_SERVICE',
  cart: 'CART_SERVICE',
};

export function recipientUrl(req: IRequestWithRecipientUrl, res: Response, next: NextFunction) {
  const originalUrl = new URL(req.originalUrl, 'https://fake.com')
  const [, recipient, ...afterRecipientPathnames] = originalUrl.pathname.split('/');
  const recipientServiceName = recipientServiceNames[recipient];
  if (!recipientServiceName) {
    const listOfAvailableServiceNames = `'${Object.keys(recipientServiceNames).join("', '")}'`;
    res.status(502).json({
      error: `Wrong service name '${recipient}' is provided. Available service names: ${listOfAvailableServiceNames}`,
    });
    return;
  }
  if (!process.env[recipientServiceName]) {
    res.status(500).json({ error: `Environment variable "${recipientServiceName}" must contain a service URL` });
    return
  }

  const recipientUrl = new URL(process.env[recipientServiceName]);
  recipientUrl.pathname = path.join(recipientUrl.pathname, ...afterRecipientPathnames);
  recipientUrl.search = originalUrl.search;
  req.recipientUrl = recipientUrl.toString();
  next();
}
