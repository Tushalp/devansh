import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); 

export const Chatapage = () => {
  const location = useLocation();
  const { roomId, username } = location.state || {}; 
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (roomId && username) {
      socket.emit('joinRoom', { roomId, username }); 
    }

    socket.on('message', (msg) => {
      console.log('Received message:', msg);
      setChat((prevChat) => [...prevChat, msg]); 
    });

    return () => {
      socket.off('message'); 
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (message && roomId) { 
      const msgData = { roomId, username, text: message, time: new Date().toISOString() };
      socket.emit('chatMessage', msgData); 
      setMessage(''); 
    }
  };

  return (
    <div className="chatpagemain">
      <div className="Container">
        {chat.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}:</strong> {msg.text}
            <span className="timestamp">{new Date(msg.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="send-container">
        <input
          className="messageinput"
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="signbtn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
