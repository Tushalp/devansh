import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: '',
        confirm_password: '' 
    });
    const [error, setError] = useState(""); 
    const [success, setSuccess] = useState(""); 

    function changeHandler(event) {
        const { name, value, type, checked } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function submitHandler(event) {
        event.preventDefault();
        console.log('Form data being sent:', formData);
        
        
        setError("");
        setSuccess("");

        axios.post('http://192.168.29.20:8080/auth/signup', formData)
            .then((response) => {
                console.log('Response from server:', response.data);
                setSuccess("Signup successful!"); 
               
                setFormData({
                    name: "",
                    email: "",
                    password: '',
                    confirm_password: ''
                });
                navigate('/login')
            })
            .catch((error) => {
                // if (error.response) {
                //     console.log('Error data:', error.response.data);
                //     console.log('Error status:', error.response.status);
                //     // setError(error.response.data.message || 'Something went wrong!');
                //     setError(error.response.data.message );
                // } else {
                //     console.log('Error message:', error.message);
                //     setError('Network error. Please try again.');
                // }

                console.log("error hai bhai.........",error)
            });
    }

    return (
        <div className='signmain'>
            <form onSubmit={submitHandler}>
                {error && <div className="error">{error}</div>} 
                {success && <div className="success">{success}</div>} 
                
                <label className='signlable'>Name</label>
                <div>
                    <input className='signinput'
                        type='text'
                        placeholder='Enter Your Name'
                        name="name"
                        value={formData.name}
                        onChange={changeHandler}
                    />
                </div>

                <label className='signlable'>Email</label>
                <div>
                    <input className='signinput'
                        type='email'
                        placeholder='Enter Your Email'
                        name='email'
                        value={formData.email}
                        onChange={changeHandler}
                    />
                </div>

                <label className='signlable'>Password</label>
                <div>
                    <input className='signinput'
                        type='password'
                        placeholder='Enter Your Password'
                        name='password'
                        value={formData.password}
                        onChange={changeHandler}
                    />
                </div>

                <label className='signlable'>Confirm Password</label>
                <div>
                    <input className='signinput'
                        type='password'
                        placeholder='Enter Your Confirm Password'
                        name='confirm_password'
                        value={formData.confirm_password}
                        onChange={changeHandler}
                    />
                </div>

                <button className='signbtn' type='submit'>Sign Up</button>
            </form>
        </div>
    );
};
