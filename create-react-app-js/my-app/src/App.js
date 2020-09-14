import React, {useRef, useEffect} from 'react';
import './App.css';

const FocusableButton1 = React.forwardRef((props, ref) => (
  <button ref={ref}>
    {props.children}
  </button>
));

const FocusableButton2 = React.forwardRef((props, ref) => (
  <button ref={ref}>
    {props.children}
  </button>
));


function App() {
  const refText = useRef();
  const refButton1 = useRef();
  const refButton2 = useRef();

  useEffect(() => {
    if (refButton2) refButton2.current.focus();
  }, []);

  return (
    <div className="App">
      <header>
        Click tab to change focus
      </header>
      <br/><br/>
      <input type="text" ref={refText} tabIndex="0"/>
      <br/><br/>
      <FocusableButton1 ref={refButton1} tabIndex="1">
        Focusable 1
      </FocusableButton1>
      <br/><br/>
      <FocusableButton2 ref={refButton2} tabIndex="2">
        Focusable 2
      </FocusableButton2>
    </div>
  );
}

export default App;
