import React, { useEffect,useState } from 'react';
import './Settings.css'; // style as needed

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:3001/profile', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(user => {
        setFormData(prev => ({
          ...prev,
          username: user.username || '',
          email: user.email || '',
        }));
        setLoading(false);
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
        setLoading(false);
      });
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profilePic) {
      data.append('profilePic', formData.profilePic);
    }

    fetch('http://localhost:3001/user/update', {
      method: 'POST',
      body: data,
      credentials: 'include',
    })
    .then(res => {
      if (res.ok) {
        alert("Profile updated!");
      } else {
        alert("Failed to update.");
      }
    })
    .catch(err => {
      console.error("Update error:", err);
    });
  };

  return (
    <div className="settings-page">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <label>
          Profile Picture:
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default SettingsPage;
