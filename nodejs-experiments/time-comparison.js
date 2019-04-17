let i = 0;
const start = new Date();

function foo() {
  i++;
  if (i < 1000) {
    // setImmediate(foo); // 6 ms
    setTimeout(foo, 0);   // 1300 ms
  } else {
    console.log(`Execution time: ${new Date() - start}`)
  }
}

foo();
