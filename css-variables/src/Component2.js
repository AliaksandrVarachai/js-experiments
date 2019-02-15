import React from 'react';
import styles from './Component2.pcss';

console.log('\n**** Component2.js sees just its own variables:');
console.log('  component2: componentVar1=', styles.componentVar1);
console.log('  component2: componentVar2=', styles.componentVar2);

export default class Component1 extends React.Component {
  render() {
    return (
      <div styleName="container">
        <h3 styleName="header">
          Component #2: Header
        </h3>
        <div styleName="content">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque dignissimos dolor dolorum eligendi fuga, illum laborum molestias nisi non quo reiciendis, reprehenderit sint sunt tenetur velit vero voluptatem voluptates!
        </div>
      </div>
    )
  }
}
