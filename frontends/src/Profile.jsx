import React, { useEffect, useState } from 'react'
import './ProfileForm.css'
import { baseURL, updateProfile } from './api'
import { data, useNavigate } from 'react-router-dom' //
import axios from 'axios'
const ProfileForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    // email: '',
    phone: '',
    country: '',
    state: '',
    university: '',
    institute: '',
    department: ''
  })
  const [user, setUser] = useState()
  useEffect(() => {
    fetch(baseURL + '/profile', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in')
        return res.json()
      })
      .then(data => {
        if(data.firstName) {
          navigate('/userdashboard')
        }
      })
      .catch(() => navigate('/login'))
  }, [navigate])
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) {
      alert('Phone number must be exactly 10 digits.')
      return
    }
    try {
      const res = await axios.post(baseURL + '/profile', formData, {
        withCredentials: true
      })
      if (res.status == 200) {
        alert('Profile saved successfully!')
        navigate('/userdashboard')
      } else {
        const data = await res.json()
        alert(data.message || 'Something went wrong.')
      }
    } catch (err) {
      alert('Server error.')
    }
  }

  const isStudent = formData.role === 'student'
  const isMedicalResearcher = formData.role === 'medical_researcher'
  const isScientificResearcher = formData.role === 'scientific__researcher'
  const isMathematician = formData.role === 'mathematician'

  const isOtherRole =
    formData.role && formData.role !== '' && formData.role !== 'student'
  formData.role !== 'medical_researcher'
  formData.role !== 'scientific__researcher'
  formData.role !== 'mathematician'

  return (
    <div className='container'>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='role'>Who are you?</label>
        <select
          name='role'
          id='role'
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value=''>-- Select Role --</option>
          <option value='student'>Student</option>
          <option value='lawyer'>Lawyer</option>
          <option value='doctor'>Doctor</option>
          <option value='medical_researcher'>Medical Researcher</option>
          <option value='scientific_researcher'>Scientific Researcher</option>
          <option value='mathematician'>Mathematician</option>
        </select>

        <label htmlFor='firstName'>First Name</label>
        <input
          type='text'
          name='firstName'
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor='lastName'>Last Name</label>
        <input
          type='text'
          name='lastName'
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        {/* <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        /> */}

        <label htmlFor='phone'>Phone Number</label>
        <input
          type='text'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor='country'>Country</label>
        <input
          type='text'
          name='country'
          value={formData.country}
          onChange={handleChange}
          required
        />

        <label htmlFor='state'>State</label>
        <input
          type='text'
          name='state'
          value={formData.state}
          onChange={handleChange}
          required
        />

        {isStudent && (
          <div>
            <label htmlFor='university'>University</label>
            <input
              type='text'
              name='university'
              value={formData.university}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {isMedicalResearcher && isScientificResearcher && isMathematician && (
          <div>
            <label htmlFor='institute'>Institute</label>
            <input
              type='text'
              name='institute'
              value={formData.institute}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {isOtherRole && (
          <div>
            <label htmlFor='department'>Department / Affiliation</label>
            <input
              type='text'
              name='department'
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button type='submit'>Save Profile</button>
      </form>
    </div>
  )
}

export default ProfileForm
