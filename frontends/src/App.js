import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Login from './LoginPage.jsx';
import Register from './Register.jsx';
import Portal from './Portal.jsx';
import Profile from './Profile.jsx';
import UserDashboard from './UserDashboard.jsx';
import WriteResearch from './components/WriteResearch.jsx';
import AdminHome from './admin/Pages/Home.jsx';
import SettingsPage from './components/Settings.jsx';
import UserList from './admin/Components/UserLists.jsx';
import Publications from './admin/Components/Publications.jsx';
import TodaysSignups from './admin/Components/TodaysSignups.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/portal" element={<Portal/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/write" element={<WriteResearch />} />
        <Route path="/portal/admin" element ={<AdminHome/>}/>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path='/admin/users'element={<UserList/>}/>
        <Route path='/admin/publications' element={<Publications/>}/>
        <Route path='/admin/todaysignup' element={<TodaysSignups/>}/>
      </Routes>
    </Router>
  );
}

export default App;
