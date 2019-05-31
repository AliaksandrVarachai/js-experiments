import * as THREE from 'three';

/* WebGL */
;(function() {
  const n = 2e6;
  const generatedData = new Array(n);
  const groupColors = [
    'red',
    'green',
    'blue'
  ];

  for (let i = 0; i < n; i++) {
    generatedData[i] = {
      position: [
        Math.round(Math.random() * 800) - 400,     // x
        Math.round(Math.random() * 600) - 300      // y
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
    // sizeAttenuation: false,  // for perspective camera only!!
    vertexColors: THREE.VertexColors,
    // map: circle_sprite,
    // transparent: true
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);

  scene.add(points);

  camera.position.z = 5;

  /*
  const redMaterial = new THREE.MeshBasicMaterial({color : 0xff0000});
  const greenMaterial = new THREE.MeshBasicMaterial({color : 0x00ff00});
  const blueMaterial = new THREE.MeshBasicMaterial({color : 0x0000ff});



  const circleGeometry = new THREE.CircleGeometry(10, 6);

  const redCircle = new THREE.Mesh(circleGeometry, redMaterial);
  const greenCircle = new THREE.Mesh(circleGeometry, greenMaterial);
  const blueCircle = new THREE.Mesh(circleGeometry, blueMaterial);

  scene.add(redCircle, greenCircle, blueCircle);
  redCircle.position.set(150, 0, 0 );
  greenCircle.position.set(0, 150, 0 );
  blueCircle.position.set(0, 0, -150 );
  */


  function animate() {
    //requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

})();