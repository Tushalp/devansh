
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const Join = () => {
    const [formData, setFormData] = useState({ roomId: '', username: '' });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function changeHandler(event) {
      const { name, value } = event.target;
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    async function submitHandler(event) {
      event.preventDefault();
      setError("");
      try {
        const token = localStorage.getItem('token');
        await axios.post("http://localhost:4000/room/join", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        socket.emit('joinRoom', { roomId: formData.roomId, username: formData.username });
        
        setFormData({ roomId: '', username: '' });
        navigate('/chats', { state: { roomId: formData.roomId, username: formData.username } });
      } catch (error) {
        console.error("Error during join:", error);
        setError("Failed to join room. Please try again.");
      }
    }

    return (
      <div>
          <form onSubmit={submitHandler}>
              <label>Enter Room ID</label>
              <input
                  type="text"
                  placeholder="Room ID"
                  name="roomId"
                  value={formData.roomId}
                  onChange={changeHandler}
              />
              <label>Enter Username</label>
              <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={changeHandler}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit">Join Room</button>
          </form>
      </div>
    );
};



