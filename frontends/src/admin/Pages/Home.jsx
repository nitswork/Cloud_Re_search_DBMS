import React, { useEffect, useState } from 'react'
import ASidebar from '../Components/ASidebar'
import ADashboard from '../Components/ADashboard'
import UserList from '../Components/UserLists'
import Publications from '../Components/Publications'
import UserSignUpStats from '../../UserSignUpStats'
import { baseURL } from '../../api'
import { useNavigate } from 'react-router-dom'

export default function Home () {
  const [currentView, setCurrentView] = useState('dashboard')
  const [user,setUser] = useState();
  const navigate = useNavigate();
  const handleNavigate = view => {
    setCurrentView(view)
  }
  // Fetch profile data on mount
  useEffect(() => {
    fetch(baseURL + '/profile', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in')
        return res.json()
      })
      .then(data => setUser(data))
      .catch(() => navigate('/login'))
  }, [navigate])

  const handleLogout = () => {
    // Optional: you could also move this logic to ASidebar
    fetch(baseURL + '/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      window.location.href = '/login'
    })
  }

  const renderContent = () => {
    switch (currentView) {
      case 'admindashboard':
        return <ADashboard />
      case 'users':
        return <UserList />
      case 'publications':
        return <Publications />
      default:
        return <ADashboard />
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <ASidebar
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <div className='admin-content'>{renderContent()}</div>
      <UserSignUpStats />
    </div>
  )
}
