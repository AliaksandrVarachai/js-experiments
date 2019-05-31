import * as Three from 'three';

/* WebGL */
;(function() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new Three.Scene();
  const camera = new Three.PerspectiveCamera(75, width/height, 0.1, 1000);
  const renderer = new Three.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement)

  const geometry = new Three.BoxGeometry(1, 1, 1);
  const material = new Three.MeshBasicMaterial({color: 0x00ff00});
  const cube = new Three.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

})();