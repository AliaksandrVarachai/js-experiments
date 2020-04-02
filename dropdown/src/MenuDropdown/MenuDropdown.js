import React, { createContext, useState, useContext, cloneElement, isValidElement } from 'react';
import classnames from 'classnames';
import PropTypes  from 'prop-types';

import './MenuDropdown.pcss';

const Context = createContext();

function ContextProvider({ children }) {
  const [isOpened, setIsOpened] = useState(false);
  const [chosenValue, setChosenValue] = useState(null);

  return (
    <Context.Provider value={{ isOpened, setIsOpened, chosenValue, setChosenValue }}>
      {children}
    </Context.Provider>
  );
}

function Container({ children }) {
  return (
    <div>
      <ContextProvider>
        {children}
      </ContextProvider>
    </div>
  );
}

function ItemsContainer({ children }) {
  const { isOpened } = useContext(Context);

  const styleName = classnames('items-container', {'items-container--opened': isOpened});

  return isValidElement(children)
    ? (<>{cloneElement(children, { styleName })}</>)
    : (<div className={styleName}>{children}</div>);
}

function Header({ children }) {
  const { isOpened, setIsOpened } = useContext(Context);
  const clickHandler = () => { setIsOpened(!isOpened); };

  const styleName = classnames('header', {'header--opened': isOpened});

  return isValidElement(children)
    ? (
      <>
        {cloneElement(children, {
          onClick: clickHandler,
          styleName
        })}
      </>
    )
    : <div className={styleName}>{children}</div>
}

function Item({ children, value }) {
  const { chosenValue, setChosenValue } = useContext(Context);
  const clickHandler = () => { setChosenValue(value); };

  const styleName = classnames('item', {'item--chosen': chosenValue === value});

  return isValidElement(children)
    ? (
      <>
        {cloneElement(children, {
          onClick: clickHandler,
          styleName
        })}
      </>
    )
    : (
      <div styleName={styleName}>
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
