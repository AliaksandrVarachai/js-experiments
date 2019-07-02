import * as THREE from "three";

export default function Points(scene, dataWrapper, xScaler, yScaler) {
  const dotSize = 10;
  const pointsGeometry = new THREE.Geometry();
  let pointsColors;
  let pointsMaterial;
  let points;


  this.update = function() {
    pointsColors = new Array(dataWrapper.length);
    dataWrapper.forEach((row, i) => {
      const vertex = new THREE.Vector3(
        xScaler.toRange(+dataWrapper.getValue(row, chart.axes.columnX)),
        yScaler.toRange(+dataWrapper.getValue(row, chart.axes.columnY)),
        0);
      pointsGeometry.vertices.push(vertex);
      pointsColors[i] = new THREE.Color(groupToColorMap[dataWrapper.getValue(row, chart.groupColumnName)]);
    });
    pointsGeometry.colors = pointsColors;


    pointsMaterial = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: THREE.VertexColors,
    });

    points = new THREE.Points(pointsGeometry, pointsMaterial);

    scene.add(points);
  }
}
