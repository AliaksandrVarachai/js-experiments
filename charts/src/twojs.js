import Two from "two.js";

const options = {
  name: 'normal',
  length: 10000,
  params: {
    mean: 300,
    sigma: 100
  }
};

const searchParams = new URLSearchParams();
searchParams.append('name', options.name);
searchParams.append('length', options.length);
Object.keys(options.params).forEach(key => searchParams.append(key, options.params[key]));

fetch(`http://localhost:9091/data?${searchParams}`, {
  headers: {
    'Accept': 'application/json',
    'My-Custom-Header': '42',
  }
}).then(response => {
  if (!response.ok)
    throw Error(`HTTP error, status = ${response.status}`);
  return response.json();
}).then(rawGeneratedData => {
  if (rawGeneratedData === null)
    throw Error('Response contains null data');
  const n = rawGeneratedData.length;

  const groupColors = [
    'red',
    'green',
    'blue'
  ];
  const generatedData = new Array(n);
  for (let i = 0; i < n; i++) {
    generatedData[i] = {
      position: [
        rawGeneratedData[i],                          // x (real value)
        Math.round(Math.random() * 100) + 100      // y (jittering)
      ],
      group: Math.floor(Math.random() * groupColors.length),
      name: `Pint #${i}`
    };
  }

  const two = new Two({
    type: Two.Types.webgl,
    width: window.innerWidth,
    height: window.innerHeight,
  }).appendTo(document.body);

  for (let i = 0; i < n; i++) {
    const rectangle = two.makeRectangle(generatedData[i].position[0], generatedData[i].position[1], 5, 5);
    rectangle.lineWidth = 1;
    rectangle.fill = groupColors[generatedData[i].group];
  }




  // const rect = two.makeRectangle(213, 100, 100, 100);
  // rect.fill = 'rgb(0, 200, 255';
  // rect.opacity = 0.75;
  // rect.noStroke();

  two.update();
}).catch(err => {
  throw(err);
});

