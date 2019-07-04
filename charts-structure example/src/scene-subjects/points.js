import * as THREE from "three";

const groupColors = [
  'red',
  'green',
  'blue',
  'orange',
  'brown',
  'pink',
  'yellow',
  'purple',
];
const groupThreeColors = groupColors.map(color => new THREE.Color(color));

function generateRandomColor() {
  return groupThreeColors[Math.floor(Math.random() * groupColors.length)];
}

export default function Points(scene, dataWrapper, chartConfig, xScaler, yScaler) {
  const dotSize = 10;
  const pointsGeometry = new THREE.Geometry();
  let pointsColors;
  let pointsMaterial;
  let points;

  this.update = function() {
    pointsGeometry.vertices.length = 0; // TODO: optimize
    const chart = chartConfig.get();
    pointsColors = new Array(dataWrapper.length);
    dataWrapper.forEach((row, i) => {
      const vertex = new THREE.Vector3(
        xScaler.toRange(+dataWrapper.getXValue(i)),
        yScaler.toRange(+dataWrapper.getYValue(i)),
        0);
      pointsGeometry.vertices.push(vertex);
      pointsColors[i] = generateRandomColor();
    });
    pointsGeometry.colors = pointsColors;


    pointsMaterial = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: THREE.VertexColors,
    });

    points = new THREE.Points(pointsGeometry, pointsMaterial);

    scene.add(points);
  };

  // Constructor
  this.update();
}
