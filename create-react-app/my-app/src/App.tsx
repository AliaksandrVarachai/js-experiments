import React, {ReactElement, useRef, ReactNode, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

type Props = { children: string };
type Ref = HTMLButtonElement|null;

const FocusableButton1 = React.forwardRef<Ref, Props>((props, forwardedRef) => (
  <button ref={forwardedRef}>
    {props.children}
  </button>
));

const FocusableButton2 = React.forwardRef<Ref, Props>((props, forwardedRef) => (
    <button ref={forwardedRef}>
      {props.children}
    </button>
));


function App() {
  const refText = useRef<Ref>();
  const refButton1 = useRef<Ref>();
  const refButton2 = useRef<Ref>();

  // useEffect(() => {
  //     if (!!refButton2) refButton2.current.focus();
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        Click tab to change focus
      </header>
      {/*<input type="text" ref={refText}/>*/}

      <FocusableButton1 ref={refButton1}>
        Focusable 1
      </FocusableButton1>
      <FocusableButton2 ref={refButton2}>
        Focusable 2
      </FocusableButton2>
    </div>
  );
}

export default App;
