import React, { useState } from 'react'
// import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export const Join = () => {
 
    const [fomedate, setfomedate] = useState( {roomId:''});
    const [error, setError] = useState(""); 

    const navigate=useNavigate()
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
          const response = await axios.post("http://localhost:8080/room/join", fomedate,
            {
              headers: {
                Authorization: `Bearer ${token}` 
              }
            }
          );
          console.log("Id creater successful:", response.data);

       
          setfomedate({roomId:'' });
          navigate('/chats')
        } catch (error) {
          console.error("Error during create id:", error);
          // if (error.response && error.response.data) {
          //   setError(error.response.data.message); 
          // } else {
          //   setError("An error occurred. Please try again.");
          // }
        }
      }



  return (
    <div>
        <form onSubmit={submitHandler}>
        <label className='signlable'>Enter room id</label>
            <div>
                <input className='signinput'
                 type='Password'
                 placeholder='Enter Your id'
                 name='roomId'
                 value={fomedate.roomId}
                 onChange={changeHandler}
                ></input>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} 
        <button className='signbtn' type='submit'>Join room</button>
        </form>
    </div>
  )
}