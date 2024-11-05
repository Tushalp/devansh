import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); 

export const Add = () => {
  const [fomedate, setfomedate] = useState({ roomId: '',username:'' });
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
      
 
      const response = await axios.post("http://localhost:4000/room/create", fomedate, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Room created successfully:", response.data);
      

      socket.emit('joinRoom', { roomId: fomedate.roomId, username: fomedate.username });

    
      setfomedate({ roomId: '', username:''});
      navigate('/chats', { state: { roomId: fomedate.roomId, username: fomedate.username } });
      
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
            type="text"
            placeholder="Enter Room ID"
            name="roomId"
            value={fomedate.roomId}
            onChange={changeHandler}
          />
        </div>
        <label>Enter Username</label>
              <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={fomedate.username}
                  onChange={changeHandler}
              />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="signbtn" type="submit">Create and Join Room</button>
      </form>
    </div>
  );
};






