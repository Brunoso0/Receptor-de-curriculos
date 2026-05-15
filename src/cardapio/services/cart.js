const CARDAPIO_CART_STORAGE_KEY = "cardapio-cart-v1";
const CARDAPIO_CART_TTL_MS = 2 * 60 * 60 * 1000;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeQuantity(value) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return 1;
  }

  return Math.max(1, Math.round(parsedValue));
}

function normalizeCartItem(product, quantity = 1) {
  return {
    id: product?.id,
    nome: product?.nome || "Produto",
    descricao: product?.descricao || "",
    preco: Number(product?.preco || 0),
    image_path:
      product?.image_path ||
      product?.imagem ||
      product?.image ||
      product?.capa_imagem ||
      product?.capaImagem ||
      null,
    categoria_id: product?.categoria_id ?? product?.categoriaId ?? product?.grupo?.id ?? product?.grupoId ?? null,
    quantity: sanitizeQuantity(quantity),
    addedAt: Date.now(),
  };
}

function removeCartSnapshot() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CARDAPIO_CART_STORAGE_KEY);
}

function readCartSnapshot() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CARDAPIO_CART_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    const expiresAt = Number(parsedValue?.expiresAt || 0);
    const items = Array.isArray(parsedValue?.items) ? parsedValue.items : [];

    if (!expiresAt || Date.now() > expiresAt) {
      removeCartSnapshot();
      return [];
    }

    return items
      .filter((item) => item && item.id != null)
      .map((item) => normalizeCartItem(item, item.quantity));
  } catch {
    removeCartSnapshot();
    return [];
  }
}

function writeCartSnapshot(items) {
  if (!canUseStorage()) {
    return items;
  }

  const normalizedItems = items
    .filter((item) => item && item.id != null)
    .map((item) => normalizeCartItem(item, item.quantity));

  if (!normalizedItems.length) {
    removeCartSnapshot();
    return [];
  }

  window.localStorage.setItem(
    CARDAPIO_CART_STORAGE_KEY,
    JSON.stringify({
      expiresAt: Date.now() + CARDAPIO_CART_TTL_MS,
      items: normalizedItems,
    })
  );

  return normalizedItems;
}

export function getCardapioCartItems() {
  return readCartSnapshot();
}

export function getCardapioCartCount(items = readCartSnapshot()) {
  return items.reduce((total, item) => total + sanitizeQuantity(item.quantity), 0);
}

export function addCardapioCartItem(product, quantity = 1) {
  const currentItems = readCartSnapshot();
  const normalizedProduct = normalizeCartItem(product, quantity);
  const existingItemIndex = currentItems.findIndex((item) => String(item.id) === String(normalizedProduct.id));

  if (existingItemIndex >= 0) {
    const nextItems = [...currentItems];
    const currentItem = nextItems[existingItemIndex];
    nextItems[existingItemIndex] = normalizeCartItem(normalizedProduct, currentItem.quantity + quantity);
    return writeCartSnapshot(nextItems);
  }

  return writeCartSnapshot([...currentItems, normalizedProduct]);
}

export function updateCardapioCartItemQuantity(productId, quantity) {
  const normalizedQuantity = Math.round(Number(quantity) || 0);
  const currentItems = readCartSnapshot();

  if (normalizedQuantity <= 0) {
    return writeCartSnapshot(currentItems.filter((item) => String(item.id) !== String(productId)));
  }

  return writeCartSnapshot(
    currentItems.map((item) =>
      String(item.id) === String(productId) ? normalizeCartItem(item, normalizedQuantity) : item
    )
  );
}

export function removeCardapioCartItem(productId) {
  const currentItems = readCartSnapshot();
  return writeCartSnapshot(currentItems.filter((item) => String(item.id) !== String(productId)));
}

export function clearCardapioCart() {
  removeCartSnapshot();
  return [];
}