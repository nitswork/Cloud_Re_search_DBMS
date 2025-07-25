import React,{ useEffect, useState } from 'react';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import MyResearch from './components/MyResearch'
import SettingsPage from './components/Settings';
const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const navigate = useNavigate();

    // Fetch profile data on mount
    useEffect(() => {
        fetch('http://localhost:3001/profile', {
        credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Not logged in');
            return res.json();
        })
        .then(data => setUser(data))
        .catch(() => navigate('/login'));
    }, [navigate]);

    // Handle logout click
    const handleLogout = async () => {
        try {
        const res = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            navigate('/login');
        } else {
            alert('Logout failed');
        }
        } catch (err) {
        alert('Server error during logout');
        }
    };
    return (
        <div className="dashboard-layout">
            {user?.profilePic && (
                <img
                    src={`http://localhost:3001/uploads/${user.profilePic}`} // ⬅️ Serving uploaded file
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
            )}

            <Sidebar firstName={user?.firstName} onLogout={handleLogout} onNavigate={setActiveView}/>
            {activeView === 'dashboard' && <MainDashboard user={user} />}
            {activeView === 'myresearch' && <MyResearch user={user} />}
            {activeView === 'settings' && <SettingsPage user={user} />}
        </div>
    );
};

export default UserDashboard;