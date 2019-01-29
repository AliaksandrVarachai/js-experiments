import Square , * as otherSquare from 'square';

import config from './config.json';

console.log('square consumer is loaded!');

fetch(config)
  .then(response => response.json())
  .then(config => {
    const square = Square(config);
    console.log('width=', square.getWidth());
    console.log('height=', square.getHeight());
    console.log('hypotenuse=', square.calculateHypotenuse);
    console.log(otherSquare.increment(110));
  })
  .catch(error => console.error(error.message));






