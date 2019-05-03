import React from 'react';

export default class Hello extends React.Component {

  UNSAFE_componentWillMount() {
    // console.log('UNSAFE_componentWillMount')
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount')
  }

  render () {
    return (
      <h1>Hello</h1>
    )
  }
}