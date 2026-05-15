import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  Grid2x2,
  IceCream,
  Info,
  Minus,
  Pizza,
  Plus,
  Search,
  ShoppingBag,
  Soup,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { CARDAPIO_API_ROOT_URL } from "../services/cardapioApi";
import "../styles/CardapioProductsShowcase.css";

function formatPrice(price) {
  return Number(price || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return null;
  }

  if (String(assetPath).startsWith("http")) {
    return assetPath;
  }

  return `${CARDAPIO_API_ROOT_URL}${String(assetPath).startsWith("/") ? "" : "/"}${assetPath}`;
}

function resolveProductImage(product) {
  return resolveAssetUrl(
    product?.image_path ||
      product?.imagem ||
      product?.image ||
      product?.capa_imagem ||
      product?.capaImagem ||
      null
  );
}

function resolveCategoryId(product) {
  return product?.categoria_id ?? product?.categoriaId ?? product?.grupo?.id ?? product?.grupoId ?? null;
}

function getIconComponent(iconName) {
  const iconMap = {
    Utensils,
    Coffee,
    Pizza,
    IceCream,
    Soup,
    Wine,
  };

  return iconMap[iconName] || Grid2x2;
}

function getRelativePosition(index, activeIndex, totalItems) {
  if (!totalItems) {
    return 0;
  }

  let distance = index - activeIndex;

  if (distance > totalItems / 2) {
    distance -= totalItems;
  }

  if (distance < -totalItems / 2) {
    distance += totalItems;
  }

  return distance;
}

function buildIndicators(totalItems, activeIndex) {
  if (totalItems <= 8) {
    return Array.from({ length: totalItems }, (_, index) => index);
  }

  const windowStart = Math.min(Math.max(activeIndex - 3, 0), totalItems - 8);
  return Array.from({ length: 8 }, (_, index) => windowStart + index);
}

