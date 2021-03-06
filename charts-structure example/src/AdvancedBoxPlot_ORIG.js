// import $ from 'jquery';
import * as THREE from 'three';
import * as d3Array from 'd3-array';
import font from 'three/examples/fonts/optimer_regular.typeface.json';


// Add color schema to the chart object
const groupColors = [
  'red',
  'green',
  'blue',
  'orange',
  'brown',
  'pink',
  'yellow',
  'purple',
  // TODO add check for color numbers
];

window.addEventListener('SpotfireLoaded', function() {
  var createAdvancedBoxPlot = function (container) {
    let width, height;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    function update() {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      renderer.sortObjects = false;
    }

    update();

    return {
      width,
      height,
      renderer,
      update,  // is to be called on resize
    };
  };


  const boxPlot = createAdvancedBoxPlot(document.body); // TODO: add container style via CSS


  var render = function () {
    Spotfire.read("GetData", {}, parseResult);
  };

  function parseResult(result) {
    document.body.oncontextmenu = function(event) {
      Spotfire.modify("ShowProperties", {});
    };

    if (!result) {
      throw Error('Empty response is received.');
    }
    const jsonResult = JSON.parse(result);
    const wrappedData = createDataWrapper(JSON.parse(jsonResult.Data));
    console.log(JSON.parse(jsonResult.Data))

    const chart = {
      margins: {
        left: 80,
        right: 20,
        top: 20,
        bottom: 40
      },
      groupColumnName: 'group5',
    };
    chart.axes = {
      columnX: 'par1',
      columnY: 'par2',
      rangeX: {
        min: chart.margins.left,
        max: boxPlot.width - chart.margins.right
      },
      rangeY: {
        min: chart.margins.bottom,
        max: boxPlot.height - chart.margins.top
      },
    };

    const groupSet = new Set();
    let xMin = +wrappedData.getXValue(0);
    let yMin = +wrappedData.getYValue(0);
    let xMax = xMin,
        yMax = yMin;
    wrappedData.forEach((row, index) => {
      groupSet.add(wrappedData.getColor(index))
      const x = +wrappedData.getXValue(row);
      const y = +wrappedData.getYValue(row);
      if (x < xMin) {
        xMin = x;
      } else if (x > xMax) {
        xMax = x;
      }
      if (y < yMin) {
        yMin = y;
      } else if (y > yMax) {
        yMax = y;
      }
    });
    const groups = [];
    groupSet.forEach(group => groups.push(group));
    groups.sort();
    const groupToColorMap = {};
    groups.forEach((group, inx) => {
      groupToColorMap[group] = groupColors[inx];
    });

    const xTicksDensity = 50;  // px per tick
    const yTicksDensity = 50;  // px per tick

    const xOffset = 0.2 * (xMax - xMin);
    const yOffset = 0.2 * (yMax - yMin);
    const xTicks = d3Array.ticks(xMin - xOffset, xMax + xOffset, Math.floor((chart.axes.rangeX.max - chart.axes.rangeX.min) / xTicksDensity));
    const yTicks = d3Array.ticks(yMin - yOffset, yMax + yOffset, Math.floor((chart.axes.rangeY.max - chart.axes.rangeY.min) / yTicksDensity));

    // TODO: add fix to cover with ticks the whole range
    const xStep = xTicks[1] - xTicks[0];
    xTicks.shift(xTicks[0] - xStep);
    xTicks.push(xTicks[xTicks.length - 1] + xStep);
    const yStep = yTicks[1] - yTicks[0];
    yTicks.shift(yTicks[0] - yStep);
    yTicks.push(yTicks[yTicks.length - 1] + yStep);

    chart.axes.domainX = {
      min: xTicks[0],
      max: xTicks[xTicks.length - 1]
    };
    chart.axes.domainY = {
      min: yTicks[0],
      max: yTicks[yTicks.length - 1]
    };
    const xScaler = createScaleTransformer([chart.axes.domainX.min, chart.axes.domainX.max], [chart.axes.rangeX.min, chart.axes.rangeX.max]);
    const yScaler = createScaleTransformer([chart.axes.domainY.min, chart.axes.domainY.max], [chart.axes.rangeY.min, chart.axes.rangeY.max]);

    const camera = new THREE.OrthographicCamera(0, boxPlot.width, boxPlot.height, 0, 0, 1000);
    camera.position.z = 100;
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    camera.getWorldDirection(cameraDirection);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // Draw grid
    // TODO: add show XY gird flag
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

    // Draw points
    const pointsGeometry = new THREE.Geometry();
    const pointsColors = new Array(wrappedData.length);
    wrappedData.forEach((row, i) => {
      const vertex = new THREE.Vector3(
        xScaler.toRange(+wrappedData.getXValue(row)),
        yScaler.toRange(+wrappedData.getYValue(row)),
        0);
      pointsGeometry.vertices.push(vertex);
      pointsColors[i] = new THREE.Color(groupToColorMap[wrappedData.getColor(i)]);
    });
    pointsGeometry.colors = pointsColors;

    const dotSize = 10;
    const pointsMaterial = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: THREE.VertexColors,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    scene.add(points);

    // Integration
    const pointThreshold = dotSize / 2;
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = pointThreshold;

    const mouse = new THREE.Vector3(0, 0, camera.position.z);
    const mouseTransformer = createMouseTransformer(boxPlot.renderer, mouse); // calls update for mouse;

    let previousIntersects = [];

    function onMouseMove(event) {
      points.geometry.colorsNeedUpdate = true;
      mouseTransformer.toRange(event.clientX, event.clientY);
      raycaster.set(mouse, cameraDirection);

      const intersects = raycaster.intersectObject(points);

      for (let i = 0; i < previousIntersects.length; i++) {
        const index = previousIntersects[i].index;
        // sets old color
        points.geometry.colors[index].set(groupToColorMap[wrappedData.getColor(index)]);
      }


      for (let i = 0; i < intersects.length; i++) {
        points.geometry.colors[intersects[i].index].set(0x000000);
      }
      previousIntersects = intersects;
      boxPlot.renderer.render(scene, camera);
      //console.log(`intersected ${intersects.length} points`)
    }

    // function animate() {
    //   requestAnimationFrame(animate);
    //   boxPlot.renderer.render(scene, camera);
    // }



    window.addEventListener('mousemove', onMouseMove, false);

    // animate();
    boxPlot.renderer.render(scene, camera);

  }



  Spotfire.addEventHandler("renderAdvancedBoxPlot", render);
  render();
});

