import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://portfolio-backend-xvu9.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401  && !window.location.pathname.includes('/login')) {
//       localStorage.removeItem('portfolio_token');
//       localStorage.removeItem('portfolio_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
    }
    return Promise.reject(error);
  }
);


// ACTUAL API METHODS (no mocks)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  // logout: () => api.post('/auth/logout'),
  // refreshToken: () => api.post('/auth/refresh'),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadImage: (formData) => api.post('/upload/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadHero: (formData) => api.post('/upload/profile/hero', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const aboutAPI = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  get: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  bulkCreate: (data) => api.post('/skills/bulk', data),
};

export const projectsAPI = {
  getAll: () => api.get(`/projects/all`),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadMedia: (formData) => api.post(`/upload/project`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
  uploadIcon: (formData) => api.post(`/upload/achievements/icon/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const educationAPI = {
  
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
  uploadCertificate: (formData) => api.post(`/upload/education/certificate`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const certificationsAPI = {
  getAll: () => api.get('/certifications'),
  create: (data) => api.post('/certifications', data),
  update: (id, data) => api.put(`/certifications/${id}`, data),
  delete: (id) => api.delete(`/certifications/${id}`),
  uploadCertificate: (formData) => api.post(`/upload/certifications/cert/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCertificateBadge: (formData) => api.post(`/upload/certifications/badge/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  uploadImage: (formData) => api.post(`/upload/blogs/image/${id}`,formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
  uploadImage: (formData) => api.post(`/upload/testimonial/image/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const resumeAPI = {
  get: () => api.get('/resume'),
  update: (data) => api.put('/resume', data),
  uploadResume: (formData) => api.post('/upload/resume/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const contactAPI = {
  get: () => api.get('/contact'),
  update: (data) => api.put('/contact', data),
};

export const socialLinksAPI = {
  getAll: () => api.get('/social'),
  create: (data) => api.post('/social', data),
  update: (id, data) => api.put(`/social/${id}`, data),
  delete: (id) => api.delete(`/social/${id}`),
};

export const messagesAPI = {
  getAll: () => api.get('/messages'),
  get: (id) => api.get(`/messages/${id}`),
  delete: (id) => api.delete(`/messages/${id}`),
  markAsRead: (id) => api.put(`/messages/${id}/read`,{read:true}),
};

export default api;

