import './Register.css';
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });

    const [emailStatus, setEmailStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/user/register', {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                mobile: formData.phone,  
                address: "Default Address" 
            });

            console.log(res.data);
           
            setEmailStatus("Verification email sent! Please check your inbox.");
        } catch (err) {
            console.error("Registration failed:", err.response?.data || err.message);
           
        }
    };

    const sendVerificationEmail = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/user/resend-verification', {
                email: formData.email,
            });
            console.log(res.data);
            setEmailStatus("Verification email sent! Please check your inbox.");
        } catch (err) {
            console.error("Error sending verification email:", err.response?.data || err.message);
           
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Name:</label>
                    <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input type="text" className="form-control" id="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary"
                style={{ marginLeft: '10px' ,marginTop:'20px'}}>Register</button>
                
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={sendVerificationEmail}
                    style={{ marginLeft: '10px' ,marginTop:'20px'}}
                >
                    Resend Verification Email
                </button>
       

                {emailStatus && (
                    <div style={{ marginTop: '10px', color: 'green' }}>
                        <p>{emailStatus}</p>
                        {emailStatus.includes("log in") && (
                            <button
                                className="btn btn-success"
                                onClick={() => window.location.href = '/login'}
                            >
                                Go to Login
                            </button>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}

export default Register;