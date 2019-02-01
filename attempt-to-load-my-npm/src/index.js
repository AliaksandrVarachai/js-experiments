import React from 'react';
import ReactDOM from 'react-dom';
import { Button, RoundButton }from 'react-button-test-publish-to-npmjs';

class App extends React.Component {
  render() {
    return (
      <div>
        <Button />
        <div>
          <RoundButton />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementByTagName('body').firstElementChild);
