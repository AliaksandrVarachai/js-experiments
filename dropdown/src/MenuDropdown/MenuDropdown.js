import React, { createContext, useState, useContext, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes  from 'prop-types';

import './MenuDropdown.pcss';

const Context = createContext();

class Container extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      chosenValue: null
    };
    this.isClickInsideDropdown = false;
  }

  documentCaptureClickListener = event => {
    this.isClickInsideDropdown = false;
    console.log('documentCaptureClickListener set to ', this.isClickInsideDropdown);
  };

  documentBubbleClickListener = event => {
    console.log('documentBubbleClickListener read: ', this.isClickInsideDropdown)
    if (this.isClickInsideDropdown) return;
    this.setState({ isOpened: false });
  };


  componentDidMount() {
    document.addEventListener('click', this.documentCaptureClickListener, {
      capture: true,
      passive: true
    });
    document.addEventListener('click', this.documentBubbleClickListener, {
      passive: true
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentCaptureClickListener);
    document.removeEventListener('click', this.documentBubbleClickListener);
  }

  clickHandler = event => {
    this.isClickInsideDropdown = true;
    console.log('clicked inside dropdown', this.isClickInsideDropdown);
  };

  setIsOpened = isOpened => this.setState({ isOpened });

  setChosenValue = chosenValue => this.setState({ chosenValue });

  render() {
    const contextValue = {
      isOpened: this.state.isOpened,
      setIsOpened: this.setIsOpened,
      chosenValue: this.state.chosenValue,
      setChosenValue: this.setChosenValue,
    };
    return (
      <div styleName="container" onClick={this.clickHandler}>
        <Context.Provider value={contextValue}>
          {this.props.children}
        </Context.Provider>
      </div>
    );
  }
}

function ItemsContainer({ children }) {
  const { isOpened } = useContext(Context);

  return (
    <div styleName={classnames('items-container', {'items-container--opened': isOpened})}>
      {children}
    </div>
  );
}

function Header({ children }) {
  const { isOpened, setIsOpened, chosenValue } = useContext(Context);

  const clickHandler = () => {
    console.log('Header', isOpened)
    setIsOpened(!isOpened);
  };

  return (
    <div
      styleName={classnames('header', {'header--opened': isOpened})}
      onClick={clickHandler}
    >
      {children}
    </div>
  );
}

function Item({ children, value }) {
  const { chosenValue, setChosenValue } = useContext(Context);

  const clickHandler = () => { setChosenValue(value); };

  return (
    <div
      styleName={classnames('item', {'item--chosen': chosenValue === value})}
      onClick={clickHandler}
    >
      {children}
    </div>
  );
}


export default {
  Container,
  Header,
  ItemsContainer,
  Item
};
