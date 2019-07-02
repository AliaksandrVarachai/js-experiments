import * as THREE from 'three';
import * as SFWrapper from '../spotfire-api-wrapper/spotfire-api-wrapper';
import SceneScaler from '../helpers/scene-scaler';
import DataWrapper from '../helpers/data-wrapper';
import Grid from '../scene-subjects/grid';
import Points from '../scene-subjects/points';

export default function SceneManager(canvas) {
  let { width, height } = canvas;
  let sceneSubjects = [];

  SFWrapper.addEventHandlerAsync('renderAdvancedBoxPlot')
    .then(_ => SFWrapper.readAsync('GetData', {}))
    .then(response => {
      if (!response) {
        throw Error('Empty response is received.');
      }
      const jsonResponse = JSON.parse(response);
      const jsonData = JSON.parse(jsonResponse.Data);

      const chartConfig = new ChartConfig(jsonData, canvas, {});
      const dataWrapper = new DataWrapper(jsonData);

      const chartAxes = chartConfig.get().axes;
      const dataDimensions = dataWrapper.getDimensions();

      const xScaler = new SceneScaler([dataDimensions[0].MinValue, dataDimensions[0].MaxValue], [chartAxes.rangeX.min, chartAxes.rangeX.max]);
      const yScaler = new SceneScaler([dataDimensions[0].MinValue, dataDimensions[0].MaxValue], [chartAxes.rangeY.min, chartAxes.rangeY.max]);

      // Scene subjects
      sceneSubjects = [
        new Grid(scene, dataWrapper, xScaler, yScaler),
        new Points(scene, dataWrapper, xScaler, yScaler),
      ];

      // Public methods
      this.update = function() {
        for (let i = 0, len = sceneSubjects.length; i < len; i++) {
          sceneSubjects[i].update();
        }
        renderer.render(scene, camera);
      };

      this.onWindowResize = function() {
        width = canvas.width;
        height = canvas.height;
        camera.right = width;
        camera.top = height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
    })
    .catch(err => {
      throw Error(err);
    });

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
  renderer.setPixelRatio(DPR);
  renderer.setSize(width, height);
  renderer.sortObjects = false;
  renderer.flatShading = true;

  // Camera
  const camera = new THREE.OrthographicCamera(0, width, height, 0, 0, 1000);
  camera.position.z = 100;
  const cameraDirection = new THREE.Vector3(0, 0, -1);
  camera.getWorldDirection(cameraDirection);
}
