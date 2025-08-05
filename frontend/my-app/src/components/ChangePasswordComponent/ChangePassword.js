// /src/components/ChangePasswordComponent/ChangePassword.js
import React, { useState } from 'react';
import './ChangePassword.css';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/user/changepassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password changed successfully');
      } else {
        setMessage(data.message || 'Password change failed');
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangePassword;