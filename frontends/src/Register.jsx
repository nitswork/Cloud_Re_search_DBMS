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
          <div className='flex mt-5 px-10 gap-2 text-white text-sm items-center'>
              <hr className='w-full ' />
              Or
              <hr className='w-full' />
          </div>
          <div className='flex'>
              <a
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
                className='flex bg-white mx-5 p-1  rounded-full gap-1 w-full text-xs items-center'
                href='http://localhost:5000/google'
              >
                <img
                  className='h-12 w-18 rounded-full'
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-S3qWcvePdfZilsn8f2X1KXTC6vZ0xjQPgQ&s'
                  alt=''
                />
                <h1>Continue With Google</h1>
              </a>
            </div>
          <a href="/login">Already have an account? Login</a>
          {error && <div className="register-popup">{error}</div>}

        </div>
      </div>
    </>
  );
};

export default Register;
