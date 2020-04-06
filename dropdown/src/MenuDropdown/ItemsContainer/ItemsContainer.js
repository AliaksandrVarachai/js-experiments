import React, { useContext } from 'react';
import classnames from 'classnames';
import Context from '../Context/Context';

import './ItemsContainer.pcss';

export default function ItemsContainer({ children, className }) {
  const { isOpened, themeClass } = useContext(Context);

  return (
    <div
      className={className}
      styleName={classnames('items', {'items--opened': isOpened}, themeClass )}
    >
      {children}
    </div>
  );
}
