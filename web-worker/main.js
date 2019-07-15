main();

function main() {
  if (!window.Worker)
    return console.log('Browser does not support Web Workers.');

  const bt1 = document.getElementById('bt-1');
  const bt2 = document.getElementById('bt-2');
  const input1 = document.getElementById('input-1');
  const input2 = document.getElementById('input-2');

  const worker1 = new Worker('worker-1.js');
  const worker2 = new Worker('worker-2.js');

  bt1.onclick = function(event) {
    worker1.postMessage(input1.value);

  };

  bt2.onclick = function(event) {
    worker2.postMessage(input2.value);
  };

  worker1.onmessage = function(e) {
    console.log(e.data);
  };

  worker1.onerror = function(err) {
    const { message, filename, lineno } = err;
    console.log({ message, filename, lineno });
    err.preventDefault();
  };

  worker2.onmessage = function(e) {
    console.log(e.data);
  };





}

