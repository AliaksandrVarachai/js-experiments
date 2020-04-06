import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MenuDropdown from './MenuDropdown/Container/MenuDropdown';

function MyItem() {
  return (
    <div>
      my item
    </div>
  );
}


function App() {
  const [isMenuShown, setIsMenuShown] = useState(true);

  const toggleMenuVisibility = () => {
    setIsMenuShown(!isMenuShown);
  };

  return (

    <div>
      {isMenuShown ? (
        <div>
          <MenuDropdown.Container
            onChange={value => console.log(value)}
            theme="none"
          >
            <MenuDropdown.Header>
              Placeholder 1
            </MenuDropdown.Header>
            <MenuDropdown.ItemsContainer>
              <MenuDropdown.Item value="option-1">Option 1</MenuDropdown.Item>
              <MenuDropdown.Item value="option-2">Option 2</MenuDropdown.Item>
              <MenuDropdown.Item value="option-3">Option 3</MenuDropdown.Item>
            </MenuDropdown.ItemsContainer>
          </MenuDropdown.Container>

          <MenuDropdown.Container
            onChange={value => console.log(value)}
            defaultValue="option-5"
          >
            <MenuDropdown.Header>
              <div>Placeholder 2</div>
            </MenuDropdown.Header>
            <MenuDropdown.ItemsContainer>
              <MenuDropdown.Item value="option-5"><span>Option 5</span></MenuDropdown.Item>
              <MenuDropdown.Item value="option-6"><div>Option 6</div></MenuDropdown.Item>
              <MenuDropdown.Item value="option-7">Option 7</MenuDropdown.Item>
              <MenuDropdown.Item value="option-8"><MyItem/></MenuDropdown.Item>
            </MenuDropdown.ItemsContainer>
          </MenuDropdown.Container>
        </div>
      ) : null}

      <br/>
      <br/>
      <input
        type="button"
        value={isMenuShown ? 'Hide' : 'Show'}
        onClick={toggleMenuVisibility}
      />

    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
