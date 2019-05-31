import Chart from 'chart.js';

Chart.defaults.global.animation.duration  = 0;  // turn off the animation


const ctxChartBar = document.getElementById('chart-bar');
const chartBar = new Chart(ctxChartBar, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    maintainAspectRatio: false
  },

});

const n = 100;
const scatterData = new Array(n);

const startDataCalculation = Date.now();

for (let i = 0; i < n; i++) {
  scatterData[i] = {
    x: Math.random() * 100,
    y: 5 + Math.random() * 10
  };
}

const dataIsReady = Date.now();
console.log(`Spent on data calculation: ${dataIsReady - startDataCalculation} ms`);

const ctxChartLine = document.getElementById('chart-line');
const chartLine = new Chart(ctxChartLine, {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Y from X dependency',
      data: scatterData,
      backgroundColor: 'red',
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 20
        },
        type: 'linear',
        position: 'left',
      }],
      xAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100
        },
        type: 'linear',
        position: 'bottom'
      }]
    },
    maintainAspectRatio: false
  }
});

const chartIsReady = Date.now();

console.log(`Spent on a chart build: ${chartIsReady - dataIsReady} ms`);

/* WebGL */
(function() {
  const canvas = document.getElementById('chart-webgl');
  stretchCanvas(canvas); // throws
  const ctx = canvas.getContext('webgl');
  if (ctx === null) {
    alert ('Browser does not support WebGL');
    return;
  }

  ctx.clearColor(0.0, 1.0, 1.0, 1);
  ctx.clear(ctx.COLOR_BUFFER_BIT);
})();

/* 2D */
(function(n) {
  const canvas = document.getElementById('chart-2d');
  stretchCanvas(canvas); // throws an error

  // generation of data
  const data = new Array(n);
  for (let i = 0; i < n; i++) {
    data[i] = {
      x: Math.random() * 100,
      y: 5 + Math.random() * 10
    };
  }

  // drawing points
  const chart = createChart(canvas, {});
  for (let i = 0; i < n; i++) {
    chart.drawPoint(data[i]);
  }
})(1e2);

function stretchCanvas(canvas) {
  const container = canvas.parentNode;
  const containerStyle = getComputedStyle(container);
  const position = containerStyle.getPropertyValue('position');
  if (position === 'static')
    throw Error('Parent element must have different from "static" position');

  // TODO: absolute position if it is better
  canvas.width = parseFloat(containerStyle.getPropertyValue('width'));
  canvas.height = parseFloat(containerStyle.getPropertyValue('height'));
}

function createChart(canvas, chartOptions = {}) {
  const chartDefaultOptions = {
    points: {
      borderColor: 'black',
      backgroundColor: 'red',
      size: 4,       // canvas px (even number is preferable)
      borderWidth: 1 // canvas px
    },
    axes: {
      x: {
        isLTR: true,
        minX: 0,
        maxX: 100
      },
      y: {
        isBTU: true,
        minY: 0,
        maxY: 20
      }
    }
  };

  const chartMergedOptions = { ...chartDefaultOptions, ...chartOptions };

  const ctx = canvas.getContext('2d', { alpha: false });

  function xToCanvas(x) {
    const { minX, maxX, isLTR } = chartMergedOptions.axes.x;
    return isLTR
      ? x / (maxX - minX) * canvas.width
      : (1 - x / (maxX - minX)) * canvas.width;
  }

  function yToCanvas(y) {
    const { minY, maxY, isBTU } = chartMergedOptions.axes.y;
    return isBTU
      ? (1 - y / (maxY - minY)) * canvas.height
      : y / (maxY - minY) * canvas.height;
  }

  function drawPoint({x, y}) {
    const { borderColor, backgroundColor, size, borderWidth } = chartMergedOptions.points;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
      Math.round(xToCanvas(x - size / 2)),
      Math.round(yToCanvas(y - size / 2)),
      size,
      size
    );
  }

  return {
    drawPoint,
  };
}
