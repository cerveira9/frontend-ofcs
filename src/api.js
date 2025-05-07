import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/v1/api'
      : 'https://be-oficiais.onrender.com/v1/api',
});

export default api;
