import React, { useState } from 'react';
import './Login.css'; // Make sure to create this file or use inline styles
import { login } from './api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await login(formData);
        console.log(response.data)
        if (response.status === 200) {
          if(response?.data?.user?.role == "admin" || response?.data?.role == "admin") {
            navigate('/portal/admin')
          }else{
            navigate('/portal')
          }
          // window.location.href = '/portal';
      }
    }catch(err){
        setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <div className="login-background"></div>
      <div className="login-overlay"></div>

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
          {error && <div className="login-popup">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
