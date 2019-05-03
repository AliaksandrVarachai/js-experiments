// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { emptyMessage } from './constants';
import Message from './Message';
import Hello from './Hello';

type AppProps = {};
type AppState = {
  message: string,
  destroyMessages: boolean
}

class App extends React.PureComponent<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      message: emptyMessage,
      destroyMessages: false,
    };
  }

  generateMessage = (event) => {
    this.setState({
      message: 'message #' + Math.ceil(Math.random() * 1000)
    });
  };

  destroyMessages = (event) => {
    this.setState({
      destroyMessages: true
    });
  };

  componentWillUnmount() {
    console.log('App: componentWillUnmount')
  }

  componentDidMount(): void {
    console.log('App: componentDidMount')
  }


  render() {
    const { message, destroyMessages } = this.state;
    return (
      <div>
        <button onClick={this.generateMessage}>Generate Message</button>
        <button onClick={this.destroyMessages}>Destroy all Messages</button>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex repellat quae placeat ullam neque aperiam necessitatibus! Fuga est sint maiores ipsum repellendus, qui mollitia. Non eligendi praesentium consequuntur alias quos.</p>
        <hr/>
        {destroyMessages ? null : <Message message={message} />}
        <Hello />
      </div>
    )
  }
}

const root = document.getElementById('root');
if (root === null)
  throw Error('Root is not found');
ReactDOM.render(<App />, root);


