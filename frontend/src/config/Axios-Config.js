import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ajusta según tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;
