import React from 'react';
import ReactDOM from 'react-dom'

import './index.html';
import styles from './index.pcss';
import Component1 from './Component1';
import Component2 from './Component2';

console.log('\n***** Variables imported from index.pcss:');
console.log('  headerColor=' + styles.headerColor);
console.log('  contentBackground=' + styles.contentBackground);
console.log('  contentHeight=' + styles.contentHeight);

console.log('\n**** Variables from components are not visible in index.js:')
console.log('  index: componentVar1=', styles.componentVar1);
console.log('  index: componentVar2=', styles.componentVar2);

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Component1 />
        <Component2 />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));


