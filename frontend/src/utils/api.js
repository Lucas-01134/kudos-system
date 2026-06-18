import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password, firstName, lastName) =>
    api.post('/auth/register', { username, email, password, firstName, lastName }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile'),
  updateProfile: (data) =>
    api.put('/auth/profile', data),
  getAllUsers: () =>
    api.get('/auth/users'),
  getUserById: (id) =>
    api.get(`/auth/users/${id}`)
};

export const kudosAPI = {
  sendKudos: (to, message, category, isPublic) =>
    api.post('/kudos/send', { to, message, category, isPublic }),
  getReceivedKudos: (page = 1, limit = 10) =>
    api.get(`/kudos/received?page=${page}&limit=${limit}`),
  getSentKudos: (page = 1, limit = 10) =>
    api.get(`/kudos/sent?page=${page}&limit=${limit}`),
  getKudosFeed: (page = 1, limit = 20) =>
    api.get(`/kudos/feed?page=${page}&limit=${limit}`),
  likeKudos: (id) =>
    api.post(`/kudos/${id}/like`),
  deleteKudos: (id) =>
    api.delete(`/kudos/${id}`),
  getKudosStats: (id) =>
    api.get(`/kudos/stats/${id}`)
};

export default api;
