import * as THREE from 'three';

const options = {
  name: 'normal',
  length: 1000,
  params: {
    mean: 300,
    sigma: 100
  }
};

// const options = {
//   name: 'uniform',
//   length: 1000,
//   params: {
//     min: 0,
//     max: 600
//   }
// };

const searchParams = new URLSearchParams();
searchParams.append('name', options.name);
searchParams.append('length', options.length);
Object.keys(options.params).forEach(key => searchParams.append(key, options.params[key]));
searchParams.append('name', options.name);

/* Three.js */
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

  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  scene.background = new THREE.Color(0xffffff);

  const pointsGeometry = new THREE.Geometry();

  const colors = new Array(n);
  for (let i = 0; i < n; i++) {
    const datum =  generatedData[i];
    const vertex = new THREE.Vector3(datum.position[0], datum.position[1], 0);
    pointsGeometry.vertices.push(vertex);
    colors[i] = new THREE.Color(groupColors[datum.group]);
  }
  pointsGeometry.colors = colors;

  const pointsMaterial = new THREE.PointsMaterial({
    size: 4,
    vertexColors: THREE.VertexColors,
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);

  scene.add(points);

  camera.position.z = 5;

  function animate() {
    renderer.render(scene, camera);
  }
  animate();

}).catch(err => {
  throw(err);
});







