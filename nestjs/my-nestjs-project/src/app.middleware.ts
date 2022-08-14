import { Request, Response, NextFunction } from 'express';

// The service names must be set as environment variables
const recipientServiceNames = {
  product: 'PRODUCT_SERVICE',
  cart: 'CART_SERVICE',
};

export function recipientUrl(req: Request, res: Response, next: NextFunction) {
  console.log('Middleware is called');
  next();
}


