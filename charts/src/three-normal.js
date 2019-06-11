import * as THREE from 'three';
import * as dat from "dat.gui";
const gui = new dat.GUI();

const options = {
  name: 'normal',
  length: 1e3,
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
  // TODO: add antialiasing just for arrows and text
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
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


  // BEGIN of AXES (does not work for a while)

  // class AxisGridHelper {
  //   constructor(units = 10) {
  //     const axes = new THREE.AxesHelper(200);
  //     axes.material.depthTest = false;
  //     axes.renderOrder = 2;  // after the grid
  //     scene.add(axes);
  //
  //     const grid = new THREE.GridHelper(units, units);
  //     grid.material.depthTest = false;
  //     grid.renderOrder = 1;
  //     scene.add(grid);
  //
  //     this.grid = grid;
  //     this.axes = axes;
  //     this.visible = false;
  //   }
  //   get visible() {
  //     return this._visible;
  //   }
  //   set visible(v) {
  //     this._visible = v;
  //     this.grid.visible = v;
  //     this.axes.visible = v;
  //   }
  // }
  //
  //
  // function makeAxisGrid(label, units) {
  //   const helper = new AxisGridHelper(units);
  //   gui.add(helper, 'visible').name(label);
  // }
  //
  // makeAxisGrid('Scatter Plot for X', 50);

  const grid = new THREE.GridHelper(1000, 10);
  grid.material.depthTest = false;
  grid.renderOrder = 1;
  grid.rotateX(Math.PI / 2);
  scene.add(grid);


  // END of AXES

  const axisCommonOptions = {
    hexColor: 0x000000,
    headLength: 30,
    headWidth: 10
  };

  const dirX = new THREE.Vector3(1, 0, 0);
  const dirY = new THREE.Vector3(0, 1, 0);
  const origin = new THREE.Vector3(0, 0, 0);

  const arrowHelperX = new THREE.ArrowHelper(
    dirX,
    origin,
    Math.floor(0.9 * width / 2),
    axisCommonOptions.hexColor,
    axisCommonOptions.headLength,
    axisCommonOptions.headWidth
  );
  const arrowHelperY = new THREE.ArrowHelper(
    dirY,
    origin, Math.floor(0.9 * height / 2),
    axisCommonOptions.hexColor,
    axisCommonOptions.headLength,
    axisCommonOptions.headWidth
  );
  scene.add(arrowHelperX, arrowHelperY);

  const raycaster = new THREE.Raycaster();
  const clientMouse = new THREE.Vector3();
  const mouse = new THREE.Vector2();

  const canvasTopLeft = new THREE.Object3D();
  canvasTopLeft.translateX(-width / 2);
  canvasTopLeft.translateY(height / 2);
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
    console.log(mouse.x, mouse.y)
  }

  camera.position.z = 100;

  function render() {
    raycaster.setFromCamera(mouse, camera);
    // const intersects = raycaster.intersectObjects(scene.children);
    const intersects = raycaster.intersectObjects(points);
    console.log('render')
    for (let i = 0; i < intersects.length; i++) {
      console.log(i);
      intersects[i].object.material.color.set(0xff0000);
    }
    renderer.render(scene, camera);
  }

  window.addEventListener('mousemove', onMouseMove, false);

  requestAnimationFrame(render);


}).catch(err => {
  throw(err);
});







