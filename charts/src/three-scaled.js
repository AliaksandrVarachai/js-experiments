import * as THREE from 'three';
import * as d3Array from 'd3-array';
import font from 'three/examples/fonts/optimer_regular.typeface.json';

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
          Math.random() * jitteringWidth - jitteringWidth / 2,   // x (jittering)
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
  const width = 600;  // window.innerWidth;
  const height = 400; // window.innerHeight;
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
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

  const chart = {
    margins: {
      left: 80,
      right: 20,
      top: 20,
      bottom: 40
    }
  };
  chart.axes = {
    rangeX: {
      min: chart.margins.left,
      max: width - chart.margins.right
    },
    rangeY: {
      min: chart.margins.bottom,
      max: height - chart.margins.top
    }
  };

  const xOffset = 0.2 * (xMax - xMin);
  const yOffset = 0.2 * (yMax - yMin);
  const xTicks = d3Array.ticks(xMin - xOffset, xMax + xOffset, Math.floor((chart.axes.rangeX.max - chart.axes.rangeX.min) / xTicksDensity));
  const yTicks = d3Array.ticks(yMin - yOffset, yMax + yOffset, Math.floor((chart.axes.rangeY.max - chart.axes.rangeY.min) / yTicksDensity));
  // TODO: add fix to cover with ticks the whole range
  const xStep = xTicks[1] - xTicks[0];
  xTicks.shift(xTicks[0] - xStep);
  xTicks.push(xTicks[xTicks.length - 1] + xStep);
  const yStep = yTicks[1] - yTicks[0];
  yTicks.shift(yTicks[0] - yStep);
  yTicks.push(yTicks[yTicks.length - 1] + yStep);

  chart.axes.domainX = {
    min: xTicks[0],
    max: xTicks[xTicks.length - 1]
  };
  chart.axes.domainY = {
    min: yTicks[0],
    max: yTicks[yTicks.length - 1]
  };
  const xScaler = createScaleTransformer([chart.axes.domainX.min, chart.axes.domainX.max], [chart.axes.rangeX.min, chart.axes.rangeX.max]);
  const yScaler = createScaleTransformer([chart.axes.domainY.min, chart.axes.domainY.max], [chart.axes.rangeY.min, chart.axes.rangeY.max]);

  const camera = new THREE.OrthographicCamera(0, width, height, 0, 0, 1000);
  camera.position.z = 10;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const pointsGeometry = new THREE.Geometry();
  const pointsColors = new Array(generatedData.length);
  generatedData.forEach((datum, i) => {
    const vertex = new THREE.Vector3(xScaler.toRange(datum.position[0]), yScaler.toRange(datum.position[1]), 0);
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
    gridVertices[j]     = xScaler.toRange(xTicks[i]);
    gridVertices[j + 1] = yScaler.toRange(yTicksMin);
    gridVertices[j + 2] = 0;
    gridVertices[j + 3] = xScaler.toRange(xTicks[i]);
    gridVertices[j + 4] = yScaler.toRange(yTicksMax);
    gridVertices[j + 5] = 0;
    gridColor.toArray(gridColors, j);
    gridColor.toArray(gridColors, j + 3);
    j += 6;
  }
  for (let i = 0; i < yTicks.length; i++) {
    gridVertices[j]     = xScaler.toRange(xTicksMin);
    gridVertices[j + 1] = yScaler.toRange(yTicks[i]);
    gridVertices[j + 2] = 0;
    gridVertices[j + 3] = xScaler.toRange(xTicksMax);
    gridVertices[j + 4] = yScaler.toRange(yTicks[i]);
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

  // Draw grid labels
  const labelFontSize = 10;
  const labelFontColor = 0x000000;
  const labelFont = new THREE.Font(font);
  xTicks.forEach(x => {
    const labelShapes = labelFont.generateShapes(x.toString(), labelFontSize);
    const labelGeometry = new THREE.ShapeBufferGeometry(labelShapes);
    const labelMaterial = new THREE.MeshBasicMaterial({color: labelFontColor});
    labelGeometry.computeBoundingBox();
    const labelWidth = labelGeometry.boundingBox.max.x - labelGeometry.boundingBox.min.x;
    const labelHeight = labelGeometry.boundingBox.max.y - labelGeometry.boundingBox.min.y;
    labelGeometry.translate(-labelWidth / 2, -labelHeight, 0);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.x = xScaler.toRange(x);
    label.position.y = chart.margins.bottom - 5;
    scene.add(label);
  });
  yTicks.forEach(y => {
    const labelShapes = labelFont.generateShapes(y.toString(), labelFontSize);
    const labelGeometry = new THREE.ShapeBufferGeometry(labelShapes);
    const labelMaterial = new THREE.MeshBasicMaterial({color: labelFontColor});
    labelGeometry.computeBoundingBox();
    const labelWidth = labelGeometry.boundingBox.max.x - labelGeometry.boundingBox.min.x;
    const labelHeight = labelGeometry.boundingBox.max.y - labelGeometry.boundingBox.min.y;
    labelGeometry.translate(-labelWidth, -labelHeight / 2, 0);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.x = chart.margins.left - 5;
    label.position.y = yScaler.toRange(y);
    scene.add(label);
  });

  renderer.render(scene, camera);

  // ***************** Integration
  const raycaster = new THREE.Raycaster();
  const clientMouse = new THREE.Vector3();
  const mouse = new THREE.Vector2();

  const canvasTopLeft = new THREE.Object3D();
  canvasTopLeft.translate(0, height / 2, 0);
  canvasTopLeft.rotateX(Math.PI);
  scene.add(canvasTopLeft);

  function onMouseMove(event) {
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    clientMouse.set(event.clientX, event.clientY, 0);
    const canvasTopLeftWorldCoords = canvasTopLeft.localToWorld(clientMouse);
    //const _position = new THREE.Vector3();
    //console.log(canvasTopLeft.getWorldPosition(_position));
    //console.log('position:', _position)
    //console.log(canvasTopLeft.getWorldQuaternion())
    mouse.set(canvasTopLeftWorldCoords.x, canvasTopLeftWorldCoords.y);
    console.log(mouse.x, mouse.y);
    const selectedDots = [];
    for (let i = 0, len = generatedData.length; i < len; i++) {
      const pos = generatedData[i].position;
      if (mouse.x >= pos[0] - dotSize && mouse.x <= pos[0] + dotSize) {
        selectedDots.push(i);
      }
    }
    console.log(selectedDots);
  }

  function render() {
    raycaster.setFromCamera(mouse, camera);
    // const intersects = raycaster.intersectObjects(scene.children);
    const intersects = raycaster.intersectObjects(points);
    for (let i = 0; i < intersects.length; i++) {
      console.log(i);
      intersects[i].object.material.color.set(0xff0000);
    }
    renderer.render(scene, camera);
  }

  window.addEventListener('mousemove', onMouseMove, false);


}).catch(err => {
  throw(err);
});

function createScaleTransformer([domainMin, domainMax], [rangeMin, rangeMax]) {
  if (domainMin === domainMax || rangeMin === rangeMax)
    throw Error('Both domain and range must contain different elements.');
  const dDomain = domainMax - domainMin;
  const dRange = rangeMax - rangeMin;

  return {
    toRange: x => rangeMin + dRange / dDomain * (x - domainMin),
    toRangeW: size => dRange / dDomain * size,
    toDomain: y => domainMin + dDomain / dRange * (y - rangeMin)
  };
}



