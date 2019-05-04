import React from 'react';
import { emptyMessage } from './constants';
import './Message.css';
import classnames from 'classnames';

const messageShowDuration = 4500; //ms

// same messages in row are shown as one message
export default class Message extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timeoutIds = [];
    this.state = {
      messages: [],
      isMessageShown: false,
      prevMessage: emptyMessage,
      isOddMessage: true, // for synchronizing of CSS animation when a queue of messages is shown
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { messages, prevMessage } = state;
    if (props.message && props.message !== prevMessage) {
      return {
        prevMessage: props.message,
        messages: [...messages, props.message]
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

  componentWillUnmount() {
    this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
  }

  showNextMessage() {
    if (this.state.messages.length === 0)
      return;
    this.setState({
      isMessageShown: true
    });
    const timeoutId = setTimeout(() => {
      this.setState((state, props) => ({
        messages: state.messages.slice(1),
        isMessageShown: false,
        isOddMessage: !this.state.isOddMessage
      }));
      this.timeoutIds.unshift();
    }, messageShowDuration);
    this.timeoutIds.push(timeoutId);
  }

  render() {
    const { messages, isMessageShown, isOddMessage } = this.state;
    if (!messages[0])
      return null;
    return (
      <div className={classnames('msg-container', isOddMessage ? 'msg-animated-odd' : 'msg-animated-even')}>
        {
          messages.length > 1 ? (
            <span className="msg-queue-length">
              [Queued {messages.length}]:
            </span>
          )
          : null
        }
        <span className="msg-text">
          {messages[0]}
        </span>
      </div>
    )
  }
}