function CardapioProductsShowcasePage({
  mode = "products",
  groups = [],
  group,
  products = [],
  cartCount = 0,
  cartItems = [],
  isCartOpen = false,
  onOpenCart,
  onCloseCart,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onClearCart,
  onSelectGroup,
  onBack,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") {
      return 1366;
    }

    return window.innerWidth;
  });
  const dragStartXRef = useRef(null);
  const groupsRailRef = useRef(null);
  const [groupsRailState, setGroupsRailState] = useState({
    enabled: false,
    canLeft: false,
    canRight: false,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    syncViewportWidth();
    window.addEventListener("resize", syncViewportWidth);

    return () => window.removeEventListener("resize", syncViewportWidth);
  }, []);

  useEffect(() => {
    setSearchTerm("");
    setActiveSlide(0);
  }, [group?.id, mode]);

  useEffect(() => {
    if (mode !== "products") {
      return undefined;
    }

    const railElement = groupsRailRef.current;
    if (!railElement) {
      return undefined;
    }

    const updateRailState = () => {
      const maxScroll = Math.max(railElement.scrollWidth - railElement.clientWidth, 0);
      const currentLeft = railElement.scrollLeft;

      setGroupsRailState({
        enabled: maxScroll > 8,
        canLeft: currentLeft > 2,
        canRight: currentLeft < maxScroll - 2,
      });
    };

    updateRailState();
    railElement.addEventListener("scroll", updateRailState, { passive: true });
    window.addEventListener("resize", updateRailState);

    return () => {
      railElement.removeEventListener("scroll", updateRailState);
      window.removeEventListener("resize", updateRailState);
    };
  }, [groups.length, mode]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      const candidate = `${product?.nome || ""} ${product?.descricao || ""}`.toLowerCase();
      return candidate.includes(normalizedSearch);
    });
  }, [products, searchTerm]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setActiveSlide(0);
      return;
    }

    setActiveSlide((currentValue) => Math.min(currentValue, filteredProducts.length - 1));
  }, [filteredProducts.length]);

  const activeProduct = filteredProducts[activeSlide] || null;
  const activeProductGroupId = activeProduct ? resolveCategoryId(activeProduct) : null;
  const activeProductGroup = useMemo(
    () => groups.find((item) => String(item.id) === String(activeProductGroupId)) || group || null,
    [activeProductGroupId, group, groups]
  );
  const heroImage = activeProduct ? resolveProductImage(activeProduct) : null;
  const indicators = useMemo(
    () => buildIndicators(filteredProducts.length, activeSlide),
    [activeSlide, filteredProducts.length]
  );
  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.preco || 0) * Number(item.quantity || 0), 0),
    [cartItems]
  );
  const shellLabel = mode === "products" ? "Produtos" : group?.nome || "Grupo";
  const isPhoneLayout = viewportWidth <= 640;
  const isCompactPhone = viewportWidth <= 420;

  useEffect(() => {
    if (mode !== "products") {
      return;
    }

    const railElement = groupsRailRef.current;
    if (!railElement || !activeProductGroupId) {
      return;
    }

    const activeGroupButton = railElement.querySelector(`[data-group-id="${String(activeProductGroupId)}"]`);
    if (activeGroupButton instanceof HTMLElement) {
      activeGroupButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeProductGroupId, mode]);

  function goNext() {
    if (!filteredProducts.length) {
      return;
    }

    setActiveSlide((currentValue) => (currentValue + 1) % filteredProducts.length);
  }

  function goPrev() {
    if (!filteredProducts.length) {
      return;
    }

    setActiveSlide((currentValue) => (currentValue - 1 + filteredProducts.length) % filteredProducts.length);
  }

  function startSwipe(clientX) {
    dragStartXRef.current = clientX;
  }

  function triggerSwipeIfNeeded(clientX) {
    if (dragStartXRef.current == null) {
      return;
    }

    const deltaX = clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (Math.abs(deltaX) < 46) {
      return;
    }

    if (deltaX < 0) {
      goNext();
      return;
    }

    goPrev();
  }

  function endSwipe(clientX) {
    triggerSwipeIfNeeded(clientX);
  }

  function handleMouseDown(event) {
    startSwipe(event.clientX);
  }

  function handleMouseUp(event) {
    endSwipe(event.clientX);
  }

  function handleTouchStart(event) {
    const touchPoint = event.touches?.[0];
    if (!touchPoint) {
      return;
    }

    startSwipe(touchPoint.clientX);
  }

  function handleTouchEnd(event) {
    const touchPoint = event.changedTouches?.[0];
    if (!touchPoint) {
      return;
    }

    endSwipe(touchPoint.clientX);
  }

  function handleTouchMove(event) {
    const touchPoint = event.touches?.[0];
    if (!touchPoint || dragStartXRef.current == null) {
      return;
    }

    const deltaX = touchPoint.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) < 46) {
      return;
    }

    triggerSwipeIfNeeded(touchPoint.clientX);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      goNext();
    }

    if (event.key === "ArrowLeft") {
      goPrev();
    }
  }

  function slideGroups(direction) {
    const railElement = groupsRailRef.current;
    if (!railElement) {
      return;
    }

    const scrollStep = Math.max(railElement.clientWidth * 0.58, 220);
    railElement.scrollBy({ left: scrollStep * direction, behavior: "smooth" });
  }

  return (
    <div
      className={`cps-root cps-root-${mode} ${isLoaded ? "is-loaded" : ""} ${isPhoneLayout ? "is-phone-layout" : ""} ${isCompactPhone ? "is-phone-compact" : ""}`}
      style={heroImage ? { "--cps-hero-image": `url("${heroImage}")` } : undefined}
    >
      <div className="cps-ambient cps-ambient-top" aria-hidden="true" />
      <div className="cps-ambient cps-ambient-bottom" aria-hidden="true" />
      <div className="cps-hero-blur" aria-hidden="true" />

      <header className="cps-header">
        <div className="cps-header-copy">
          <span className="cps-kicker">Nosso Menu</span>
          <h1>{shellLabel}</h1>
        </div>

        <div className="cps-header-actions">
          {mode === "group" && typeof onBack === "function" ? (
            <button type="button" className="cps-action-btn cps-action-btn-muted" onClick={onBack}>
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </button>
          ) : null}

          <label className="cps-search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar produto"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <button type="button" className="cps-cart-btn" onClick={onOpenCart}>
            <ShoppingBag size={20} />
            {cartCount ? <span>{cartCount}</span> : null}
          </button>
        </div>
      </header>

      <div className="cps-stage-shell">
        <button type="button" className="cps-nav-btn cps-nav-prev" onClick={goPrev} aria-label="Anterior">
          <ArrowLeft size={28} />
        </button>

        <div
          className="cps-stage"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            dragStartXRef.current = null;
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            dragStartXRef.current = null;
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {!filteredProducts.length ? (
            <div className="cps-empty-state">
              <h3>Nenhum produto encontrado</h3>
              <p>Ajuste a busca ou selecione outro grupo.</p>
            </div>
          ) : (
            <div className="cps-stack">
              {filteredProducts.map((product, index) => {
                const distance = getRelativePosition(index, activeSlide, filteredProducts.length);
                const isCenter = distance === 0;
                const translatePercent = isPhoneLayout ? 16 : 22;
                const translateDepth = isPhoneLayout ? -120 : -160;
                const rotateAmount = isPhoneLayout ? -14 : -18;
                const sideScale = isPhoneLayout ? 0.88 : 0.82;
                const sideOpacity = isPhoneLayout ? 0.3 : 0.42;

                if (Math.abs(distance) > 2) {
                  return null;
                }

                if (isCompactPhone && !isCenter) {
                  return null;
                }

                const productImage = resolveProductImage(product);

                return (
                  <article
                    key={product.id}
                    className={`cps-slide${isCenter ? " is-center" : ""}`}
                    onClick={() => setActiveSlide(index)}
                    style={{
                      transform: `translateX(${distance * translatePercent}%) translateZ(${isCenter ? "0px" : `${translateDepth}px`}) rotateY(${distance * rotateAmount}deg) scale(${isCenter ? 1 : sideScale})`,
                      opacity: isCenter ? 1 : sideOpacity,
                      zIndex: 40 - Math.abs(distance),
                      filter: isCenter ? "none" : "blur(1.2px)",
                    }}
                  >
                    <div className="cps-card">
                      <div className="cps-card-media">
                        {productImage ? <img src={productImage} alt={product.nome} draggable={false} /> : <div className="cps-card-placeholder">JR</div>}
                      </div>

                      <div className="cps-card-overlay" />

                      {isCenter ? (
                        <div className="cps-card-content">
                          <div className="cps-info-chip">
                            <Info size={14} />
                            <span>{activeProductGroup?.nome || "Selecao da casa"}</span>
                          </div>

                          <div className="cps-product-info-clean">
                            <h3 className="cps-product-title-clean">{product.nome}</h3>

                            <div className="cps-product-price-clean">
                              <strong>{formatPrice(product.preco)}</strong>
                              <span aria-hidden="true" />
                            </div>

                            <p className="cps-card-description cps-product-description-clean">
                              {product.descricao || "Receita preparada com os ingredientes disponiveis hoje."}
                            </p>

                            <button
                              type="button"
                              className="cps-add-btn cps-add-btn-clean"
                              onClick={() => onAddToCart?.(product)}
                              aria-label={`Adicionar ${product.nome} à sacola`}
                            >
                              <Plus size={18} />
                              <span>Adicionar</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="cps-side-caption">
                          <span>{product.nome}</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {filteredProducts.length ? (
          <div className="cps-mobile-product-nav" role="navigation" aria-label="Navegação dos produtos">
            <button type="button" className="cps-mobile-product-nav-btn" onClick={goPrev} aria-label="Produto anterior">
              <ArrowLeft size={16} />
              <span>Anterior</span>
            </button>

            <small>
              {activeSlide + 1}/{Math.max(filteredProducts.length, 1)}
            </small>

            <button type="button" className="cps-mobile-product-nav-btn" onClick={goNext} aria-label="Próximo produto">
              <span>Próximo</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : null}

        <button type="button" className="cps-nav-btn cps-nav-next" onClick={goNext} aria-label="Próximo">
          <ArrowRight size={28} />
        </button>
      </div>

      <footer className="cps-footer">
        {mode === "products" ? (
          <div className="cps-groups-slider">
            <button
              type="button"
              className="cps-groups-nav"
              onClick={() => slideGroups(-1)}
              disabled={!groupsRailState.enabled || !groupsRailState.canLeft}
              aria-label="Deslizar grupos para esquerda"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="cps-groups-rail" role="navigation" aria-label="Grupos disponíveis" ref={groupsRailRef}>
              {groups.map((item) => {
                const GroupIcon = item.icon ? getIconComponent(item.icon) : Utensils;
                const isActive = String(item.id) === String(activeProductGroupId);

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`cps-group-pill ${isActive ? "is-active" : ""}`}
                    onClick={() => onSelectGroup?.(item.id)}
                    data-group-id={item.id}
                  >
                    <span className="cps-group-pill-icon">
                      <GroupIcon size={16} />
                    </span>
                    <span>{item.nome}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="cps-groups-nav"
              onClick={() => slideGroups(1)}
              disabled={!groupsRailState.enabled || !groupsRailState.canRight}
              aria-label="Deslizar grupos para direita"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="cps-group-single-pill">
            <span>{group?.nome || "Grupo selecionado"}</span>
          </div>
        )}

        <div className="cps-indicators">
          {indicators.map((index) => (
            <button
              key={index}
              type="button"
              className={`cps-indicator ${index === activeSlide ? "is-active" : ""}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Ir para o produto ${index + 1}`}
            />
          ))}
        </div>
      </footer>

      <div className={`cps-cart-backdrop ${isCartOpen ? "is-open" : ""}`} onClick={onCloseCart} />
      <aside className={`cps-cart-drawer ${isCartOpen ? "is-open" : ""}`} aria-hidden={!isCartOpen}>
        <header className="cps-cart-header">
          <div>
            <strong>Sacola</strong>
            <span>Itens guardados por 2 horas no navegador.</span>
          </div>

          <button type="button" className="cps-cart-close" onClick={onCloseCart}>
            <X size={18} />
          </button>
        </header>

        <div className="cps-cart-body">
          {cartItems.length ? (
            cartItems.map((item) => {
              const itemImage = resolveProductImage(item);
              return (
                <article key={item.id} className="cps-cart-item">
                  <div className="cps-cart-item-media">
                    {itemImage ? <img src={itemImage} alt={item.nome} /> : <div className="cps-card-placeholder">JR</div>}
                  </div>

                  <div className="cps-cart-item-content">
                    <strong>{item.nome}</strong>
                    <span>{formatPrice(item.preco)}</span>
                    <div className="cps-cart-qty-row">
                      <button
                        type="button"
                        className="cps-qty-btn"
                        onClick={() => onUpdateCartQuantity?.(item.id, Number(item.quantity || 1) - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <small>{item.quantity}</small>
                      <button
                        type="button"
                        className="cps-qty-btn"
                        onClick={() => onUpdateCartQuantity?.(item.id, Number(item.quantity || 1) + 1)}
                      >
                        <Plus size={14} />
                      </button>
                      <button type="button" className="cps-cart-remove" onClick={() => onRemoveCartItem?.(item.id)}>
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="cps-cart-empty">
              <ShoppingBag size={20} />
              <p>Sua sacola está vazia.</p>
            </div>
          )}
        </div>

        <footer className="cps-cart-footer">
          <div className="cps-cart-total-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="cps-cart-footer-actions">
            <button type="button" className="cps-cart-secondary" onClick={onClearCart}>
              Limpar sacola
            </button>
            <button type="button" className="cps-cart-primary" onClick={onCloseCart}>
              Continuar pedido
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

export default CardapioProductsShowcasePage;