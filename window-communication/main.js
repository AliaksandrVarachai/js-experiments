var btOpen = document.getElementById('bt-open');
var btSend = document.getElementById('bt-send');
var inputDataElement = document.getElementById('input-data');
var outputDataElement = document.getElementById('output-data');

var childReference = null;
var childUrl = 'child.html';

function onOpenedMessage(eventMsg) {
  // debugger;
  var data = eventMsg.data;
  if (!data || !data.type) {
    console.log('Post message is empty or does not have type.');
    return;
  }

  switch (data.type) {
    case 'event':
      if (data.payload === 'opened') {
        outputDataElement.innerText = 'window is just opened.';
      } else if (data.payload === 'closed') {
        childReference.removeEventListener('message', onOpenedMessage); // Is it necessary?
        childReference = null;
      } else {
        console.log(`Unknown payload "${data.payload}" for type "${data.type}"`);
      }
      break;
    case 'info':
      outputDataElement.innerText = eventMsg.data.payload;
      break;
    default:
      console.log(`Unknown type "${data.type}"`);
  }
}

btOpen.onclick = function(event) {
  if (childReference) {
    childReference.focus();
    return;
  }
  childReference = window.open(
    childUrl,
    'Child Name',
    'left=100,top=300,height=300,width=400,menubar=0,toolbar=0,location=1,status=1'
  );
  if (!childReference) {
    console.error('Window cannot be opened');
    return;
  }
  window.addEventListener('message', onOpenedMessage);
};

btSend.onclick = function(event) {
  if (!childReference) {
    console.log('First open a child window, please.');
    return;
  }
  window.postMessage({type: 'info', payload: inputDataElement.value}, location.origin);
};

window.onbeforeunload = function(event) {
  if (!childReference)
    return;
  childReference.close();
};
