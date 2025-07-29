import React, { useState } from 'react';
import ASidebar from '../Components/ASidebar';
import ADashboard from '../Components/ADashboard';
import UserList from '../Components/UserLists';
import Publications from '../Components/Publications';

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    // Optional: you could also move this logic to ASidebar
    fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      window.location.href = '/login';
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'admindashboard':
        return <ADashboard />;
      case 'users':
        return <UserList />;
      case 'publications':
        return <Publications />;
      default:
        return <ADashboard />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <ASidebar onNavigate={handleNavigate} onLogout={handleLogout} />
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
}
