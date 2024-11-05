import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: '' });
  const [error, setError] = useState(""); 
const navigate=useNavigate()
  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    setError("");

    try {
      console.log("Submitting data:", formData);
      const response = await axios.post("http://localhost:4000/auth/login", formData);
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
   
      setFormData({ email: "", password: '' });
      navigate('/Addmember')
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message); 
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label className='signLabel'>Email</label>
        <div>
          <input
            className='signinput'
            type='email'
            placeholder='Enter Your Email'
            value={formData.email}
            name='email'
            onChange={changeHandler}
          />
        </div>

        <label className='signLabel'>Password</label>
        <div>
          <input
            className='signinput'
            type='password'
            placeholder='Enter Your Password'
            value={formData.password}
            name='password'
            onChange={changeHandler}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>} 

        <button className='signbtn' type='submit'>Login</button>
      </form>
    </div>
  );
};



