import * as THREE from 'three';
import * as d3Array from 'd3-array';
import font from 'three/examples/fonts/optimer_regular.typeface.json';

export default function Grid(scene, dataWrapper, chartConfig, xScaler, yScaler) {
  const xTicksDensity = 50;  // px per tick
  const yTicksDensity = 50;  // px per tick

  this.update = function() {
    const [{ MinValue: xMin, MaxValue: xMax }, { MinValue: yMin, MaxValue: yMax }] = dataWrapper.getLimitsByColumn();

    const chart = chartConfig.get();
    const xTicks = d3Array.ticks(xMin, xMax, Math.floor((chart.axes.rangeX.max - chart.axes.rangeX.min) / xTicksDensity));
    const yTicks = d3Array.ticks(yMin, yMax, Math.floor((chart.axes.rangeY.max - chart.axes.rangeY.min) / yTicksDensity));

    // Draw grid
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
  };

  // Constructor
  this.update();
}
