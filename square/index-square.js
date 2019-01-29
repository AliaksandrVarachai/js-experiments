let defaultOptions = {
  width: 100,
  height: 100
};

console.log('****************');

export function increment(x) {
  return ++x;
}

export function decrement(x) {
  return --x;
}

export default function(customOptions) {
  const options = { ...defaultOptions, ...customOptions };

  const getWidth = () => options.width;

  const getHeight = () => options.height;

  const calculateHypotenuse = Math.hypot(options.width, options.height);

  return {
    getWidth,
    getHeight,
    calculateHypotenuse,
  }

}

