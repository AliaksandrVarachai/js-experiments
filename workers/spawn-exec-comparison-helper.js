const interval = setInterval(() => {
  console.log('module-data');
  if (interval._idleStart > 5000) {
    console.log('END of data');
    clearInterval(interval);
  }
}, 1000);