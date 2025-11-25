import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/admin/users'),
};

// Quiz API
export const quizAPI = {
  getQuizzes: () => api.get('/quizzes'),
  getAllQuizzesForAdmin: () => api.get('/quizzes/admin/all'),
  getAllAttempts: () => api.get('/quizzes/admin/attempts'),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  getQuizForAdmin: (id) => api.get(`/quizzes/${id}/admin`),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  submitAttempt: (quizId, answers) => api.post(`/quizzes/${quizId}/attempt`, { answers }),
  getMyAttempts: () => api.get('/quizzes/me/attempts'),
  getQuizAttempts: (quizId) => api.get(`/quizzes/${quizId}/attempts`),
};

export default api;