import React, { useContext } from 'react';
import classnames from 'classnames';
import Context from '../Context/Context';

import './Header.pcss';

export default function Header({ children }) {
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