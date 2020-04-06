import React, { useContext } from 'react';
import classnames from 'classnames';
import Context from '../Context/Context';

import './ItemsContainer.pcss';

export default function ItemsContainer({ children }) {
  const { isOpened } = useContext(Context);

  return (
    <div styleName={classnames('items-container', {'items-container--opened': isOpened})}>
      {children}
    </div>
  );
}
