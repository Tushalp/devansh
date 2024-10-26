import React from 'react'
// import { Link } from '@chakra-ui/react'
// import { useState } from 'react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';


// const socket = io('http://localhost:8080');
const socket = io('192.168.29.20:8080');

export const Chatapage = () => {

  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
   
    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off('message'); 
    };
  }, []);

  
  const joinRoom = () => {
    if (roomId && username) {
      socket.emit('joinRoom', { roomId, username });
      setJoined(true);
    } else {
      alert("Please enter both room ID and username");
    }
  };

  
  const sendMessage = () => {
    if (message && roomId && username) {
      socket.emit('chatMessage', { roomId, username, text: message });
      setMessage(''); 
    }
  };

  return (
    <div>
     


      {!joined ? (
        <div>
           {/* <label className='signlable'>Enter your room id</label> */}
          <input className='signinput'
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
          <input className='signinput'
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
           
          />
          <button className='signbtn' onClick={joinRoom} >Join Room</button>
        </div>
      ) : (
        <div className='chatpagemain'>
          <div className='Container'>
            {chat.map((msg, index) => (
              <div key={index} >
                <strong>{msg.username}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <div className='send-container'>
            <input className='messageinput'
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
             
            />
            <button className='signbtn' onClick={sendMessage} >Send</button>
          </div>
        </div>
      )}
    </div>
  );
}



