import React,{ useEffect, useState } from 'react';
import './home.css';
import { getCurrentUser, logout } from './api';
import {Link} from 'react-router-dom';
const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.reload(); // or redirect if preferred
  };

  return (
    <div>
      <div className="background"></div>
      <div className="overlay"></div>

      <div className="container">
        <h1>Cloud Research Portal</h1>
        <p>
          A secure and powerful place to manage your research data and publications — from anywhere, anytime.
        </p>

        <div className="nav-buttons">
          <Link to="/">Home</Link>
          {!user && <a href="/register">Register</a>}
          {!user && <a href="/login">Login</a>}
          {user && <button onClick={handleLogout}>Logout</button>}
        </div>
      </div>

      <footer>
        © 2025 Cloud Research Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;