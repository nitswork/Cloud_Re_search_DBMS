import React ,{useEffect, useState }from 'react';
import './Portal.css';
import {getCurrentUser, logout} from './api';
import { useNavigate } from 'react-router-dom';

const PortalPage = () => {
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
  const navigate = useNavigate();
  const handleRoleSelect = async (role) => {
    try {
      // const response = await fetch('http://localhost:3001/choose-role', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role }),
      // });

      // if (response.ok) {
        // window.location.href = role === 'admin' ? '/admin' : '/dashboard';
        navigate(role === 'admin' ? 'admin' : '/profile');

      // } else {
      //   alert('Something went wrong!');
      // }
    } catch (error) {
      alert('Server error');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="portal-body">
      <div className="portal-box">
        <h1>Welcome, {user?.name || 'Guest'}!</h1>
        <p>Please choose your portal:</p>
        <button className="portal-btn" onClick={() => handleRoleSelect('user')}>
          User Dashboard
        </button>
        {user && (
          <button className="portal-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default PortalPage;