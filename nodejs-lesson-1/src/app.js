import config from '../config/config.json';
import { User, Product } from  './models'

// import User from './models/User';
// import Product from './models/Product';

// require('@babel/register')({});
//const config = require('./config/config.json');

console.log(`Name: "${config.name}"`);

const user = new User('Denis');
const product = new Product('Car');


