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

export default API;
