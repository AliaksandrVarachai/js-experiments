const defaultOptions = {
  path: process.cwd(),
  delay: 1000,
};

class DirWatcher {
  constructor() {
    console.log('DirWatcher constructor is called');
  }

  // TODO: add flow
  watch(path = defaultOptions.path, delay = defaultOptions.delay) {
    console.log('watch is called');
  }
}
