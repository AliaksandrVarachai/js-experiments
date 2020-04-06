import React, { useContext } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Context from '../Context/Context';

import './Header.pcss';

Header.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default function Header({ children, className }) {
  const { isOpened, setIsOpened, chosenValue, chosenTitle, themeClass } = useContext(Context);

  const clickHandler = () => {
    setIsOpened(!isOpened);
  };

  return (
    <div
      className={className}
      styleName={classnames('header', themeClass)}
      onClick={clickHandler}
    >
      {chosenValue ? chosenTitle : children}
    </div>
  );
}