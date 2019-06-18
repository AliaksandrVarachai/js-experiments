import * as THREE from 'three';
import * as d3Array from 'd3-array';

const groupColors = [
  'red',
  'green',
  'blue'
];

function fetchData(options, filters = []) {
  const searchParams = new URLSearchParams();
  searchParams.append('name', options.name);
  searchParams.append('length', options.length);
  Object.keys(options.params).forEach(key => searchParams.append(key, options.params[key]));

  return fetch(`http://localhost:9091/data?${searchParams}`, {
    headers: {
      'Accept': 'application/json',
      'My-Custom-Header': '42',
    }
  }).then(response => {
    if (!response.ok)
      throw Error(`HTTP error, status = ${response.status}`);
    return response.json();
  }).then(json => {
    const n = json.length;
    const jitteringWidth = 50;
    const generatedData = new Array(n);
    for (let i = 0; i < n; i++) {
      generatedData[i] = {
        position: [
          Math.round(Math.random() * jitteringWidth) - jitteringWidth / 2,   // x (jittering)
          json[i]                                                            // y (real value)
        ],
        group: Math.floor(Math.random() * groupColors.length),
        name: `Pint #${i}`
      };
    }
    return generatedData;
  });
}

fetchData({
  name: 'normal',
  length: 1e2,
  params: {
    mean: 300,
    sigma: 100
  }
}).then(generatedData => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  //renderer.setSize(width, height);
  renderer.setSize(400, 400)
  document.body.appendChild(renderer.domElement);

  let [xMin, yMin] = generatedData[0].position;
  let xMax = xMin,
      yMax = yMin;
  generatedData.forEach(datum => {
    if (datum.position[0] < xMin) {
      xMin = datum.position[0];
    } else if (datum.position[0] > xMax) {
      xMax = datum.position[0];
    }
    if (datum.position[1] < yMin) {
      yMin = datum.position[1];
    } else if (datum.position[1] > yMax) {
      yMax = datum.position[1];
    }
  });

  const xTicksDensity = 50;  // px per tick
  const yTicksDensity = 50;  // px per tick
  const chartMargins = {
    left: 10,
    right: 20,
    top: 20,
    bottom: 40
  };
  const xTicks = d3Array.ticks(xMin, xMax, Math.floor((width - chartMargins.left - chartMargins.right) / xTicksDensity));
  const yTicks = d3Array.ticks(yMin, yMax, Math.floor((height - chartMargins.top - chartMargins.bottom) / yTicksDensity));

  console.log(xMin, xMax, xTicks)
  console.log(yMin, yMax, yTicks)

  const camera = new THREE.OrthographicCamera(
    xTicks[0] - chartMargins.left,
    xTicks[xTicks.length - 1] + chartMargins.right,
    yTicks[yTicks.length - 1] + chartMargins.top,
    yTicks[0] + chartMargins.bottom,
    0,
    1000);
  camera.position.z = 100;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const pointsGeometry = new THREE.Geometry();
  const pointsColors = new Array(generatedData.length);
  generatedData.forEach((datum, i) => {
    const vertex = new THREE.Vector3(datum.position[0], datum.position[1], 0);
    pointsGeometry.vertices.push(vertex);
    pointsColors[i] = new THREE.Color(groupColors[datum.group]);
  });
  pointsGeometry.colors = pointsColors;

  const dotSize = 4;
  const pointsMaterial = new THREE.PointsMaterial({
    size: dotSize,
    vertexColors: THREE.VertexColors,
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);

  scene.add(points);

  // Draw grid
  // TODO: add show XY gird flag
  const gridColor = new THREE.Color(0xe5e8e8);
  const gridVertices = new Array((xTicks.length + yTicks.length) * 6);
  const gridColors = new Array((xTicks.length + yTicks.length) * 6);
  const xTicksMin = xTicks[0];
  const xTicksMax = xTicks[xTicks.length - 1];
  const yTicksMin = yTicks[0];
  const yTicksMax = yTicks[yTicks.length - 1];

  let j = 0;
  for (let i = 0; i < xTicks.length; i++) {
    gridVertices[j]     = xTicks[i];
    gridVertices[j + 1] = yTicksMin;
    gridVertices[j + 2] = 0;
    gridVertices[j + 3] = xTicks[i];
    gridVertices[j + 4] = yTicksMax;
    gridVertices[j + 5] = 0;
    gridColor.toArray(gridColors, j);
    gridColor.toArray(gridColors, j + 3);
    j += 6;
  }
  for (let i = 0; i < yTicks.length; i++) {
    gridVertices[j]     = xTicksMin;
    gridVertices[j + 1] = yTicks[i];
    gridVertices[j + 2] = 0;
    gridVertices[j + 3] = xTicksMax;
    gridVertices[j + 4] = yTicks[i];
    gridVertices[j + 5] = 0;
    gridColor.toArray(gridColors, j);
    gridColor.toArray(gridColors, j + 3);
    j += 6;
  }

  const gridGeometry = new THREE.BufferGeometry();
  gridGeometry.addAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
  gridGeometry.addAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));
  const gridMaterial = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});

  const grid = new THREE.LineSegments(gridGeometry, gridMaterial);

  scene.add(grid);

  renderer.render(scene, camera);


}).catch(err => {
  throw(err);
});


