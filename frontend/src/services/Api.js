import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:5000/api', // 👈 esto es lo importante
});

Api.setAuthToken = (token) => {
  if (token) {
    Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

Api.removeAuthToken = () => {
  delete Api.defaults.headers.common['Authorization'];
};

export default Api;
