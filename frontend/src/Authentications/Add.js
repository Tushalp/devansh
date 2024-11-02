import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Adjust if your server has a different IP

export const Add = () => {
  const [fomedate, setfomedate] = useState({ roomId: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function changeHandler(event) {
    const { name, value } = event.target;
    setfomedate(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    setError("");
    try {
      console.log("Submitting data:", fomedate);
      const token = localStorage.getItem('token');
      
      // Create the room
      const response = await axios.post("http://localhost:4000/room/create", fomedate, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Room created successfully:", response.data);
      
      // Emit join event after successful creation
      socket.emit('joinRoom', { roomId: fomedate.roomId, username: "YourUsername" });

      // Clear the form and navigate to chat
      setfomedate({ roomId: '' });
      navigate('/chats');
      
    } catch (error) {
      console.error("Error during room creation:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Failed to create room");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label className="signlable">Enter your room id</label>
        <div>
          <input
            className="signinput"
            type="password"
            placeholder="Enter Room ID"
            name="roomId"
            value={fomedate.roomId}
            onChange={changeHandler}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="signbtn" type="submit">Create and Join Room</button>
      </form>
    </div>
  );
};
