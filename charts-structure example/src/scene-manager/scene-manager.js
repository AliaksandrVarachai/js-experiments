import * as THREE from 'three';
import * as SFWrapper from '../spotfire-api-wrapper/spotfire-api-wrapper';
import SceneScaler from '../helpers/scene-scaler';
import DataWrapper from '../helpers/data-wrapper';
import ChartConfig from '../helpers/chart-config';
import Grid from '../scene-subjects/grid';
import Points from '../scene-subjects/points';

export default function SceneManager(canvas) {
  let { width, height } = canvas;
  let sceneSubjects = [];

  const renderBoxPlot = () => {
    SFWrapper.read('GetData', {})
      .then(response => {
        if (!response) {
          throw Error('Empty response is received.');
        }
        const jsonResponse = JSON.parse(response);
        const jsonData = JSON.parse(jsonResponse.Data);

        const chartConfig = new ChartConfig(jsonData, canvas, {});
        const dataWrapper = new DataWrapper(jsonData);

        const chartAxes = chartConfig.get().axes;
        const limitsByColumn = dataWrapper.getLimitsByColumn();

        const xScaler = new SceneScaler([limitsByColumn[0].MinValue, limitsByColumn[0].MaxValue], [chartAxes.rangeX.min, chartAxes.rangeX.max]);
        const yScaler = new SceneScaler([limitsByColumn[1].MinValue, limitsByColumn[1].MaxValue], [chartAxes.rangeY.min, chartAxes.rangeY.max]);

        // Scene subjects
        sceneSubjects = [
          new Grid(scene, dataWrapper, chartConfig, xScaler, yScaler),
          new Points(scene, dataWrapper, chartConfig, xScaler, yScaler),
        ];

        this.update();
      })
      .catch(err => {
        throw Error(err);
      });
  };


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

  // Constructor
  SFWrapper.addEventHandler('renderAdvancedBoxPlot', renderBoxPlot);
  SFWrapper.isReadyPromise.then(renderBoxPlot());
}