function createDataWrapper(data) {
  let columns;

  function update() {
    columns = {};
    data.Columns.forEach((columnName, inx) => {
      columns[columnName] = inx;
    });
  }

  update();

  // row can be object or a number index
  function getValue(row, axisIndex) {
    if (typeof row === 'number')
      return data.Rows[row].R[axisIndex];
    if (typeof row === 'object')
      return row.R[axisIndex];
    throw Error(`Row must be an object or a number, but ${typeof row} provided.`);
  }

  // generates a group by index
  function getColor(index) {
    return 'color' + (index % 5);
  }

  return {
    get length() { return data.Dimensions.RowCount; },
    getXValue: (row) => getValue(row, 0),
    getYValue: (row) => getValue(row, 1),
    getColor,
    forEach: callback => data.Rows.forEach(callback),
    update,
  };
}


function createScaleTransformer([domainMin, domainMax], [rangeMin, rangeMax]) {
  if (domainMin === domainMax || rangeMin === rangeMax)
    throw Error('Both domain and range must contain different elements.');
  const dDomain = domainMax - domainMin;
  const dRange = rangeMax - rangeMin;

  return {
    toRange: x => rangeMin + dRange / dDomain * (x - domainMin),
    toRangeW: size => dRange / dDomain * size,
    toDomain: y => domainMin + dDomain / dRange * (y - rangeMin)
  };
}

// TODO: update on resize and scroll
function createMouseTransformer(renderer, mouse) {
  let rect, borderLeft, borderTop, height;
  const canvas = renderer.domElement;

  function update() {
    rect = canvas.getBoundingClientRect();
    const canvasStyle = getComputedStyle(canvas);
    borderLeft = parseFloat(canvasStyle.getPropertyValue('border-left'));
    borderTop = parseFloat(canvasStyle.getPropertyValue('border-top'));
    height = renderer.getSize().height;
  }

  update();

  return {
    toRange: (clientX, clientY) => {
      mouse.x = clientX - rect.left - borderLeft;
      mouse.y = height - (clientY - rect.top - borderTop);
    },
    update
  }
}
