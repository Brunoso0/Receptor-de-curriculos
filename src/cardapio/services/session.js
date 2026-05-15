const STORAGE_KEY = "jrcoffee.cardapio.session";

export function getCardapioSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCardapioSession(session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearCardapioSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getCardapioRouteByRole(role) {
  return role === "admin" ? "/menu/admin" : "/menu";
}