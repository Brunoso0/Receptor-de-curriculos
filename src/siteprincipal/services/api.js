// src/siteprincipal/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://api.jrcoffee.com.br:5002'
      : 'http://localhost:5001'
});

export default api;
