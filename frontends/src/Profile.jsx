import React, { useState } from 'react';
import './ProfileForm.css';
import { updateProfile } from './api';
const ProfileForm = () => {
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    university: '',
    department: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
    try {
        const res = await fetch('http://localhost:3001/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // 🔥 Important for session cookies
        body: JSON.stringify(formData),
        });

        if (res.ok) {
        alert('Profile saved successfully!');
        } else {
        const data = await res.json();
        alert(data.message || 'Something went wrong.');
        }
    } catch (err) {
        alert('Server error.');
    }
    };


  const isStudent = formData.role === 'student';
  const isOtherRole =
    formData.role &&
    formData.role !== '' &&
    formData.role !== 'student';

  return (
    <div className="container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="role">Who are you?</label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Role --</option>
          <option value="student">Student</option>
          <option value="lawyer">Lawyer</option>
          <option value="doctor">Doctor</option>
          <option value="medical_researcher">Medical Researcher</option>
          <option value="scientific_researcher">Scientific Researcher</option>
          <option value="mathematician">Mathematician</option>
        </select>

        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="country">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />

        <label htmlFor="state">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />

        {isStudent && (
          <div>
            <label htmlFor="university">University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
            />
          </div>
        )}

        {isOtherRole && (
          <div>
            <label htmlFor="department">Department / Affiliation</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
