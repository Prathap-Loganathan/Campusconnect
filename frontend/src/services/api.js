import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://campusconnect-backend-6iyv.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getCurrentUser: () => API.get('/auth/me'),
};

export const complaintAPI = {
  create: (complaintData) => API.post('/complaints', complaintData),
  getAll: () => API.get('/complaints'),
  getById: (id) => API.get(`/complaints/${id}`),
  assignStaff: (id, data) => API.put(`/complaints/${id}/assign`, data),
  updateStatus: (id, data) => API.put(`/complaints/${id}/status`, data),
};

export const lostFoundAPI = {
  create: (itemData) => API.post('/lost-found', itemData),
  getAll: (params) => API.get('/lost-found', { params }),
  submitClaim: (itemId, claimData) => API.post(`/lost-found/${itemId}/claims`, claimData),
  getAllClaims: () => API.get('/lost-found/claims'),
  reviewClaim: (claimId, status, comments) =>
    API.put(`/lost-found/claims/${claimId}/review`, null, { params: { status, comments } }),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (role) => API.get('/admin/users', { params: { role } }),
  getCategories: () => API.get('/admin/categories'),
  createCategory: (data) => API.post('/admin/categories', data),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
};

export const fileAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default API;
