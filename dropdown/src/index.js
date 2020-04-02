import React from 'react';
import ReactDOM from 'react-dom';
import MenuDropdown from './MenuDropdown/MenuDropdown';

function App() {
  return (
    <div>
      <MenuDropdown.Container>
        <MenuDropdown.Header>
          ClickMe
        </MenuDropdown.Header>
        <MenuDropdown.ItemsContainer>
          798798798
          <div value={88888}>88888</div>
          <MenuDropdown.Item value="option-1">Option 1</MenuDropdown.Item>
          <MenuDropdown.Item value="option-2">Option 2</MenuDropdown.Item>
          <MenuDropdown.Item value="option-3">Option 3</MenuDropdown.Item>
        </MenuDropdown.ItemsContainer>
      </MenuDropdown.Container>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
