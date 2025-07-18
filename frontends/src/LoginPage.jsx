import React, { useState } from 'react';
import './Login.css'; // Make sure to create this file or use inline styles
import { login } from './api';
const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await login(formData);
        if (response.status === 200) {
        window.location.href = '/portal';
      }
    }catch(err){
        setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <div className="background"></div>
      <div className="overlay"></div>

      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          <a href="/register">Don't have an account? Register</a>
          {error && <div className="popup">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
