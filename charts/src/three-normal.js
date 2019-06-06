import * as THREE from 'three';

/* Three.js */
fetch('http://localhost:9091/data', {
  headers: {
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': '*'
  }
}).then(response => {
  if (!response.ok)
    throw Error(`HTTP error, status = ${response.status}`);
  return response.json();
}).then(data => {
  console.log(data)
  const rawGeneratedData = JSON.parse(data);
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
        rawGeneratedData,                             // x (real value)
        Math.round(Math.random() * 600) - 300      // y (jittering)
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







