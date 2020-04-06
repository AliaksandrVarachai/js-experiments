import React, { useContext, useEffect } from 'react';
import classnames from 'classnames';
import Context from '../Context/Context';

import './Item.pcss'

export default function Item({ children, value, className }) {
  const { chosenValue, setChosenValue, onChange, defaultValue, setChosenTitle, themeClass } = useContext(Context);

  useEffect(() => {
    if (value === defaultValue) {
      setChosenValue(value);
      setChosenTitle(children);
    }
  }, []);

  const clickHandler = () => {
    if (value === chosenValue) return;
    setChosenValue(value);
    setChosenTitle(children);
    onChange(value);
  };

  return (
    <div
      className={className}
      styleName={classnames('item', {'item--chosen': chosenValue === value}, themeClass )}
      onClick={clickHandler}
    >
      {children}
    </div>
  );
}
