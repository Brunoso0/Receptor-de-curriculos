import axios from "axios";

const COFFEE_API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL_COFFEE ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5001/api"
).replace(/\/$/, "");
const coffeeApi = axios.create({
  baseURL: COFFEE_API_BASE_URL,
});

const LOGIN_ENDPOINT = process.env.REACT_APP_CARDAPIO_LOGIN_ENDPOINT || "/auth/login";

function getRoleCandidate(payload) {
  const directCandidate = [
    payload?.role,
    payload?.perfil,
    payload?.tipo,
    payload?.nivel,
    payload?.cargo,
    payload?.user?.role,
    payload?.user?.perfil,
    payload?.usuario?.role,
    payload?.usuario?.perfil,
  ].find(Boolean);

  if (payload?.isAdmin === true || payload?.user?.isAdmin === true || payload?.usuario?.isAdmin === true) {
    return "admin";
  }

  return directCandidate || null;
}

export function resolveCardapioRole(payload, fallbackRole = "user") {
  const candidate = String(getRoleCandidate(payload) || fallbackRole).toLowerCase();

  if (candidate.includes("admin") || candidate.includes("gestor")) {
    return "admin";
  }

  return "user";
}

export function getAuthErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.erro ||
    error?.message ||
    "Nao foi possivel autenticar com o sistema de RH."
  );
}

export function normalizeCardapioSession(payload, fallbackRole, email) {
  const user = payload?.user || payload?.usuario || payload || {};

  return {
    email: user.email || email,
    id: user.id || user.usuario_id || null,
    nome: user.nome || user.name || email,
    role: resolveCardapioRole(payload, fallbackRole),
    token: payload?.token || payload?.accessToken || null,
    raw: payload,
  };
}

export async function loginWithRh(credentials) {
  if (!coffeeApi.defaults.baseURL) {
    throw new Error("Configure REACT_APP_API_BASE_URL_COFFEE ou REACT_APP_API_BASE_URL para autenticar no RH.");
  }

  const response = await coffeeApi.post(LOGIN_ENDPOINT, credentials);
  return response.data;
}