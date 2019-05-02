const messageShowDuration = 3000; //ms
const emptyMessage = '';

// same messages in row are shown as one message
class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [], // queue
      isMessageShown: false,
      prevMessage: emptyMessage
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { messages, prevMessage } = state;
    const len = messages.length;
    if (props.message !== prevMessage) {
      const newMsg = messages.slice();
      newMsg.push(props.message);
      return {
        prevMessage: props.message,
        // messages: [...messages, props.message]
        messages: newMsg,
      }
    }
    return null;
  }

  componentDidMount() {
    this.showNextMessage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isMessageShown === false) {
      this.showNextMessage();
    }
  }

  showNextMessage() {
    if (this.state.messages.length === 0)
      return;
    this.setState({
      isMessageShown: true
    });
    setTimeout(() => {
      this.setState((state, props) => ({
        messages: state.messages.slice(1),
        isMessageShown: false
      }));
    }, messageShowDuration);
  }

  render() {
    const { messages } = this.state;
    return messages[0]
      ? (
        <div className={'msg-container ' + ''}>
          <span className="msg-queue-length">
            {messages.length}
          </span>
          <span className="msg-text">
            {messages[0]}
          </span>
        </div>
      )
      : null;
  }
}



class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    }
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


