import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL).replace(/\/$/, "");
const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");


const api = axios.create({
  baseURL: API_BASE_URL,
});


export { API_BASE_URL, API_ROOT_URL };
export default api;
 
