import axios from "axios";

const API_BASE_URL = "https://api.jrcoffee.com.br:5002/api";


const api = axios.create({
  baseURL: API_BASE_URL,
});


export { API_BASE_URL };
export default api;
 
