import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setOutput('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // ✅ Correctly store token + user in context and localStorage
      login(data.user, data.token);

      navigate('/');
    } catch (err) {
      setOutput(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6 font-inter">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Login</h2>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="text-center text-red-500 text-sm">{output}</p>

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;