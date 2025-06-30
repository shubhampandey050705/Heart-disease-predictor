import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', // ✅ use 127.0.0.1 to match backend
});

export default instance;
