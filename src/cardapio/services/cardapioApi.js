import axios from "axios";

const CARDAPIO_API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL_COFFEE ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5001/api"
).replace(/\/$/, "");

const CARDAPIO_API_ROOT_URL = CARDAPIO_API_BASE_URL.replace(/\/api\/?$/, "");

const cardapioApi = axios.create({
  baseURL: CARDAPIO_API_BASE_URL,
});

export { CARDAPIO_API_BASE_URL, CARDAPIO_API_ROOT_URL };
export default cardapioApi;