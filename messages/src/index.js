import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(event) {
    this.setState({
      message: 'message #' + Math.ceil(Math.random() * 1000)
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.clickHandler}>Generate Message</button>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex repellat quae placeat ullam neque aperiam necessitatibus! Fuga est sint maiores ipsum repellendus, qui mollitia. Non eligendi praesentium consequuntur alias quos.</p>
        <hr/>
        <Message message={this.state.message} />
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('root'));


