// document.body.innerText = 'hello world';
document.getElementById('root').innerText = 'hello world';

const btHome = document.getElementById('bt-home');
const btRoute1 = document.getElementById('bt-route-1');
const btRoute2 = document.getElementById('bt-route-2');

const historyStates = {
  home: 'home data',
  route1: 'route 1',
  route2: 'route 2',
};


btHome.onclick = () => {
  // location.replace('/home');
  // location.path = '/home';
  history.pushState(historyStates.home, '', '/home');
};

btRoute1.onclick = () => {
  history.pushState(historyStates.route1, '', '/route-1');
};

btRoute2.onclick = () => {
  history.pushState(historyStates.route2, '', '/route-2');;
};

window.addEventListener('popstate', (event) => {
  console.log('****** event.state=', event.state, window.location);
});

function initializeState() {
  switch(window.location.path.split('/')[0]) {
    case 'route-1':
      return history.replaceState(history.route1);
    case 'route-2':
      return history.replaceState(history.route2);
    default:
      return history.replaceState(history.home);
  }
}

initializeState();

