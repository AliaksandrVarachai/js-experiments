import React, { useContext, useEffect } from 'react';
import classnames from 'classnames';
import Context from '../Context/Context';

import './Item.pcss'

export default function Item({ children, value }) {
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
