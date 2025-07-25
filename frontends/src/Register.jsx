import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { register } from './api';
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed';
      setError(msg);
    }
  };

  return (
    <>
      <div className="background" />
      <div className="overlay" />

      <div className="register-container">
        <div className="register-box">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              placeholder="Email"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Register</button>
          </form>

          <a href="/login">Already have an account? Login</a>
          {error && <div className="register-popup">{error}</div>}

        </div>
      </div>
    </>
  );
};

export default Register;
