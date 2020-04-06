import React from 'react';
import ReactDOM from 'react-dom';
import MenuDropdown from './MenuDropdown/MenuDropdown';

function MyItem() {
  return (
    <div>
      my item
    </div>
  );
}


function App() {
  return (
    <div>
      <MenuDropdown.Container>
        <MenuDropdown.Header>
          ClickMe
        </MenuDropdown.Header>
        <MenuDropdown.ItemsContainer>
          <MenuDropdown.Item value="option-1">Option 1</MenuDropdown.Item>
          <MenuDropdown.Item value="option-2">Option 2</MenuDropdown.Item>
          <MenuDropdown.Item value="option-3">Option 3</MenuDropdown.Item>
        </MenuDropdown.ItemsContainer>
      </MenuDropdown.Container>

      <MenuDropdown.Container>
        <MenuDropdown.Header>
          ClickMe 2
        </MenuDropdown.Header>
        <MenuDropdown.ItemsContainer>
          <MenuDropdown.Item value="option-5"><span>Option 5</span></MenuDropdown.Item>
          <MenuDropdown.Item value="option-6"><div>Option 6</div></MenuDropdown.Item>
          <MenuDropdown.Item value="option-7">Option 7</MenuDropdown.Item>
          <MenuDropdown.Item value="option-8"><MyItem/></MenuDropdown.Item>
        </MenuDropdown.ItemsContainer>
      </MenuDropdown.Container>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
