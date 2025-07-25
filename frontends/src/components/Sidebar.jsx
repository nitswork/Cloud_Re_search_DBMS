import React , { useEffect, useState }from 'react';
import './Sidebar.css';

const Sidebar = ({onLogout, onNavigate }) => {
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:3001/profile', {
                credentials: 'include',
                });

                if (res.ok) {
                const data = await res.json();
                setFirstName(data.firstName || 'User');
                } else {
                console.error('Failed to load profile', data.message);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);}
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
        const res = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            alert(data.message);
            window.location.href = '/login'; // Redirect to home or login page
        } else {
            alert('Logout failed');
        }
        } catch (err) {
        console.error('Logout error:', err);
        alert('Server error');
        }
    };
    return (
        <div className="sidebar">
        <div className="profile-sidebar">
            <img src="data:image/png;base64,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" alt="Profile" />
            <p>{firstName}</p>
        </div>
        <ul className="nav-links-sidebar">
            <li onClick={() => onNavigate('dashboard')}>Dashboard</li>
            <li onClick={() => onNavigate('myresearch')}>My Research</li>
            <li onClick={() => onNavigate('settings')}>Settings</li>
            <li onClick={onLogout} style={{ cursor: 'pointer', color: 'white' }}>
            Log out
            </li>
        </ul>
        </div>
    );
};

export default Sidebar;