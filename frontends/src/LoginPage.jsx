import React, { useState } from 'react'
import './Login.css' // Make sure to create this file or use inline styles
import { baseURL, login } from './api'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const response = await login(formData)
      console.log(response.data)
      if (response.status === 200) {
        if (
          response?.data?.user?.role == 'admin' ||
          response?.data?.role == 'admin'
        ) {
          navigate('/portal/admin')
        } else {
          navigate('/portal')
        }
        // window.location.href = '/portal';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div>
      <div className='login-background'></div>
      <div className='login-overlay'></div>

      <div className='login-container'>
        <div className='login-box'>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
            className='bg-white'
              type='email'
              name='username'
              placeholder='Email'
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
            className='bg-white'
              type='password'
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type='submit'>Login</button>
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
                href={baseURL+`/google`}
              >
                <img
                  className='h-10 w-10 rounded-full'
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-S3qWcvePdfZilsn8f2X1KXTC6vZ0xjQPgQ&s'
                  alt=''
                />
                <h1>Continue With Google</h1>
              </a>
            </div>
          </form>
          <a href='/register'>Don't have an account? Register</a>
          {error && <div className='login-popup'>{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
