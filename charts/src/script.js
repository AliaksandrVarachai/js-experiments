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

const n = 100000;
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
