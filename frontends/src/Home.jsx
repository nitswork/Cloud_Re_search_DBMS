import React, { useEffect, useState } from 'react'
import './home.css'
import { getCurrentUser, logout } from './api'
import { Link } from 'react-router-dom'
const HomePage = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser()
        setUser(res.data.user)
      } catch {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <div>
      <div className='home-background'></div>
      <div className='home-overlay'></div>

      <div className='home-box'>
        <h3>Uniting Minds, Managing Research, Powering Discovery.</h3>
        <h1>SciConnect</h1>
        <p>
          A secure and powerful place to manage your research data and
          publications — from anywhere, anytime.
        </p>

        <div className='nav-buttons'>
          <Link to='/'>Home</Link>
          {!user && <a href='/register'>Register</a>}
          {!user && <a href='/login'>Login</a>}
          {/* <div className='flex'>
            <hr />
            <a className='flex gap-1 text-xs items-center' href='http://localhost:5000/google'>
              <img
                className='h-7 w-7 rounded-full'
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-S3qWcvePdfZilsn8f2X1KXTC6vZ0xjQPgQ&s'
                alt=''
              />
              Continue With Google
            </a>
          </div> */}
          {user && <button onClick={handleLogout}>Logout</button>}
        </div>
      </div>

      <footer>© 2025 Cloud Research Portal. All rights reserved.</footer>
    </div>
  )
}

export default HomePage
