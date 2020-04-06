import React, { Children } from 'react';
import PropTypes  from 'prop-types';
import Header from '../Header/Header';
import ItemsContainer from '../ItemsContainer/ItemsContainer';
import Item from '../Item/Item';
import Context from '../Context/Context';

import './MenuDropdown.pcss';


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

export default {
  Container,
  Header,
  ItemsContainer,
  Item
};
