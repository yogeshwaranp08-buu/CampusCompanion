import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const announcementService = {
  getAll: (params) => api.get('/announcements', { params }),
  getOne: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/announcements/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/events/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
  getRegistrationStatus: (id) => api.get(`/events/${id}/registration-status`),
};

export const noteService = {
  getAll: (params) => api.get('/notes', { params }),
  getOne: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/notes/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/notes/${id}`),
  download: (id) => api.get(`/notes/${id}/download`, { responseType: 'blob' }),
  bulkUpload: (data) => api.post('/notes/bulk-upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const lostFoundService = {
  getAll: (params) => api.get('/lost-found', { params }),
  getOne: (id) => api.get(`/lost-found/${id}`),
  create: (data) => api.post('/lost-found', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/lost-found/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/lost-found/${id}`),
  resolve: (id) => api.put(`/lost-found/${id}/resolve`),
  getMatches: (id) => api.get(`/lost-found/${id}/matches`),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/stats/dashboard'),
};

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getStats: () => api.get('/students/stats'),
  export: (params) => api.get('/students/export', { params, responseType: 'blob' }),
  validateImport: (data) => api.post('/students/bulk-import/validate', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  bulkImport: (data) => api.post('/students/bulk-import', data),
  bulkDelete: (data) => api.post('/students/bulk-delete', data),
};

export const configService = {
  getConfig: () => api.get('/config'),
};

export const notificationService = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};
