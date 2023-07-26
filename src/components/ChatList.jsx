import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <ul>
      {messages.map((msg, index) => (
        <li key={index}>
          <strong>{msg.sender}: </strong>
          {msg.message}
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
