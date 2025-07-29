import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // important for sessions
});

// REGISTER
export const register = (data) => API.post('/register', data);

// LOGIN
export const login = (data) => API.post('/login', data);

// GET CURRENT USER
export const getCurrentUser = () => API.get('/me');

// PROFILE
export const updateProfile = (data) => API.post('/profile', data);

// LOGOUT
export const logout = () => API.post('/logout');

// Get all users (admin only)
export const fetchAllUsers = () => API.get('/api/users');
// DELETE a user by admin
export const deleteUserById = (id) => API.delete(`/api/users/${id}`);
// ADMIN: Get all publications
export const fetchAllPublications = () => API.get('/api/research');

// ADMIN: Delete publication by ID
export const deletePublicationById = (id) => API.delete(`/api/research/${id}`);
// GET today's signups
export const getToday = () => API.get('/api/todays-signups');

export default API;
