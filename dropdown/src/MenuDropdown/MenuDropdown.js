import React, { createContext, useState, useContext, useEffect, Children } from 'react';
import classnames from 'classnames';
import PropTypes  from 'prop-types';

import './MenuDropdown.pcss';

const Context = createContext();

// onChange, defaultValue, theme: default, black, null
class Container extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.any,
    theme: PropTypes.oneOf(['default', 'dark', 'none']),
    children: function(props, propName, componentName) {
      let headerCounter = 0;
      let itemsContainerCounter = 0;
      Children.toArray(props.children).forEach(child => {
        if (child.type === Header) ++headerCounter;
        if (child.type === ItemsContainer) ++itemsContainerCounter;
      });
      if (headerCounter * itemsContainerCounter !== 1)
        throw Error(`Header and ItemsContainer are obligatory children for ${componentName}`);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      chosenValue: props.defaultValue,
    };
    this.isClickInsideDropdown = false;
  }

  documentCaptureClickListener = event => {
    this.isClickInsideDropdown = false;
  };

  documentBubbleClickListener = event => {
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
    document.removeEventListener('click', this.documentCaptureClickListener, {
      capture: true
    });
    document.removeEventListener('click', this.documentBubbleClickListener);
  }

  clickHandler = () => {
    this.isClickInsideDropdown = true;
  };

  setIsOpened = isOpened => {
    this.setState({ isOpened });
  };

  setChosenValue = chosenValue => {
    this.setState({
      chosenValue,
      isOpened: false
    });
  };

  setChosenTitle = chosenTitle => {
    this.setState({ chosenTitle });
  };

  render() {
    const { isOpened, chosenValue, chosenTitle } = this.state;
    const contextValue = {
      isOpened,
      chosenValue,
      chosenTitle,
      setIsOpened: this.setIsOpened,
      setChosenValue: this.setChosenValue,
      setChosenTitle: this.setChosenTitle,
      onChange: this.props.onChange,
      defaultValue: this.props.defaultValue,
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
  const { isOpened, setIsOpened, chosenValue, chosenTitle } = useContext(Context);

  const clickHandler = () => {
    setIsOpened(!isOpened);
  };

  return (
    <div
      styleName={classnames('header', {'header--opened': isOpened})}
      onClick={clickHandler}
    >
      {chosenValue ? chosenTitle : children}
    </div>
  );
}

function Item({ children, value }) {
  const { chosenValue, setChosenValue, onChange, defaultValue, setChosenTitle } = useContext(Context);

  useEffect(() => {
    if (value === defaultValue) {
      setChosenValue(value);
      setChosenTitle(children);
    }
  }, []);

  const clickHandler = () => {
    setChosenValue(value);
    setChosenTitle(children);
    onChange(value);
  };

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
