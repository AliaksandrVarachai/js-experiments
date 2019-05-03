import React from 'react';
import { emptyMessage } from './constants';
import './Message.css';

const messageShowDuration = 3000; //ms

// same messages in row are shown as one message
export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.timeoutIds = [];
    this.state = {
      messages: [],
      isMessageShown: false,
      prevMessage: emptyMessage
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
        isMessageShown: false
      }));
      this.timeoutIds.unshift();
    }, messageShowDuration);
    this.timeoutIds.push(timeoutId);
  }

  render() {
    const { messages } = this.state;
    if (!messages[0])
      return null;
    return (
      <div className={'msg-container ' + ''}>
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
