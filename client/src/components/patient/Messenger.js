import React, { useState } from 'react';

const Messenger = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="messenger">
      <textarea value={message} onChange={handleMessageChange} placeholder="Type your message here..." />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Messenger;
